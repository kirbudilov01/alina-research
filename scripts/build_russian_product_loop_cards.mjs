import fs from 'fs';

const OUT = 'data_processed/russian_product_loop_cards.csv';
const DOC = 'docs/product/russian-product-loop-cards-v1.md';

for (const dir of ['data_processed', 'docs/product']) fs.mkdirSync(dir, { recursive: true });

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

function screenRole(screenId) {
  const roles = {
    S01_ENTRY: 'Вход в личный смысл: пользователь должен почувствовать, что это не generic motivation и не жесткое предсказание.',
    S02_REFLECTION: 'Минимальный контекст: петля получает живую точку дня, но не превращается в длинный onboarding.',
    S03_ACTION_CARD: 'Перевод смысла в действие: центральная проверка, что Alina не остается чтением или дневником.',
    S04_RESET: 'Снижение трения: reset должен помогать начать действие, а не выглядеть как отдельная медитация ради медитации.',
    S05_COMPLETION: 'Легкое доказательство действия: self-report должен быть достаточным и не ощущаться как контроль.',
    S06_AVATAR_CHANGE: 'Причинная видимость прогресса: ключевой момент H4/H6, где действие должно объяснять изменение identity/avatar.',
    S07_TOMORROW_HOOK: 'Возврат без наказания: continuity должен поддерживать привычку без streak anxiety.',
    S08_VALUE_CHECK: 'Проверка понимания: пользователь должен назвать интегрированную петлю своими словами.'
  };
  return roles[screenId] || 'Экран проверяет один шаг продуктовой петли и должен быть оценен в прототипной сессии.';
}

function gateLink(screenId) {
  if (screenId === 'S06_AVATAR_CHANGE') return 'H4/H6: конкурентное преимущество и продуктовая причинность';
  if (screenId === 'S08_VALUE_CHECK') return 'H4/H5/H6: понимание, ICP resonance и итоговая ценность';
  if (screenId === 'S05_COMPLETION') return 'H6/H2: доказательство действия и paid-depth boundary';
  if (screenId === 'S07_TOMORROW_HOOK') return 'H6: return intent без punitive streak';
  return 'H6: coherence of MVP loop';
}

function decisionUse(screenId) {
  if (screenId === 'S06_AVATAR_CHANGE') return 'Если пользователь не может объяснить, что изменение вызвано действием, петля теряет главное отличие от avatar toy или habit tracker.';
  if (screenId === 'S08_VALUE_CHECK') return 'Если пользователь не может назвать интегрированную пользу, нельзя усиливать H4 даже при приятной реакции на отдельные экраны.';
  if (screenId === 'S03_ACTION_CARD') return 'Если действие читается как случайная задача, Alina должна менять механику action selection до следующего теста.';
  if (screenId === 'S07_TOMORROW_HOOK') return 'Если hook ощущается как манипуляция, retention-логику нужно смягчить до повторного теста.';
  return 'Экран можно оставлять в MVP только если он помогает пройти двухминутную петлю быстрее и понятнее.';
}

const flow = csv('data_processed/prototype_validation_stimulus_flow.csv');
const scorecard = csv('data_processed/prototype_validation_scorecard.csv');
const gates = csv('data_processed/validation_gate_calculator.csv');
const hypotheses = csv('data_processed/hypothesis_decision_matrix.csv');

const uniqueScreens = Array.from(new Map(flow.map(row => [row.screen_id, row])).values())
  .sort((a, b) => Number(a.step || 0) - Number(b.step || 0));

const h4 = hypotheses.find(row => row.hypothesis_id === 'H4') || {};
const h6 = hypotheses.find(row => row.hypothesis_id === 'H6') || {};
const h2 = hypotheses.find(row => row.hypothesis_id === 'H2') || {};
const prototypeGates = gates.filter(row => row.workstream === 'prototype_user_validation');

const rows = uniqueScreens.map(row => ({
  step: row.step,
  screen_id: row.screen_id,
  screen_name: row.screen_name,
  role_ru: screenRole(row.screen_id),
  user_goal_ru: row.user_goal,
  prototype_copy: row.prototype_copy,
  user_action_ru: row.user_action,
  expected_signal_ru: row.expected_signal,
  failure_signal_ru: row.failure_signal,
  linked_gate_ru: gateLink(row.screen_id),
  max_seconds: row.max_seconds,
  test_question_ru: row.test_question,
  evidence_to_capture: row.evidence_to_capture,
  decision_use_ru: decisionUse(row.screen_id),
  claim_boundary_ru: 'Это stimulus card, не результат пользовательской валидации. Claim можно усиливать только после заполненных prototype_session_capture_sheet и scorecard.'
}));

const headers = [
  'step', 'screen_id', 'screen_name', 'role_ru', 'user_goal_ru', 'prototype_copy',
  'user_action_ru', 'expected_signal_ru', 'failure_signal_ru', 'linked_gate_ru',
  'max_seconds', 'test_question_ru', 'evidence_to_capture', 'decision_use_ru',
  'claim_boundary_ru'
];

writeCsv(OUT, rows, headers);

const lines = [];
lines.push('# Русские карточки продуктовой петли V1');
lines.push('');
lines.push(`Собрано: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Зачем нужен этот файл');
lines.push('');
lines.push('Этот слой переводит prototype stimulus в русское последовательное повествование. Его задача - показать, не просто какие экраны есть в прототипе, а зачем каждый экран существует в доказательной логике Alina: какой риск он закрывает, какой сигнал должен дать пользователь, где петля может сломаться и какой validation gate нельзя усиливать без наблюдаемого evidence.');
lines.push('');
lines.push('Главная граница: это не пользовательская валидация. Пока нет заполненных prototype_session_capture_sheet, H4 и H6 остаются hold_validate.');
lines.push('');
lines.push('## Сводка петли');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'step', label: 'Шаг', align: 'right' },
  { key: 'screen_name', label: 'Экран' },
  { key: 'role_ru', label: 'Роль в петле' },
  { key: 'linked_gate_ru', label: 'Gate' },
  { key: 'max_seconds', label: 'Sec', align: 'right' }
], rows.length));
lines.push('');
for (const row of rows) {
  lines.push(`## ${row.step}. ${row.screen_name}`);
  lines.push('');
  lines.push(`**Роль:** ${row.role_ru}`);
  lines.push('');
  lines.push(`**Что видит пользователь:** ${row.prototype_copy}`);
  lines.push('');
  lines.push(`**Действие:** ${row.user_action_ru}`);
  lines.push('');
  lines.push(`**Сигнал успеха:** ${row.expected_signal_ru}`);
  lines.push('');
  lines.push(`**Сигнал провала:** ${row.failure_signal_ru}`);
  lines.push('');
  lines.push(`**Как это влияет на решение:** ${row.decision_use_ru}`);
  lines.push('');
}
lines.push('## Scorecard');
lines.push('');
lines.push(mdTable(scorecard, [
  { key: 'metric_id', label: 'Metric' },
  { key: 'gate', label: 'Gate' },
  { key: 'success_threshold', label: 'Success' },
  { key: 'kill_threshold', label: 'Kill/Downgrade' }
], scorecard.length));
lines.push('');
lines.push('## Связь с H4/H6');
lines.push('');
lines.push(`H4 сейчас: ${h4.current_decision || 'n/a'}; evidence status: ${h4.evidence_status || 'n/a'}; gap: ${h4.key_gap || 'n/a'}`);
lines.push('');
lines.push(`H6 сейчас: ${h6.current_decision || 'n/a'}; evidence status: ${h6.evidence_status || 'n/a'}; gap: ${h6.key_gap || 'n/a'}`);
lines.push('');
lines.push(`H2 paid-depth boundary также остается открытым: ${h2.key_gap || 'n/a'}`);
lines.push('');
if (prototypeGates.length) {
  lines.push('Prototype gates:');
  lines.push('');
  lines.push(mdTable(prototypeGates, [
    { key: 'gate_id', label: 'Gate' },
    { key: 'gate_status', label: 'Status' },
    { key: 'required_capture_rows', label: 'Required', align: 'right' },
    { key: 'completed_rows', label: 'Completed', align: 'right' },
    { key: 'success_gate', label: 'Success Gate' },
    { key: 'kill_or_downgrade_gate', label: 'Kill/Downgrade' }
  ], prototypeGates.length));
  lines.push('');
}
lines.push('## Файлы');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${DOC}\``);
lines.push('- `data_processed/prototype_validation_stimulus_flow.csv`');
lines.push('- `data_processed/prototype_validation_scorecard.csv`');
lines.push('- `data_processed/validation_gate_calculator.csv`');
lines.push('- `data_processed/hypothesis_decision_matrix.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`russian_product_loop_cards_rows=${rows.length}`);
console.log(`doc=${DOC}`);
