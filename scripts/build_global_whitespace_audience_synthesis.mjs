import fs from 'fs';

const OUT = 'data_processed/global_whitespace_audience_synthesis.csv';
const DOC = 'docs/intersections/global-whitespace-audience-synthesis-v1.md';

for (const dir of ['data_processed', 'docs/intersections']) fs.mkdirSync(dir, { recursive: true });

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
  const header = rows.shift();
  if (!header) return [];
  return rows
    .filter(r => r.some(Boolean))
    .map(r => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

function csv(file) {
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : [];
}

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, `${[headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n')}\n`);
}

function mdTable(rows, columns, limit = rows.length) {
  const limited = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '<br>')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function num(value) {
  const n = Number(String(value ?? '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function fmt(value) {
  return Math.round(num(value)).toLocaleString('en-US');
}

function pct(value) {
  const n = num(value);
  return `${n.toFixed(n % 1 ? 2 : 0)}%`;
}

function marketRu(value) {
  return ({
    mindfulness: 'Mindfulness / reset',
    avatar_identity: 'Avatar / identity',
    astrology_esoterics: 'Astrology / esoterics',
    coaching: 'Coaching / self-improvement',
    gaming: 'Gaming / progression benchmark',
    gaming_progression: 'Gaming / progression benchmark'
  })[clean(value)] || clean(value);
}

function primaryAudienceForMarket(niche, icpRows) {
  const n = clean(niche);
  const matches = icpRows
    .filter(row => clean(row.primary_markets).split('|').includes(n) || (n === 'gaming' && clean(row.primary_markets).includes('gaming')))
    .sort((a, b) => Number(b.evidence_score || 0) - Number(a.evidence_score || 0));
  return matches.slice(0, 2);
}

function synthesisRead(row) {
  const niche = clean(row.niche);
  const rate = num(row.full_loop_rate_pct);
  if (niche === 'gaming' || niche === 'gaming_progression') {
    return 'использовать как источник механик прогресса и возврата, но не как прямое доказательство whitespace Alina';
  }
  if (rate < 5) {
    return 'узкое белое пятно выглядит правдоподобно: full-loop candidates редки, но нужен P0 walkthrough';
  }
  if (rate < 10) {
    return 'возможность есть, но sampling обязателен: рынок может скрывать близкие петли внутри onboarding';
  }
  return 'рынок видим и плотен; whitespace claim слабый без нового ручного evidence';
}

function firstValidationMove(row, audienceRows) {
  const n = clean(row.niche);
  if (n === 'gaming' || n === 'gaming_progression') {
    return 'взять progression/avatar/retention паттерны в прототип, но не использовать gaming как H3 proof';
  }
  if (audienceRows.some(row => clean(row.priority_ru).startsWith('P0'))) {
    return 'сначала проверить P0-аудиторию через recent behavior интервью, затем walkthrough high-risk конкурентов';
  }
  return 'использовать как compare-сегмент после P0 ICP и high-risk competitor walkthrough';
}

const whitespace = csv('data_processed/russian_whitespace_decision_map.csv')
  .filter(row => ['mindfulness', 'avatar_identity', 'astrology_esoterics', 'coaching', 'gaming'].includes(row.niche));
const icp = csv('data_processed/russian_icp_battlecards.csv');

const rows = whitespace.map(row => {
  const audienceRows = primaryAudienceForMarket(row.niche, icp);
  return {
    market_id: row.niche,
    market_ru: marketRu(row.niche),
    cross_source_dedup_rows: row.cross_source_dedup_rows,
    saturation_score_0_100: row.saturation_score_0_100,
    full_loop_rate_pct: pct(row.full_loop_rate_pct),
    full_loop_scarcity_score: row.full_loop_scarcity_score,
    behavior_identity_or_progress_signals: row.behavior_identity_or_progress_signals,
    money_signal_rows: row.money_signal_rows,
    whitespace_read_ru: synthesisRead(row),
    h3_decision_read_ru: row.h3_decision_read_ru,
    top_public_risk_apps: row.top_public_risk_apps,
    primary_icp_segments_ru: audienceRows.map(a => `${a.segment_id}: ${a.segment_name}`).join(' | '),
    audience_fit_ru: audienceRows.map(a => `${a.segment_name}: ${a.core_job_ru}`).join(' | '),
    audience_boundary_ru: audienceRows.length
      ? 'аудитория directional; primary ICP нельзя выбирать без recent-behavior интервью, WTP и prototype sessions'
      : 'аудитория не выбрана; использовать только как контекст',
    first_validation_move_ru: firstValidationMove(row, audienceRows),
    source_files: 'data_processed/russian_whitespace_decision_map.csv;data_processed/cross_source_market_saturation_matrix.csv;data_processed/russian_icp_battlecards.csv;data_processed/audience_signal_matrix.csv'
  };
});

writeCsv(OUT, rows, [
  'market_id',
  'market_ru',
  'cross_source_dedup_rows',
  'saturation_score_0_100',
  'full_loop_rate_pct',
  'full_loop_scarcity_score',
  'behavior_identity_or_progress_signals',
  'money_signal_rows',
  'whitespace_read_ru',
  'h3_decision_read_ru',
  'top_public_risk_apps',
  'primary_icp_segments_ru',
  'audience_fit_ru',
  'audience_boundary_ru',
  'first_validation_move_ru',
  'source_files'
]);

const lines = [];
lines.push('# Global Whitespace / Audience Synthesis V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Что доказывает этот слой');
lines.push('');
lines.push('Этот слой соединяет конкурентное белое пятно и аудиторию. Он показывает не только где full-loop candidates редки или рынок плотный, но и какие ICP-сегменты имеют directional fit с этим рынком. Это bridge между H3 и H5: whitespace нельзя читать отдельно от того, кто реально будет пользоваться продуктом.');
lines.push('');
lines.push('## Synthesis Matrix');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'market_ru', label: 'Рынок' },
  { key: 'cross_source_dedup_rows', label: 'Dedup rows', align: 'right' },
  { key: 'full_loop_rate_pct', label: 'Full-loop rate' },
  { key: 'whitespace_read_ru', label: 'Whitespace read' },
  { key: 'primary_icp_segments_ru', label: 'ICP fit' },
  { key: 'first_validation_move_ru', label: 'Первый validation move' }
]));
lines.push('');
lines.push('## Boundary');
lines.push('');
lines.push('Эта матрица не закрывает H3 и H5. Она только показывает, где есть directional связка “рынок -> разрыв -> аудитория”. Апгрейд возможен после manual competitor walkthrough, recent-behavior interviews, prototype sessions и WTP checks.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push('- `data_processed/russian_whitespace_decision_map.csv`');
lines.push('- `data_processed/russian_icp_battlecards.csv`');
lines.push('- `data_processed/audience_signal_matrix.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`global_whitespace_audience_synthesis=${OUT}`);
console.log(`doc=${DOC}`);
console.log(`rows=${rows.length}`);
