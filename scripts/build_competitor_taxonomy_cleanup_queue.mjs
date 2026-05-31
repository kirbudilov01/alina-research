import fs from 'fs';

const OUT = 'data_processed/competitor_taxonomy_cleanup_queue.csv';
const DOC = 'docs/competitive/competitor-taxonomy-cleanup-queue-v1.md';

for (const dir of ['data_processed', 'docs/competitive']) fs.mkdirSync(dir, { recursive: true });

function clean(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function csvEscape(value) {
  return `"${clean(value).replace(/"/g, '""')}"`;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (ch === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (ch !== '\r') {
      field += ch;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [headers, ...body] = rows;
  if (!headers) return [];
  return body.filter(r => r.some(Boolean)).map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])));
}

function csv(file) {
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : [];
}

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, `${[headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n')}\n`);
}

function mdTable(rows, columns) {
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = rows.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '<br>')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function includesAny(text, tokens) {
  const lower = text.toLowerCase();
  return tokens.some(token => lower.includes(token));
}

function suggest(row) {
  const text = `${row.app_name} ${row.source_evidence_excerpt} ${row.retention_tags} ${row.top_review_jtbd}`.toLowerCase();
  if (includesAny(text, ['roleplay', 'role-play', 'character ai', 'ai companion', 'companions', 'chat with characters', 'fantasy roleplay', 'crush'])) {
    return {
      suggested_archetype: 'ai_companion_roleplay',
      suggested_market_role_ru: 'AI companion / identity benchmark',
      cleanup_reason_ru: 'публичное описание сильнее указывает на AI characters/companions/roleplay, чем на tarot/oracle symbolic guidance'
    };
  }
  if (includesAny(text, ['habit tracker', 'routine', 'planner', 'schedule', 'track your routine', 'build lasting habits'])) {
    return {
      suggested_archetype: 'gamified_self_improvement',
      suggested_market_role_ru: 'coaching / habits / progression',
      cleanup_reason_ru: 'публичное описание сильнее указывает на habit tracking/routine/planning, чем на AI companion roleplay'
    };
  }
  if (includesAny(text, ['oracle', 'cards', 'tarot', 'spiritual', 'inner self', 'guiding light'])) {
    return {
      suggested_archetype: 'tarot_or_oracle_guidance',
      suggested_market_role_ru: 'tarot / oracle / symbolic guidance',
      cleanup_reason_ru: 'публичное описание действительно указывает на oracle/tarot/symbolic guidance'
    };
  }
  return {
    suggested_archetype: row.archetype,
    suggested_market_role_ru: 'needs manual read',
    cleanup_reason_ru: 'нет надежного deterministic rule; оставить строку в очереди для ручного taxonomy read'
  };
}

const top100 = csv('data_processed/top100_competitor_review_scorecard.csv')
  .filter(row => row.duplicate_flag !== 'duplicate_app_entry');

const noisyArchetypes = new Set(['ai_companion_roleplay', 'tarot_or_oracle_guidance']);
const queued = top100
  .filter(row => noisyArchetypes.has(row.archetype))
  .map((row, index) => {
    const s = suggest(row);
    const changeNeeded = s.suggested_archetype !== row.archetype ? 'suggested_change' : 'confirm_or_manual_read';
    return {
      cleanup_id: `TAX_${String(index + 1).padStart(2, '0')}`,
      review_rank: row.review_rank,
      app_store_id: row.app_store_id,
      app_name: row.app_name,
      seller_name: row.seller_name,
      current_archetype: row.archetype,
      suggested_archetype: s.suggested_archetype,
      suggested_market_role_ru: s.suggested_market_role_ru,
      cleanup_status: 'queued_not_applied',
      change_needed: changeNeeded,
      competitive_verdict: row.competitive_verdict,
      competitive_threat_score: row.competitive_threat_score,
      cleanup_reason_ru: s.cleanup_reason_ru,
      evidence_excerpt_short: clean(row.source_evidence_excerpt).slice(0, 260),
      source_url: row.app_store_url,
      target_file_after_review: 'data_processed/top100_competitor_review_scorecard.csv',
      claim_boundary_ru: 'Cleanup suggestion is deterministic pre-review. Не переписывать source taxonomy и не апгрейдить claims, пока строку не подтвердит ручной taxonomy pass.'
    };
  });

writeCsv(OUT, queued, [
  'cleanup_id',
  'review_rank',
  'app_store_id',
  'app_name',
  'seller_name',
  'current_archetype',
  'suggested_archetype',
  'suggested_market_role_ru',
  'cleanup_status',
  'change_needed',
  'competitive_verdict',
  'competitive_threat_score',
  'cleanup_reason_ru',
  'evidence_excerpt_short',
  'source_url',
  'target_file_after_review',
  'claim_boundary_ru'
]);

const changes = queued.filter(row => row.change_needed === 'suggested_change').length;
const confirms = queued.filter(row => row.change_needed !== 'suggested_change').length;

const lines = [];
lines.push('# Competitor Taxonomy Cleanup Queue V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString().slice(0, 10)}`);
lines.push('');
lines.push('## Зачем нужен этот слой');
lines.push('');
lines.push('Этот queue превращает найденный шум в competitor taxonomy в конкретную рабочую очередь. Он не переписывает исходный top-100 scorecard автоматически: каждая строка остается queued_not_applied, пока ее не подтвердит ручной taxonomy pass.');
lines.push('');
lines.push('## Краткая сводка');
lines.push('');
lines.push(`- Строк в очереди: ${queued.length}`);
lines.push(`- Предложенных изменений: ${changes}`);
lines.push(`- Подтвердить/прочитать вручную: ${confirms}`);
lines.push('');
lines.push('## Таблица cleanup');
lines.push('');
lines.push(mdTable(queued.map(row => ({
  id: row.cleanup_id,
  rank: row.review_rank,
  app: row.app_name,
  current: row.current_archetype,
  suggested: row.suggested_archetype,
  status: row.change_needed,
  reason: row.cleanup_reason_ru
})), [
  { key: 'id', label: 'ID' },
  { key: 'rank', label: 'Rank', align: 'right' },
  { key: 'app', label: 'App' },
  { key: 'current', label: 'Current' },
  { key: 'suggested', label: 'Suggested' },
  { key: 'status', label: 'Status' },
  { key: 'reason', label: 'Почему' }
]));
lines.push('');
lines.push('## Граница применения');
lines.push('');
lines.push('Это очередь cleanup, а не примененное исправление. Она должна улучшить будущую карту competitor archetypes, но H1/H3/H4/H6 все еще требуют настоящего app walkthrough evidence перед любым claim upgrade.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push('- `data_processed/top100_competitor_review_scorecard.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`competitor_taxonomy_cleanup_queue=${OUT}`);
console.log(`doc=${DOC}`);
console.log(`queued=${queued.length}`);
console.log(`suggested_changes=${changes}`);
