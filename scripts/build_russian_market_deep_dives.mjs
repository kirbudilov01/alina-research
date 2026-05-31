import fs from 'fs';

const OUT = 'data_processed/russian_market_deep_dives.csv';
const DOC = 'docs/market/russian-market-deep-dives-v1.md';

for (const dir of ['data_processed', 'docs/market']) fs.mkdirSync(dir, { recursive: true });

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

function clean(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function csvEscape(value) {
  return `"${clean(value).replace(/"/g, '""')}"`;
}

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, [headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n'));
}

function mdTable(rows, columns, limit = rows.length) {
  const limited = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function money(value) {
  const n = Number(String(value ?? '').replace(/[^\d.-]/g, ''));
  if (!Number.isFinite(n)) return clean(value) || 'n/a';
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

function count(rows, predicate) {
  return rows.filter(predicate).length;
}

function countBy(rows, key) {
  const out = {};
  for (const row of rows) out[row[key] || 'unknown'] = (out[row[key] || 'unknown'] || 0) + 1;
  return out;
}

function topCounts(rows, key, limit = 3) {
  return Object.entries(countBy(rows, key))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ');
}

function includesAny(value, needles) {
  const text = clean(value).toLowerCase();
  return needles.some(needle => text.includes(needle));
}

const coverage = csv('data_processed/cross_source_coverage_matrix.csv');
const saturation = csv('data_processed/cross_source_market_saturation_matrix.csv');
const tam = csv('data_processed/tam_sam_som_model.csv');
const marketMoney = csv('data_processed/market_money_triangulation.csv');
const sourceConfidence = csv('data_processed/market_source_confidence_review.csv');
const revenueSummary = csv('data_processed/competitor_revenue_proxy_market_summary.csv');
const audience = csv('data_processed/audience_signal_matrix.csv');
const redditSignals = csv('data_processed/reddit_mention_signal_matrix.csv');
const top100 = csv('data_processed/top100_competitor_review_scorecard.csv');
const manualPacket = csv('data_processed/manual_competitor_inspection_packet.csv');

const marketSpecs = [
  {
    market_id: 'mindfulness',
    ru_name: 'Mindfulness / reset',
    role_ru: 'прямой adjacent рынок для короткого reset, сна, тревоги и ежедневной практики',
    alina_read_ru: 'нужен как доказательство привычки платить за calm/reset, но Alina должна отличаться не библиотекой медитаций, а связкой reset -> одно действие -> видимый прогресс',
    tam_key: 'mindfulness',
    money_key: 'mindfulness',
    revenue_key: 'mindfulness',
    tokens: ['mindfulness', 'meditation', 'calm', 'breath', 'sleep', 'reset']
  },
  {
    market_id: 'avatar_identity',
    ru_name: 'Avatar / identity',
    role_ru: 'рынок визуальной идентичности, аватаров, self-image и companion/creator механик',
    alina_read_ru: 'нужен как источник identity feedback, но главный риск - аватар может быть одноразовой генерацией или декором, а не причинным отражением действия',
    tam_key: 'avatar_identity',
    money_key: 'avatar_identity',
    revenue_key: 'avatar_identity',
    tokens: ['avatar', 'identity', 'character', 'persona', 'profile']
  },
  {
    market_id: 'astrology_esoterics',
    ru_name: 'Astrology / esoterics',
    role_ru: 'direct adjacent рынок личного смысла, символов, ежедневных подсказок и spiritual guidance',
    alina_read_ru: 'нужен как язык meaning и willingness-to-pay за персональные интерпретации, но claims должны быть осторожными из-за trust/safety и разброса источников',
    tam_key: 'astrology_esoterics',
    money_key: 'astrology_esoterics',
    revenue_key: 'astrology_esoterics',
    tokens: ['astrology', 'tarot', 'horoscope', 'manifest', 'spiritual', 'esoteric']
  },
  {
    market_id: 'coaching',
    ru_name: 'Coaching / self-improvement',
    role_ru: 'direct adjacent рынок намерений, целей, habit/action guidance и accountability',
    alina_read_ru: 'нужен как слой действия и структурирования, но нельзя превращать Alina в тяжелую productivity-систему или generic AI coach',
    tam_key: 'coaching',
    money_key: 'coaching',
    revenue_key: 'coaching_self_improvement',
    tokens: ['coaching', 'coach', 'habit', 'goal', 'self-improvement', 'productivity']
  },
  {
    market_id: 'gaming_progression',
    ru_name: 'Gaming / progression benchmark',
    role_ru: 'benchmark рынок прогресса, наград, возвращаемости и avatar/progression feedback',
    alina_read_ru: 'нужен как библиотека механик, но не как прямой TAM: если продукт будет ощущаться как игра ради retention, личный смысл сломается',
    tam_key: 'gaming',
    money_key: 'gaming',
    revenue_key: 'gaming_progression',
    tokens: ['gaming', 'game', 'progression', 'reward', 'level', 'cozy']
  }
];

const rows = marketSpecs.map(spec => {
  const tamRow = tam.find(row => row.pillar === spec.tam_key) || {};
  const moneyRow = marketMoney.find(row => row.pillar === spec.money_key) || {};
  const saturationRow = saturation.find(row => row.niche === spec.market_id || row.niche === spec.tam_key || (spec.market_id === 'gaming_progression' && row.niche === 'gaming')) || {};
  const coverageRows = coverage.filter(row => row.niche === spec.market_id || row.niche === spec.tam_key || (spec.market_id === 'gaming_progression' && row.niche === 'gaming'));
  const strongCoverage = count(coverageRows, row => row.coverage_band === 'strong_coverage');
  const mediumCoverage = count(coverageRows, row => row.coverage_band === 'medium_coverage');
  const revenueRow = revenueSummary.find(row => row.market === spec.revenue_key) || {};
  const sourceRows = sourceConfidence.filter(row => row.niche === spec.tam_key || row.niche === spec.market_id || (spec.market_id === 'gaming_progression' && row.niche === 'gaming'));
  const audienceRows = audience.filter(row => row.niche === spec.tam_key || row.niche === spec.market_id || includesAny(row.audience_tag, spec.tokens));
  const redditRows = redditSignals.filter(row => row.niche === spec.tam_key || row.niche === spec.market_id || includesAny(row.signal_group, spec.tokens) || includesAny(row.thread_title, spec.tokens));
  const top100Rows = top100.filter(row => includesAny(`${row.archetype} ${row.app_name} ${row.source_evidence_excerpt}`, spec.tokens));
  const primaryTop100Rows = top100Rows.filter(row => row.duplicate_flag === 'primary_app_entry');
  const manualRows = manualPacket.filter(row => includesAny(`${row.app_name} ${row.archetype} ${row.rationale}`, spec.tokens));
  const highThreat = count(primaryTop100Rows, row => Number(row.competitive_threat_score || 0) >= 24);
  const behaviorTied = count(top100Rows, row => row.behavior_tied_progression === 'yes');

  const evidence_ru = [
    `${saturationRow.cross_source_dedup_rows || 0} cross-source dedup rows`,
    `${coverageRows.length} coverage cells (${strongCoverage} strong, ${mediumCoverage} medium)`,
    `${money(moneyRow.sam_base_usd || tamRow.samBase)} SAM base`,
    `${revenueRow.strong_proxy_competitors || 0} strong competitor money proxies`,
    `${audienceRows.length} audience rows`,
    `${redditRows.length} Reddit/forum signal rows`,
    `${primaryTop100Rows.length} top-100 primary competitors`
  ].join('; ');

  let verdict_ru = 'держать как supporting market';
  if (['strong_directional_money_case', 'medium_directional_money_case'].includes(moneyRow.money_triangulation_verdict) &&
    saturationRow.opportunity_band === 'medium_opportunity_needs_sampling') {
    verdict_ru = 'приоритетный adjacent рынок для manual sampling';
  } else if (spec.market_id === 'gaming_progression') {
    verdict_ru = 'mechanic benchmark, не direct TAM';
  } else if (saturationRow.opportunity_band === 'crowded_or_unclear_context') {
    verdict_ru = 'рынок важен, но crowded/unclear без walkthrough';
  }

  const boundary_ru = spec.market_id === 'gaming_progression'
    ? 'Нельзя считать прямым рынком Alina без доказанного ritual/self-improvement overlap; использовать как механику прогресса и retention.'
    : 'Можно использовать как directional evidence, но нельзя усиливать claim до product-market proof без walkthrough, paywall signoff и пользовательских сессий.';

  return {
    market_id: spec.market_id,
    ru_name: spec.ru_name,
    role_ru: spec.role_ru,
    alina_read_ru: spec.alina_read_ru,
    tam_base_usd: tamRow.tamBase || '',
    sam_base_usd: moneyRow.sam_base_usd || tamRow.samBase || '',
    money_verdict: moneyRow.money_triangulation_verdict || '',
    money_score: moneyRow.total_money_evidence_score || '',
    source_confidence_rows: sourceRows.length,
    high_use_sources: count(sourceRows, row => row.confidence_review_band === 'high_use'),
    coverage_cells: coverageRows.length,
    strong_coverage_cells: strongCoverage,
    medium_coverage_cells: mediumCoverage,
    cross_source_dedup_rows: saturationRow.cross_source_dedup_rows || '',
    saturation_score_0_100: saturationRow.saturation_score_0_100 || '',
    opportunity_band: saturationRow.opportunity_band || '',
    high_intersection_candidates: saturationRow.high_intersection_candidates || '',
    full_loop_rate_pct: saturationRow.full_loop_rate_pct || '',
    behavior_identity_or_progress_signals: saturationRow.behavior_identity_or_progress_signals || '',
    strong_money_proxy_competitors: revenueRow.strong_proxy_competitors || '',
    medium_plus_money_proxy_competitors: revenueRow.medium_or_stronger_proxy_competitors || '',
    max_observed_price_usd: revenueRow.max_observed_price_usd || '',
    audience_signal_rows: audienceRows.length,
    reddit_signal_rows: redditRows.length,
    top_reddit_signal_groups: topCounts(redditRows, 'signal_group', 4),
    top100_primary_competitors: primaryTop100Rows.length,
    top100_high_threat_competitors: highThreat,
    behavior_tied_top100_signals: behaviorTied,
    manual_validation_targets: manualRows.length,
    verdict_ru,
    boundary_ru,
    next_validation_move_ru: saturationRow.next_validation_move || moneyRow.recommended_next_proof || 'Run manual walkthrough and user validation before claim upgrade.',
    proof_files: [
      'data_processed/tam_sam_som_model.csv',
      'data_processed/market_money_triangulation.csv',
      'data_processed/cross_source_coverage_matrix.csv',
      'data_processed/cross_source_market_saturation_matrix.csv',
      'data_processed/competitor_revenue_proxy_market_summary.csv',
      'data_processed/audience_signal_matrix.csv',
      'data_processed/reddit_mention_signal_matrix.csv',
      'data_processed/top100_competitor_review_scorecard.csv'
    ].join(';')
  };
});

const headers = [
  'market_id', 'ru_name', 'role_ru', 'alina_read_ru',
  'tam_base_usd', 'sam_base_usd', 'money_verdict', 'money_score',
  'source_confidence_rows', 'high_use_sources', 'coverage_cells', 'strong_coverage_cells', 'medium_coverage_cells',
  'cross_source_dedup_rows', 'saturation_score_0_100', 'opportunity_band', 'high_intersection_candidates',
  'full_loop_rate_pct', 'behavior_identity_or_progress_signals',
  'strong_money_proxy_competitors', 'medium_plus_money_proxy_competitors', 'max_observed_price_usd',
  'audience_signal_rows', 'reddit_signal_rows', 'top_reddit_signal_groups',
  'top100_primary_competitors', 'top100_high_threat_competitors', 'behavior_tied_top100_signals',
  'manual_validation_targets', 'verdict_ru', 'boundary_ru', 'next_validation_move_ru', 'proof_files'
];
writeCsv(OUT, rows, headers);

const lines = [];
lines.push('# Русские deep dives по пяти рынкам V1');
lines.push('');
lines.push(`Собрано: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Зачем нужен этот файл');
lines.push('');
lines.push('Этот слой переводит пять рыночных направлений из общей матрицы в читаемые market-by-market выводы. Он не добавляет новых внешних claims и не усиливает H1-H6 сам по себе: вся логика остается evidence-first, а каждый рынок получает границу утверждения и следующий validation move.');
lines.push('');
lines.push('## Сводная таблица');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'ru_name', label: 'Рынок' },
  { key: 'sam_base_usd', label: 'SAM base', align: 'right' },
  { key: 'money_verdict', label: 'Money verdict' },
  { key: 'cross_source_dedup_rows', label: 'Dedup rows', align: 'right' },
  { key: 'opportunity_band', label: 'Whitespace' },
  { key: 'verdict_ru', label: 'Русский вывод' }
]));
lines.push('');
for (const row of rows) {
  lines.push(`## ${row.ru_name}`);
  lines.push('');
  lines.push(`${row.role_ru}. Для Alina этот рынок читается так: ${row.alina_read_ru}.`);
  lines.push('');
  lines.push(`Доказательная опора: ${row.cross_source_dedup_rows || 0} dedup rows, ${row.coverage_cells} source/market coverage cells, ${row.audience_signal_rows} audience rows, ${row.reddit_signal_rows} Reddit/forum signal rows, ${row.top100_primary_competitors} top-100 primary competitors. Рыночная модель дает SAM base ${money(row.sam_base_usd)}, money verdict: ${row.money_verdict || 'n/a'}, score ${row.money_score || 'n/a'}.`);
  lines.push('');
  lines.push(`Whitespace read: ${row.opportunity_band || 'n/a'}; full-loop-like rate ${row.full_loop_rate_pct || 'n/a'}%; behavior/identity/progress signals ${row.behavior_identity_or_progress_signals || 0}. Конкурентные money proxies: ${row.strong_money_proxy_competitors || 0} strong, ${row.medium_plus_money_proxy_competitors || 0} medium+. Top Reddit signal groups: ${row.top_reddit_signal_groups || 'n/a'}.`);
  lines.push('');
  lines.push(`Вывод: ${row.verdict_ru}. Граница: ${row.boundary_ru} Следующее действие: ${row.next_validation_move_ru}`);
  lines.push('');
}
lines.push('## Файлы');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${DOC}\``);

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`russian_market_deep_dives_rows=${rows.length}`);
console.log(`doc=${DOC}`);
