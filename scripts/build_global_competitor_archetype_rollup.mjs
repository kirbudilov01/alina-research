import fs from 'fs';

const OUT = 'data_processed/global_competitor_archetype_rollup.csv';
const DOC = 'docs/competitive/global-competitor-archetype-rollup-v1.md';

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

function num(value) {
  const n = Number(String(value ?? '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function fmt(value) {
  return Math.round(num(value)).toLocaleString('en-US');
}

function avg(rows, key) {
  if (!rows.length) return 0;
  return rows.reduce((sum, row) => sum + num(row[key]), 0) / rows.length;
}

function max(rows, key) {
  return rows.reduce((m, row) => Math.max(m, num(row[key])), 0);
}

function count(rows, predicate) {
  return rows.filter(predicate).length;
}

function archetypeRole(archetype) {
  return ({
    faith_devotional_habit: {
      primary_market_ru: 'spiritual meaning / habit loop',
      role_ru: 'самый рискованный прямой reference-класс: смысл, ежедневный ритуал, действие и avatar/progress могут быть связаны уже в public promise'
    },
    manifestation_tool: {
      primary_market_ru: 'astrology / manifestation / self-improvement',
      role_ru: 'показывает спрос на meaning, ritual и transformation language, но часто требует проверки causality и safety'
    },
    avatar_identity_coaching: {
      primary_market_ru: 'avatar / identity + coaching',
      role_ru: 'проверяет, является ли avatar/identity прогрессом или декоративным профилем поверх обычного coaching'
    },
    gamified_self_improvement: {
      primary_market_ru: 'coaching / habits / progression',
      role_ru: 'проверяет action, streak, quest и progress mechanics; часто близко к H4/H6, но не всегда имеет personal meaning'
    },
    astrology_guidance: {
      primary_market_ru: 'astrology / esoterics',
      role_ru: 'дает personal/symbolic meaning и willingness-to-pay context, но часто остается reading/guidance без grounded action'
    },
    tarot_or_oracle_guidance: {
      primary_market_ru: 'tarot / oracle / symbolic guidance',
      role_ru: 'показывает symbolic interpretation и personalization expectations, но обычно слабее по action/progress loop'
    },
    ai_companion_roleplay: {
      primary_market_ru: 'AI companion / identity benchmark',
      role_ru: 'не прямой рынок Alina; важен для trust, personalization и parasocial/safety границ'
    }
  })[archetype] || {
    primary_market_ru: 'unknown adjacent',
    role_ru: 'требует ручной классификации'
  };
}

function topApps(rows, limit = 4) {
  return rows
    .slice()
    .sort((a, b) => num(b.competitive_threat_score || b.validation_priority_score) - num(a.competitive_threat_score || a.validation_priority_score))
    .slice(0, limit)
    .map(row => `${row.app_name} (${row.competitive_verdict || row.competitive_verdict_prefill}; score ${row.competitive_threat_score || row.validation_priority_score})`)
    .join(' | ');
}

function verdictCounts(rows) {
  const counts = {};
  for (const row of rows) {
    const verdict = row.competitive_verdict || row.competitive_verdict_prefill || 'unknown';
    counts[verdict] = (counts[verdict] || 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
}

const top100 = csv('data_processed/top100_competitor_review_scorecard.csv')
  .filter(row => row.duplicate_flag !== 'duplicate_app_entry');
const battlecards = csv('data_processed/russian_competitor_battlecards.csv');
const manualPacket = csv('data_processed/manual_competitor_inspection_packet.csv');

const archetypes = [...new Set(top100.map(row => row.archetype).filter(Boolean))].sort();

const rows = archetypes.map(archetype => {
  const topRows = top100.filter(row => row.archetype === archetype);
  const battleRows = battlecards.filter(row => row.archetype === archetype);
  const manualRows = manualPacket.filter(row => row.archetype === archetype);
  const role = archetypeRole(archetype);
  const behaviorTied = count(topRows, row => row.behavior_tied_progression === 'yes');
  const strongMoney = count(topRows, row => row.pricing_tags && row.pricing_tags !== 'none');
  const close = count(topRows, row => ['direct_reference_competitor', 'high_priority_close_substitute', 'close_substitute'].includes(row.competitive_verdict));

  return {
    archetype,
    primary_market_ru: role.primary_market_ru,
    role_ru: role.role_ru,
    top100_primary_apps: fmt(topRows.length),
    close_or_direct_apps: fmt(close),
    behavior_tied_progression_apps: fmt(behaviorTied),
    paid_signal_apps: fmt(strongMoney),
    avg_core_score: avg(topRows, 'alina_core_score').toFixed(1),
    max_threat_score: max(topRows, 'competitive_threat_score').toFixed(1),
    battlecard_rows: fmt(battleRows.length),
    manual_validation_targets: fmt(manualRows.length),
    verdict_mix: verdictCounts(topRows),
    top_apps: topApps(topRows),
    immediate_validation_need_ru: manualRows.length
      ? 'есть P0/manual targets: нужно пройти public listing -> onboarding -> first action -> progress/avatar feedback -> paywall boundary'
      : 'пока использовать как category context; апгрейдить только после sampling/walkthrough',
    taxonomy_quality_ru: ['ai_companion_roleplay', 'tarot_or_oracle_guidance'].includes(archetype)
      ? 'taxonomy_needs_manual_cleanup_before_claim_use'
      : 'usable_for_directional_grouping',
    claim_boundary_ru: 'Archetype rollup основан на App Store metadata/reviews/IAP и AI-assisted scorecards; это не заменяет ручной walkthrough и не доказывает hidden-clone отсутствие.'
  };
});

writeCsv(OUT, rows, [
  'archetype',
  'primary_market_ru',
  'role_ru',
  'top100_primary_apps',
  'close_or_direct_apps',
  'behavior_tied_progression_apps',
  'paid_signal_apps',
  'avg_core_score',
  'max_threat_score',
  'battlecard_rows',
  'manual_validation_targets',
  'verdict_mix',
  'top_apps',
  'immediate_validation_need_ru',
  'taxonomy_quality_ru',
  'claim_boundary_ru'
]);

const lines = [];
lines.push('# Global Competitor Archetype Rollup V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Зачем нужен этот слой');
lines.push('');
lines.push('Этот rollup переводит top-100 competitors из списка приложений в понятные конкурентные классы. Он показывает, какие типы игроков формируют риск для Alina: spiritual habit loops, manifestation/self-improvement, avatar/identity coaching, gamified habits, astrology/tarot guidance и AI companion benchmarks.');
lines.push('');
lines.push('## Важная граница');
lines.push('');
lines.push('У top-100 scorecard нет ручной колонки “рынок/ниша”. Поэтому этот документ использует archetype mapping как промежуточную классификацию. Это помогает читать конкурентную карту, но не заменяет ручной walkthrough и не доказывает отсутствие hidden full-loop clone.');
lines.push('');
lines.push('Также важно: некоторые source archetypes шумные. AI companion / tarot-oracle классы требуют ручной taxonomy cleanup перед тем, как использовать их для сильных market/whitespace claims. В этом rollup они оставлены не как доказательство категории, а как подсказка, где классификацию надо перепроверить.');
lines.push('');
lines.push('## Archetype Table');
lines.push('');
lines.push(mdTable(rows.map(row => ({
  archetype: row.archetype,
  market: row.primary_market_ru,
  apps: row.top100_primary_apps,
  close: row.close_or_direct_apps,
  behavior: row.behavior_tied_progression_apps,
  paid: row.paid_signal_apps,
  battle: row.battlecard_rows,
  manual: row.manual_validation_targets,
  taxonomy: row.taxonomy_quality_ru,
  top: row.top_apps,
  next: row.immediate_validation_need_ru
})), [
  { key: 'archetype', label: 'Archetype' },
  { key: 'market', label: 'Market role' },
  { key: 'apps', label: 'Top-100 apps', align: 'right' },
  { key: 'close', label: 'Close/direct', align: 'right' },
  { key: 'behavior', label: 'Behavior-tied', align: 'right' },
  { key: 'paid', label: 'Paid signal', align: 'right' },
  { key: 'battle', label: 'Battlecards', align: 'right' },
  { key: 'manual', label: 'Manual targets', align: 'right' },
  { key: 'taxonomy', label: 'Taxonomy' },
  { key: 'top', label: 'Top examples' },
  { key: 'next', label: 'Следующая проверка' }
]));
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push('- `data_processed/top100_competitor_review_scorecard.csv`');
lines.push('- `data_processed/russian_competitor_battlecards.csv`');
lines.push('- `data_processed/manual_competitor_inspection_packet.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`global_competitor_archetype_rollup=${OUT}`);
console.log(`doc=${DOC}`);
console.log(`archetypes=${rows.length}`);
console.log(`top100_primary=${top100.length}`);
