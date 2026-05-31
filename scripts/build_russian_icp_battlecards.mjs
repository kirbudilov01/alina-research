import fs from 'fs';

const OUT = 'data_processed/russian_icp_battlecards.csv';
const DOC = 'docs/audience/russian-icp-battlecards-v1.md';

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

function countBy(rows, key) {
  const out = {};
  for (const row of rows) out[row[key] || 'unknown'] = (out[row[key] || 'unknown'] || 0) + 1;
  return out;
}

function topCounts(rows, key, limit = 5) {
  return Object.entries(countBy(rows, key))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
}

function first(rows, key) {
  return clean(rows.find(row => clean(row[key]))?.[key]);
}

function ruPriority(row, bridges) {
  const p = first(bridges, 'priority') || clean(row.evidence_band);
  if (/P0|top_two/i.test(p) || Number(row.evidence_score || 0) >= 10) return 'P0: начинать интервью и прототип с этого сегмента';
  if (/P1|compare/i.test(p) || Number(row.evidence_score || 0) >= 9) return 'P1: использовать как сравнение после P0';
  return 'P2: держать как backstop до противоречивых данных';
}

function ruSegmentRead(row) {
  const name = row.segment_name;
  if (name === 'Spiritual self-improvers') {
    return 'Это люди, которые уже ищут личный смысл, символическое отражение дня, дневниковые практики, spiritual guidance или мягкий self-improvement. Для Alina это самый естественный вход: смысл должен быстро превращаться в одно реальное действие.';
  }
  if (name === 'Habit and progress users') {
    return 'Это люди, которым не хватает не еще одного списка задач, а более мягкого способа видеть движение вперед. Для Alina это проверка, может ли action-tied прогресс заменить жесткий streak pressure.';
  }
  if (name === 'Anxious daily reset users') {
    return 'Это пользователи коротких reset, calm, sleep, breathwork и mood tools. Для Alina они важны как проверка: reset должен не просто успокоить, а вернуть человека к одному посильному следующему шагу.';
  }
  if (name === 'Cozy/casual progression users') {
    return 'Это люди, которым близки мягкие игровые циклы, коллекционирование, daily rewards и уютная progression. Для Alina это источник языка возвращения, но есть риск выглядеть как манипулятивная retention-механика.';
  }
  if (name === 'Coaching professionals and structured growth users') {
    return 'Это пользователи структурированного роста, coaching и accountability. Для Alina сегмент полезен как проверка глубины, но продукт не должен превращаться в B2B/career coaching software.';
  }
  return 'Это пользователи identity, avatars, AI companions и future-self визуализаций. Для Alina сегмент важен как проверка, мотивирует ли визуальное self-change только тогда, когда оно связано с завершенным действием.';
}

function ruBoundary(row) {
  return `Сегмент ${row.segment_name} пока нельзя считать выбранным ICP. Данные показывают directional fit, но решение требует интервью, прототипных сессий, WTP-вопросов и проверки fatal objections.`;
}

function ruNextAction(row, bridges) {
  const priority = ruPriority(row, bridges);
  if (priority.startsWith('P0')) return 'Набрать 8 интервью и 5 прототипных сессий, фиксируя recent behavior, конкретный эпизод, понимание петли, meaning lift и paid-depth сигнал.';
  if (priority.startsWith('P1')) return 'Использовать после первых P0-сессий как compare-сегмент: проверить, является ли потребность шире одного рынка или распадается на разные продукты.';
  return 'Не начинать с этого сегмента; держать как backstop, если P0/P1 дают противоречивые результаты.';
}

const segments = csv('data_processed/icp_segment_matrix.csv');
const validation = csv('data_processed/icp_validation_test_plan.csv');
const bridge = csv('data_processed/icp_recruiting_bridge.csv');
const messages = csv('data_processed/icp_recruiting_message_bank.csv');
const audience = csv('data_processed/audience_signal_matrix.csv');
const reddit = csv('data_processed/reddit_mention_signal_matrix.csv');

const rows = segments
  .slice()
  .sort((a, b) => Number(b.evidence_score || 0) - Number(a.evidence_score || 0) || a.segment_id.localeCompare(b.segment_id))
  .map(segment => {
    const bridges = bridge.filter(row => row.segment_id === segment.segment_id);
    const tests = validation.filter(row => row.segment_id === segment.segment_id);
    const segmentMessages = messages.filter(row => row.segment_id === segment.segment_id);
    const markets = clean(segment.primary_markets).split('|').filter(Boolean);
    const audienceRows = audience.filter(row => markets.includes(row.niche));
    const redditRows = reddit.filter(row => clean(row.linked_icp_segments).split('|').includes(segment.segment_id));
    const bestBridge = bridges.slice().sort((a, b) => Number(b.matched_community_signal_rows || 0) - Number(a.matched_community_signal_rows || 0))[0] || {};
    return {
      segment_id: segment.segment_id,
      segment_name: segment.segment_name,
      priority_ru: ruPriority(segment, bridges),
      evidence_band: segment.evidence_band,
      evidence_score: segment.evidence_score,
      primary_markets: segment.primary_markets,
      audience_signal_rows: audienceRows.length,
      reddit_signal_rows: redditRows.length,
      top_signal_groups: topCounts(redditRows, 'signal_group', 5),
      top_jtbd_clusters: segment.top_jtbd_clusters,
      top_pain_clusters: segment.top_pain_clusters,
      core_job_ru: segment.core_job,
      why_it_matters_ru: ruSegmentRead(segment),
      positioning_angle_ru: segment.positioning_angle,
      monetization_proxy: segment.monetization_proxy,
      recruiting_channels_ru: [...new Set(bridges.map(row => row.recruiting_channel_hypothesis).filter(Boolean))].join(' | '),
      best_recruiting_channel_ru: bestBridge.recruiting_channel_hypothesis || '',
      matched_community_signal_rows: bridges.reduce((sum, row) => sum + Number(row.matched_community_signal_rows || 0), 0),
      validation_tests: tests.length,
      message_rows: segmentMessages.length,
      screener_rule_ru: bestBridge.screener_question || first(tests, 'participant_filter'),
      prototype_prompt_ru: bestBridge.prototype_prompt || first(tests.filter(row => row.validation_type === 'prototype_loop'), 'task_or_question'),
      wtp_question_ru: bestBridge.wtp_probe || first(tests.filter(row => row.validation_type === 'willingness_to_pay'), 'task_or_question'),
      pass_condition_ru: first(tests, 'success_signal'),
      fail_condition_ru: first(tests, 'failure_signal'),
      boundary_ru: ruBoundary(segment),
      next_action_ru: ruNextAction(segment, bridges)
    };
  });

const headers = [
  'segment_id', 'segment_name', 'priority_ru', 'evidence_band', 'evidence_score',
  'primary_markets', 'audience_signal_rows', 'reddit_signal_rows', 'top_signal_groups',
  'top_jtbd_clusters', 'top_pain_clusters', 'core_job_ru', 'why_it_matters_ru',
  'positioning_angle_ru', 'monetization_proxy', 'recruiting_channels_ru',
  'best_recruiting_channel_ru', 'matched_community_signal_rows', 'validation_tests',
  'message_rows', 'screener_rule_ru', 'prototype_prompt_ru', 'wtp_question_ru',
  'pass_condition_ru', 'fail_condition_ru', 'boundary_ru', 'next_action_ru'
];

writeCsv(OUT, rows, headers);

const lines = [];
lines.push('# Русские ICP battlecards V1');
lines.push('');
lines.push(`Собрано: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Зачем нужен этот файл');
lines.push('');
lines.push('Этот слой переводит audience/ICP data в русские карточки сегментов. Он нужен, чтобы отчет говорил не абстрактно "есть аудитория", а последовательно показывал: кто этот человек, какую работу он уже пытается выполнить, почему он важен для Alina, где его искать, как его отсеивать и по какому тесту сегмент можно усилить или отбросить.');
lines.push('');
lines.push('Важно: карточки не являются доказательством выбранного ICP. Это evidence-backed план полевой проверки. Сегмент можно поднять в статус выбранного только после интервью, прототипной сессии и WTP/objection capture.');
lines.push('');
lines.push('## Сводка');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'segment_id', label: 'ICP' },
  { key: 'segment_name', label: 'Сегмент' },
  { key: 'priority_ru', label: 'Приоритет' },
  { key: 'evidence_score', label: 'Score', align: 'right' },
  { key: 'audience_signal_rows', label: 'Audience rows', align: 'right' },
  { key: 'reddit_signal_rows', label: 'Reddit rows', align: 'right' },
  { key: 'validation_tests', label: 'Tests', align: 'right' }
], rows.length));
lines.push('');
for (const row of rows) {
  lines.push(`## ${row.segment_id}. ${row.segment_name}`);
  lines.push('');
  lines.push(`**Приоритет:** ${row.priority_ru}. **Рынки:** ${row.primary_markets}. **Evidence:** ${row.evidence_band}, score ${row.evidence_score}.`);
  lines.push('');
  lines.push(`**Кто это и почему важно:** ${row.why_it_matters_ru}`);
  lines.push('');
  lines.push(`**Core job:** ${row.core_job_ru}`);
  lines.push('');
  lines.push(`**Сигналы:** ${row.audience_signal_rows} audience rows, ${row.reddit_signal_rows} Reddit/forum rows, top groups: ${row.top_signal_groups || 'n/a'}. JTBD: ${row.top_jtbd_clusters || 'n/a'}. Pains: ${row.top_pain_clusters || 'n/a'}.`);
  lines.push('');
  lines.push(`**Позиционирование:** ${row.positioning_angle_ru}`);
  lines.push('');
  lines.push(`**Где искать:** ${row.recruiting_channels_ru || 'n/a'}. Лучший стартовый канал: ${row.best_recruiting_channel_ru || 'n/a'}.`);
  lines.push('');
  lines.push(`**Как валидировать:** screener - ${row.screener_rule_ru || 'n/a'} Prototype - ${row.prototype_prompt_ru || 'n/a'} WTP - ${row.wtp_question_ru || 'n/a'}`);
  lines.push('');
  lines.push(`**Усиление/провал:** pass - ${row.pass_condition_ru || 'n/a'} fail - ${row.fail_condition_ru || 'n/a'}`);
  lines.push('');
  lines.push(`**Граница:** ${row.boundary_ru}`);
  lines.push('');
  lines.push(`**Следующее действие:** ${row.next_action_ru}`);
  lines.push('');
}
lines.push('## Файлы');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${DOC}\``);
lines.push('- `data_processed/icp_segment_matrix.csv`');
lines.push('- `data_processed/icp_validation_test_plan.csv`');
lines.push('- `data_processed/icp_recruiting_bridge.csv`');
lines.push('- `data_processed/icp_recruiting_message_bank.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`russian_icp_battlecards_rows=${rows.length}`);
console.log(`doc=${DOC}`);
