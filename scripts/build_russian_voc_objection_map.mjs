import fs from 'fs';

const OUT = 'data_processed/russian_voc_objection_map.csv';
const DOC = 'docs/audience/russian-voc-objection-map-v1.md';

for (const dir of ['data_processed', 'docs/audience']) fs.mkdirSync(dir, { recursive: true });

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

function haystack(row, keys) {
  return keys.map(key => row[key] || '').join(' ').toLowerCase();
}

function matches(row, keys, keywords) {
  const text = haystack(row, keys);
  return keywords.some(keyword => text.includes(keyword));
}

function countMatches(rows, keys, keywords) {
  return rows.filter(row => matches(row, keys, keywords));
}

function topValues(rows, key, limit = 4) {
  const counts = new Map();
  for (const row of rows) {
    for (const part of clean(row[key]).split('|').map(clean).filter(Boolean)) {
      counts.set(part, (counts.get(part) || 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([value, count]) => `${value}:${count}`)
    .join(' | ');
}

const reviewClusters = csv('data_processed/review_jtbd_cluster_summary.csv');
const communitySignals = csv('data_processed/community_referral_signal_rows.csv');
const redditSignals = csv('data_processed/reddit_mention_signal_matrix.csv');
const redditQueue = csv('data_processed/reddit_manual_reading_queue.csv');
const redditPromptBank = csv('data_processed/reddit_manual_reading_prompt_bank.csv');
const icpSegments = csv('data_processed/icp_segment_matrix.csv');
const prototypeMetrics = csv('data_processed/prototype_validation_scorecard.csv');

const themeDefs = [
  {
    theme_id: 'VOC_DAILY_ANCHOR',
    theme_ru: 'Ежедневный якорь и повторяемый ритуал',
    linked_hypotheses: 'H5|H6|H4',
    keywords: ['daily', 'anchor', 'routine', 'ritual', 'return', 'course', 'consistency', 'кажд', 'ритуал'],
    opportunity_ru: 'Alina должна быть не библиотекой функций, а одним коротким ежедневным циклом, к которому понятно зачем возвращаться.',
    product_risk_ru: 'Если первый экран выглядит как меню практик, пользователь сравнит продукт с meditation/journal/habit apps и потеряет ощущение нового ядра.',
    interview_probe_ru: 'Расскажи про последний цифровой ритуал, к которому ты возвращался несколько дней подряд. Что именно заставляло открыть его снова?',
    prototype_probe_ru: 'После первого прохождения спросить: что здесь является ежедневным якорем и в какой момент ты бы вернулся завтра?',
    downgrade_rule_ru: 'Ослабить H5/H6, если участники не называют recent recurring behavior или не видят причины вернуться завтра.'
  },
  {
    theme_id: 'VOC_VISIBLE_PROGRESS',
    theme_ru: 'Видимый прогресс и доказательство, что действие помогает',
    linked_hypotheses: 'H3|H4|H6',
    keywords: ['progress', 'growth', 'visible', 'evidence', 'working', 'avatar', 'identity', 'causal', 'causality', 'shows if it', 'visual'],
    opportunity_ru: 'Сильная ставка Alina: связать meaning -> action -> visible progress так, чтобы изменение выглядело причинным, а не декоративным.',
    product_risk_ru: 'Если avatar/progress меняется произвольно, продукт станет декоративной игрушкой или обычным habit tracker с красивой оболочкой.',
    interview_probe_ru: 'Когда ты в последний раз бросил практику, потому что не видел, что она реально работает?',
    prototype_probe_ru: 'На экране изменения спросить: что изменилось, почему это изменилось и какое действие это вызвало?',
    downgrade_rule_ru: 'Ослабить H3/H4, если пользователи не могут объяснить причинность без подсказки или называют feedback косметическим.'
  },
  {
    theme_id: 'VOC_OVERBUILT_STREAK_ANXIETY',
    theme_ru: 'Перегруз, streak anxiety и тяжелые productivity-системы',
    linked_hypotheses: 'H3|H5|H6',
    keywords: ['overbuilt', 'setup', 'notification', 'streak', 'anxiety', 'missed', 'guilt', 'heavy', 'pressure', 'overwhelm', 'maintenance', 'too much'],
    opportunity_ru: 'Alina может выиграть как легкая, forgiving петля без наказания за пропуск и без ощущения обслуживания системы.',
    product_risk_ru: 'Если добавить streak pressure, сложные настройки или много обязательных шагов, продукт попадет в прямо отвергаемый паттерн.',
    interview_probe_ru: 'Что в последнем self-improvement/productivity app стало слишком тяжелым или давящим?',
    prototype_probe_ru: 'После flow спросить: это ощущается как поддержка или как еще одна система, которую надо обслуживать?',
    downgrade_rule_ru: 'Ослабить H5/H6, если P0 сегменты воспринимают петлю как pressure, chores или guilt machine.'
  },
  {
    theme_id: 'VOC_PERSONALIZATION_FEEL_SEEN',
    theme_ru: 'Персонализация и ощущение “меня увидели”',
    linked_hypotheses: 'H2|H5|H6',
    keywords: ['personal', 'personalized', 'unique', 'feel seen', 'guidance', 'reading', 'symbolic', 'tarot', 'astrology', 'manifestation', 'devotional'],
    opportunity_ru: 'Пользователь платит вниманием и деньгами не за generic совет, а за точное отражение состояния, которое превращается в действие.',
    product_risk_ru: 'Слишком generic guidance разрушит доверие; слишком deterministic guidance создаст safety/trust risk.',
    interview_probe_ru: 'Какая персональная подсказка за последний месяц попала в точку, а какая показалась пустой или манипулятивной?',
    prototype_probe_ru: 'На meaning/reflection экранах спросить: это звучит лично и полезно или как универсальный текст?',
    downgrade_rule_ru: 'Ослабить H5/H2, если пользователи не чувствуют персональной точности или не готовы платить за глубину после free loop.'
  },
  {
    theme_id: 'VOC_TRUST_SAFETY',
    theme_ru: 'Доверие, безопасность и граница мягкого guidance',
    linked_hypotheses: 'H4|H5|H6',
    keywords: ['trust', 'accuracy', 'safety', 'safe', 'unsafe', 'manipulative', 'clinical', 'deterministic', 'cringe', 'overclaim', 'fatal objection'],
    opportunity_ru: 'Если Alina честно ограничивает обещания и дает контролируемое мягкое guidance, она может избежать части риска spiritual/AI/self-help продуктов.',
    product_risk_ru: 'Любое ощущение диагноза, предсказания судьбы, манипуляции или небезопасного совета должно останавливать claim upgrade.',
    interview_probe_ru: 'Что сделало бы такой продукт небезопасным, cringe, манипулятивным или не для тебя?',
    prototype_probe_ru: 'На каждом guidance шаге попросить отметить фразу, которая вызывает доверие, и фразу, которая вызывает сопротивление.',
    downgrade_rule_ru: 'Ослабить H4/H6 немедленно, если возникает повторяющийся fatal trust/safety objection.'
  },
  {
    theme_id: 'VOC_DEPTH_CUSTOMIZATION',
    theme_ru: 'Глубина, свежесть и кастомизация после первого value moment',
    linked_hypotheses: 'H2|H5|H6',
    keywords: ['depth', 'custom', 'customization', 'options', 'stale', 'repetitive', 'fresh', 'library', 'content', 'course', 'advanced'],
    opportunity_ru: 'Платная глубина должна появляться после понятной бесплатной петли: richer analysis, custom rituals, history, personalization.',
    product_risk_ru: 'Если глубина требуется до первого value moment, onboarding станет тяжелым; если глубины нет, paid case останется слабым.',
    interview_probe_ru: 'За какую глубину в похожем продукте тебе было бы не жалко платить после первой бесплатной пользы?',
    prototype_probe_ru: 'После value check спросить, какую дополнительную глубину пользователь ожидал бы в paid layer.',
    downgrade_rule_ru: 'Ослабить H2, если paid depth не называется самими пользователями или воспринимается как paywall before value.'
  },
  {
    theme_id: 'VOC_SUBSCRIPTION_VALUE',
    theme_ru: 'Цена, подписка и доказательство ценности',
    linked_hypotheses: 'H2|H6',
    keywords: ['subscription', 'price', 'paid', 'pay', 'premium', 'trial', 'value', 'worth', 'iap', 'purchase'],
    opportunity_ru: 'H2 может усиливаться только там, где paid behavior связан с похожей пользовательской работой, а не просто с наличием ценника.',
    product_risk_ru: 'Публичная цена без product-match и paywall-boundary signoff переоценивает рынок и делает финансовый claim хрупким.',
    interview_probe_ru: 'За что ты уже платишь в этой зоне и что должно случиться бесплатно, чтобы подписка стала честной?',
    prototype_probe_ru: 'После прохождения free loop спросить: какая paid depth была бы логичным продолжением, а какая выглядела бы нечестно?',
    downgrade_rule_ru: 'Ослабить H2, если пользователи ожидают всю ценность бесплатно или платные фичи не связаны с core loop.'
  },
  {
    theme_id: 'VOC_SOCIAL_PROOF_REFERRAL',
    theme_ru: 'Рекомендации, принадлежность и легкость рассказа другу',
    linked_hypotheses: 'H5|H6',
    keywords: ['friend', 'recommend', 'recommendation', 'community', 'belonging', 'accountability', 'referral', 'social', 'told me'],
    opportunity_ru: 'Если первый value moment легко пересказать, warm referrals и community-language могут стать ранним recruiting/acquisition каналом.',
    product_risk_ru: 'Если ценность звучит слишком абстрактно, пользователи не смогут объяснить продукт другому человеку без длинного pitch.',
    interview_probe_ru: 'Как бы ты одним предложением объяснил другу, зачем это открыть завтра?',
    prototype_probe_ru: 'В конце сессии попросить назвать продукт своими словами и сказать, кому бы участник его посоветовал.',
    downgrade_rule_ru: 'Ослабить H5/H6, если участники не могут назвать понятную категорию, use case или адресата рекомендации.'
  }
];

const rows = themeDefs.map((theme, index) => {
  const reviewMatches = countMatches(reviewClusters, ['cluster_id', 'cluster_type', 'cluster_label', 'product_implication', 'top_archetypes'], theme.keywords);
  const communityMatches = countMatches(communitySignals, ['signal_kind', 'interpretation', 'quote_excerpt', 'market_or_archetype'], theme.keywords);
  const redditSignalMatches = countMatches(redditSignals, ['signal_group', 'interpretation', 'thread_title', 'thread_snippet', 'evidence_use'], theme.keywords);
  const redditQueueMatches = countMatches(redditQueue, ['queue_lane', 'signal_groups', 'thread_title', 'thread_snippet', 'manual_read_task', 'interview_prompt_seed', 'whitespace_prompt_seed'], theme.keywords);
  const promptMatches = countMatches(redditPromptBank, ['queue_lane', 'top_signal_groups', 'manual_read_task', 'interview_prompt_seed', 'whitespace_prompt_seed'], theme.keywords);
  const icpMatches = countMatches(icpSegments, ['segment_id', 'segment_name', 'entry_behavior', 'core_job', 'top_jtbd_clusters', 'top_pain_clusters', 'positioning_angle', 'main_risk', 'validation_gate'], theme.keywords);
  const metricMatches = countMatches(prototypeMetrics, ['gate', 'success_threshold', 'kill_threshold', 'why_it_matters'], theme.keywords);
  const evidenceRows =
    reviewMatches.reduce((sum, row) => sum + Number(row.review_rows || 0), 0) +
    communityMatches.length +
    redditSignalMatches.length +
    redditQueueMatches.length +
    promptMatches.length +
    icpMatches.length +
    metricMatches.length;
  return {
    theme_rank: index + 1,
    theme_id: theme.theme_id,
    theme_ru: theme.theme_ru,
    linked_hypotheses: theme.linked_hypotheses,
    linked_icp_segments: topValues([...redditSignalMatches, ...redditQueueMatches, ...icpMatches], 'linked_icp_segments') || topValues(icpMatches, 'segment_id'),
    evidence_rows: evidenceRows,
    review_cluster_rows: reviewMatches.reduce((sum, row) => sum + Number(row.review_rows || 0), 0),
    community_signal_rows: communityMatches.length,
    reddit_signal_rows: redditSignalMatches.length,
    reddit_queue_rows: redditQueueMatches.length,
    prompt_bank_rows: promptMatches.length,
    icp_segment_rows: icpMatches.length,
    prototype_metric_rows: metricMatches.length,
    strongest_local_signal_ru: reviewMatches[0]
      ? `${reviewMatches[0].cluster_label}: ${reviewMatches[0].product_implication}`
      : (redditQueueMatches[0]?.manual_read_task || redditSignalMatches[0]?.interpretation || 'local signal requires manual read'),
    opportunity_ru: theme.opportunity_ru,
    product_risk_ru: theme.product_risk_ru,
    interview_probe_ru: theme.interview_probe_ru,
    prototype_probe_ru: theme.prototype_probe_ru,
    downgrade_rule_ru: theme.downgrade_rule_ru,
    source_files: 'data_processed/review_jtbd_cluster_summary.csv;data_processed/community_referral_signal_rows.csv;data_processed/reddit_mention_signal_matrix.csv;data_processed/reddit_manual_reading_queue.csv;data_processed/reddit_manual_reading_prompt_bank.csv;data_processed/icp_segment_matrix.csv;data_processed/prototype_validation_scorecard.csv',
    claim_boundary_ru: 'Это локальная voice-of-customer карта из desk/review/forum/proxy evidence. Она задает язык интервью и prototype checks, но не является representative demand proof и не апгрейдит H5/H6/H4 без заполненных capture rows.'
  };
});

const headers = [
  'theme_rank', 'theme_id', 'theme_ru', 'linked_hypotheses', 'linked_icp_segments',
  'evidence_rows', 'review_cluster_rows', 'community_signal_rows', 'reddit_signal_rows',
  'reddit_queue_rows', 'prompt_bank_rows', 'icp_segment_rows', 'prototype_metric_rows',
  'strongest_local_signal_ru', 'opportunity_ru', 'product_risk_ru', 'interview_probe_ru',
  'prototype_probe_ru', 'downgrade_rule_ru', 'source_files', 'claim_boundary_ru'
];

writeCsv(OUT, rows, headers);

const totalEvidenceRows = rows.reduce((sum, row) => sum + Number(row.evidence_rows || 0), 0);

const lines = [];
lines.push('# Русская voice-of-customer / objection map V1');
lines.push('');
lines.push(`Собрано: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Зачем нужен этот слой');
lines.push('');
lines.push('Этот слой переводит локальные review, Reddit/forum, ICP и prototype материалы в язык пользовательских работ, возражений и disconfirmation questions. Он нужен, чтобы русское повествование не было только рыночным: продуктовая ставка Alina должна проверяться на живых причинах поведения, страхах, платной глубине, доверии и понимании петли.');
lines.push('');
lines.push(`Всего тем: ${rows.length}. Суммарных локальных supporting rows/signals по темам: ${totalEvidenceRows}. Это не representative demand proof: часть сигналов пересекается между темами, а Reddit/manual-read строки требуют человеческого чтения до внешних цитат или claim upgrade.`);
lines.push('');
lines.push('## Карта тем');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'theme_rank', label: '#' },
  { key: 'theme_id', label: 'Theme ID' },
  { key: 'theme_ru', label: 'Тема' },
  { key: 'linked_hypotheses', label: 'H' },
  { key: 'evidence_rows', label: 'Signals', align: 'right' },
  { key: 'reddit_queue_rows', label: 'Read queue', align: 'right' },
  { key: 'linked_icp_segments', label: 'ICP links' }
], rows.length));
lines.push('');
for (const row of rows) {
  lines.push(`## ${row.theme_rank}. ${row.theme_ru}`);
  lines.push('');
  lines.push(`**Локальный сигнал:** ${row.strongest_local_signal_ru}`);
  lines.push('');
  lines.push(`**Возможность:** ${row.opportunity_ru}`);
  lines.push('');
  lines.push(`**Риск:** ${row.product_risk_ru}`);
  lines.push('');
  lines.push(`**Interview probe:** ${row.interview_probe_ru}`);
  lines.push('');
  lines.push(`**Prototype probe:** ${row.prototype_probe_ru}`);
  lines.push('');
  lines.push(`**Downgrade:** ${row.downgrade_rule_ru}`);
  lines.push('');
}
lines.push('## Граница доказательства');
lines.push('');
lines.push('Эта карта не должна превращаться в утверждение "рынок доказан". Ее правильная роль: дать русскому отчету последовательный язык пользовательских болей и дать оператору точные вопросы для ICP interviews, prototype sessions и paid-depth checks.');
lines.push('');
lines.push('## Файлы');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${DOC}\``);

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`russian_voc_objection_map=${rows.length}`);
console.log(`voc_evidence_rows=${totalEvidenceRows}`);
console.log(`doc=${DOC}`);
