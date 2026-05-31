import fs from 'fs';

const OUT = 'data_processed/russian_observed_evidence_ladder.csv';
const DOC = 'docs/decision/russian-observed-evidence-ladder-v1.md';

for (const dir of ['data_processed', 'docs/decision']) fs.mkdirSync(dir, { recursive: true });

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

const hypothesisRu = {
  H1: 'форма продукта существует',
  H2: 'в соседних рынках есть деньги',
  H3: 'есть узкое белое пятно',
  H4: 'конкурентное преимущество правдоподобно',
  H5: 'общая аудитория существует',
  H6: 'продуктовое ядро можно определить'
};

const evidenceModeRu = {
  manual_competitor_walkthrough: 'ручной walkthrough конкурентов',
  paid_flow_validation: 'ручная проверка paywall/paid-flow',
  prototype_user_validation: 'прототипные сессии',
  icp_interviews: 'интервью ICP'
};

const reportSentence = {
  H1: 'Мы видим рядом продукты с похожими примитивами, но форму Alina нельзя считать доказанной, пока первые P0 walkthrough не покажут, что полный цикл не занят скрытым прямым клоном.',
  H2: 'Деньги в соседних категориях подтверждаются proxy-слоями, но инвестиционный claim по рынку должен оставаться range-based до ручной проверки платных поверхностей и willingness-to-pay.',
  H3: 'Белое пятно формулируется узко: не просто wellness, coaching или avatar, а причинная петля meaning -> action -> reset -> visible identity/progress; до walkthrough это directional, не финальный вывод.',
  H4: 'Преимущество Alina пока является проверяемой ставкой на интегрированную петлю, а не доказанным moat: оно должно пройти prototype comprehension, differentiation и trust gates.',
  H5: 'Аудитория видна через повторяющийся язык ritual/progress/support, но ICP нельзя выбирать окончательно без recent-behavior интервью и проверки готовности возвращаться.',
  H6: 'Продуктовое ядро уже собрано в MVP framing, но оно станет настоящим core только если пользователи поймут причинность петли и смогут объяснить, зачем вернуться завтра.'
};

const hypothesisRows = csv('data_processed/hypothesis_decision_matrix.csv');
const gates = csv('data_processed/validation_gate_calculator.csv');
const commands = csv('data_processed/p0_validation_command_center.csv');
const gateCards = csv('data_processed/russian_validation_gate_cards.csv');

function commandSample(hypothesisId, workstream, limit = 4) {
  return commands
    .filter(row => clean(row.linked_hypotheses).split('|').includes(hypothesisId))
    .filter(row => !workstream || row.lane === workstream || row.lane.includes(workstream))
    .sort((a, b) => Number(a.sequence || 0) - Number(b.sequence || 0))
    .slice(0, limit)
    .map(row => `${row.command_id}: ${row.target}`)
    .join(' | ');
}

function captureArtifacts(workstream) {
  if (workstream === 'manual_competitor_walkthrough') return 'manual_walkthrough_capture_sheet.csv + screenshot paths + inspector_notes';
  if (workstream === 'paid_flow_validation') return 'paid_flow_capture_sheet.csv + public pricing screenshot + product-match verdict';
  if (workstream === 'icp_interviews') return 'icp_interview_capture_sheet.csv + recent behavior + verbatim quote + segment status';
  if (workstream === 'prototype_user_validation') return 'prototype_session_capture_sheet.csv + prototype_validation_scorecard.csv + observed metrics';
  return 'capture sheet + source files + decision update';
}

const rows = hypothesisRows.map(row => {
  const gate = gates.find(g => clean(g.linked_hypotheses).split('|').includes(row.hypothesis_id)) || {};
  const card = gateCards.find(g => g.hypothesis_id === row.hypothesis_id) || {};
  const workstream = row.primary_workstream || gate.workstream || '';
  const required = Number(gate.required_capture_rows || row.capture_rows || 0);
  const completed = Number(gate.completed_rows || row.capture_started || 0);
  const minSuccess = Number(gate.min_success_threshold || 0);
  const observedGap = completed > 0
    ? `Есть ${completed} completed rows, но нужно сверить success/fail и обновить decision.`
    : 'Наблюдаемых rows пока нет: desk evidence не переводит гипотезу из hold_validate в go.';
  return {
    hypothesis_id: row.hypothesis_id,
    hypothesis_ru: hypothesisRu[row.hypothesis_id] || row.hypothesis,
    current_decision: row.current_decision,
    confidence: row.confidence,
    evidence_mode_ru: evidenceModeRu[workstream] || workstream,
    desk_support_ru: card.strongest_support_ru || row.strongest_support,
    observed_gap_ru: `${observedGap} Главная дырка: ${card.why_not_upgrade_ru || row.key_gap}`,
    required_capture_rows: required,
    completed_rows: completed,
    min_success_threshold: minSuccess,
    first_operator_actions_ru: commandSample(row.hypothesis_id, workstream) || row.next_action,
    exact_artifact_to_fill_ru: captureArtifacts(workstream),
    upgrade_rule_ru: card.go_rule_ru || gate.success_gate || row.go_gate,
    downgrade_rule_ru: card.kill_or_downgrade_rule_ru || gate.kill_or_downgrade_gate || row.kill_gate,
    report_sentence_ru: reportSentence[row.hypothesis_id] || row.hypothesis,
    source_files: row.evidence_files
  };
});

const headers = [
  'hypothesis_id', 'hypothesis_ru', 'current_decision', 'confidence', 'evidence_mode_ru',
  'desk_support_ru', 'observed_gap_ru', 'required_capture_rows', 'completed_rows',
  'min_success_threshold', 'first_operator_actions_ru', 'exact_artifact_to_fill_ru',
  'upgrade_rule_ru', 'downgrade_rule_ru', 'report_sentence_ru', 'source_files'
];

writeCsv(OUT, rows, headers);

const totalRequired = rows.reduce((sum, row) => sum + Number(row.required_capture_rows || 0), 0);
const totalCompleted = rows.reduce((sum, row) => sum + Number(row.completed_rows || 0), 0);

const lines = [];
lines.push('# Русская observed-evidence ladder V1');
lines.push('');
lines.push(`Собрано: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Зачем нужен этот слой');
lines.push('');
lines.push('Этот файл переводит H1-H6 из набора гипотез в последовательную доказательную лестницу. Он отделяет desk evidence от observed evidence: локальные матрицы могут поддерживать направление, но claim усиливается только после заполненных capture rows, скриншотов, интервью или прототипных метрик.');
lines.push('');
lines.push(`Сейчас по шести гипотезам нужно ${totalRequired} capture rows, завершено ${totalCompleted}. Поэтому все сильные формулировки должны оставаться в режиме hold_validate, пока не появится наблюдаемое evidence.`);
lines.push('');
lines.push('## Ladder');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'hypothesis_id', label: 'H' },
  { key: 'hypothesis_ru', label: 'Гипотеза' },
  { key: 'evidence_mode_ru', label: 'Observed mode' },
  { key: 'required_capture_rows', label: 'Need', align: 'right' },
  { key: 'completed_rows', label: 'Done', align: 'right' },
  { key: 'observed_gap_ru', label: 'Почему еще не go' }
], rows.length));
lines.push('');
for (const row of rows) {
  lines.push(`## ${row.hypothesis_id}. ${row.hypothesis_ru}`);
  lines.push('');
  lines.push(`**Текущий статус:** ${row.current_decision}, confidence=${row.confidence}.`);
  lines.push('');
  lines.push(`**Desk support:** ${row.desk_support_ru}`);
  lines.push('');
  lines.push(`**Observed gap:** ${row.observed_gap_ru}`);
  lines.push('');
  lines.push(`**Сначала сделать:** ${row.first_operator_actions_ru}`);
  lines.push('');
  lines.push(`**Заполнить:** ${row.exact_artifact_to_fill_ru}`);
  lines.push('');
  lines.push(`**Upgrade rule:** ${row.upgrade_rule_ru}`);
  lines.push('');
  lines.push(`**Downgrade rule:** ${row.downgrade_rule_ru}`);
  lines.push('');
  lines.push(`**Фраза для отчета:** ${row.report_sentence_ru}`);
  lines.push('');
}
lines.push('## Файлы');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${DOC}\``);
lines.push('- `data_processed/hypothesis_decision_matrix.csv`');
lines.push('- `data_processed/validation_gate_calculator.csv`');
lines.push('- `data_processed/p0_validation_command_center.csv`');
lines.push('- `data_processed/russian_validation_gate_cards.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`russian_observed_evidence_ladder_rows=${rows.length}`);
console.log(`required_capture_rows=${totalRequired}`);
console.log(`completed_capture_rows=${totalCompleted}`);
console.log(`doc=${DOC}`);
