import fs from 'fs';

const GATES = 'data_processed/validation_gate_calculator.csv';
const OUT = 'data_processed/global_validation_executive_rollup.csv';
const DOC = 'docs/decision/global-validation-executive-rollup-v1.md';

for (const dir of ['data_processed', 'docs/decision']) fs.mkdirSync(dir, { recursive: true });

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
  return body
    .filter(r => r.some(Boolean))
    .map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])));
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
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function n(value) {
  const parsed = Number(String(value ?? '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function rowsCount(file) {
  return csv(file).length;
}

function statusRu(status) {
  return ({
    in_progress_insufficient_evidence: 'начато, но ниже порога',
    pass_ready_for_review: 'порог достигнут, нужен review',
    not_started: 'не начато',
    kill_or_downgrade_triggered: 'нужен downgrade/kill review'
  })[status] || status;
}

function gateMeta(gateId) {
  return ({
    GATE_H1_MANUAL_PRODUCT_SHAPE: {
      evidence_type_ru: 'listing-only evidence',
      current_evidence_ru: `${rowsCount('data_processed/manual_public_listing_signoff.csv')} public-listing signoff rows; app onboarding/action/progress/paywall walkthrough не выполнен`,
      next_real_validation_ru: 'пройти первые 5 P0-приложений от listing до onboarding, first action, avatar/progress feedback и paywall boundary',
      next_files: 'data_processed/manual_walkthrough_capture_sheet.csv;data_processed/manual_public_listing_signoff.csv;docs/decision/manual-public-listing-signoff-v1.md'
    },
    GATE_H3_MANUAL_WHITESPACE: {
      evidence_type_ru: 'listing-only whitespace risk evidence',
      current_evidence_ru: `${rowsCount('data_processed/manual_public_listing_signoff.csv')} public-listing signoff rows; hidden-clone риск не снят`,
      next_real_validation_ru: 'для тех же 5 P0-приложений классифицировать full_loop / adjacent_loop / weak_adjacency и action->avatar causality',
      next_files: 'data_processed/manual_walkthrough_capture_sheet.csv;data_processed/russian_p0_walkthrough_dossiers.csv;docs/decision/manual-public-listing-signoff-v1.md'
    },
    GATE_H2_PAID_FLOW: {
      evidence_type_ru: 'paid-flow signoff evidence',
      current_evidence_ru: `${rowsCount('data_processed/paid_flow_local_signoff.csv')} paid-flow signoff rows; часть строк no-clean-price context-only`,
      next_real_validation_ru: 'добрать product-matched paid-flow rows с чистой ценой, trial/plan depth и first-value/paywall boundary',
      next_files: 'data_processed/paid_flow_capture_sheet.csv;data_processed/paid_flow_local_signoff.csv;docs/market/paid-flow-local-signoff-v1.md'
    },
    GATE_H5_ICP_RECENT_BEHAVIOR: {
      evidence_type_ru: 'secondary VOC evidence',
      current_evidence_ru: `${rowsCount('data_processed/icp_secondary_voc_signoff.csv')} secondary VOC rows; живых интервью и recent-behavior ответов нет`,
      next_real_validation_ru: 'провести первые P0-интервью ICP_A/ICP_D и заменить secondary VOC rows реальными participant answers',
      next_files: 'data_processed/icp_interview_capture_sheet.csv;data_processed/icp_secondary_voc_signoff.csv;docs/audience/icp-secondary-voc-signoff-v1.md'
    },
    GATE_H4_PROTOTYPE_ADVANTAGE: {
      evidence_type_ru: 'prototype-readiness evidence',
      current_evidence_ru: `${rowsCount('data_processed/prototype_readiness_signoff.csv')} readiness rows; user-session behavior не наблюдался`,
      next_real_validation_ru: 'запустить prototype sessions и измерить comprehension, differentiation, meaning lift, trust/safety и return intent',
      next_files: 'data_processed/prototype_session_capture_sheet.csv;data_processed/prototype_readiness_signoff.csv;docs/product/prototype-readiness-signoff-v1.md'
    },
    GATE_H6_PRODUCT_CORE: {
      evidence_type_ru: 'prototype-readiness evidence',
      current_evidence_ru: `${rowsCount('data_processed/prototype_readiness_signoff.csv')} readiness rows; MVP loop coherence еще не проверен участниками`,
      next_real_validation_ru: 'после prototype sessions обновить MVP loop и проверить, могут ли участники назвать продукт и причинность своими словами',
      next_files: 'data_processed/prototype_session_capture_sheet.csv;data_processed/prototype_readiness_signoff.csv;docs/product/prototype-readiness-signoff-v1.md'
    }
  })[gateId] || {
    evidence_type_ru: 'unknown',
    current_evidence_ru: '',
    next_real_validation_ru: '',
    next_files: ''
  };
}

const gates = csv(GATES);
const rows = gates.map(gate => {
  const meta = gateMeta(gate.gate_id);
  const completed = n(gate.completed_rows);
  const required = n(gate.required_capture_rows);
  const success = n(gate.success_rows);
  const minSuccess = n(gate.min_success_threshold);
  const minCompleted = n(gate.min_completed_threshold);
  return {
    gate_id: gate.gate_id,
    linked_hypotheses: gate.linked_hypotheses,
    status_ru: statusRu(gate.gate_status),
    decision_effect: gate.current_decision_effect,
    evidence_type_ru: meta.evidence_type_ru,
    completed_vs_required: `${completed} / ${required}`,
    success_vs_threshold: `${success} / ${minSuccess}`,
    min_completed_gap: Math.max(0, minCompleted - completed),
    min_success_gap: Math.max(0, minSuccess - success),
    current_evidence_ru: meta.current_evidence_ru,
    claim_boundary_ru: gate.gate_status === 'pass_ready_for_review'
      ? 'численный порог достигнут, но claim upgrade все равно требует review'
      : 'не апгрейдить гипотезу: evidence частичное, context/readiness/signoff не равны validated demand/product proof',
    next_real_validation_ru: meta.next_real_validation_ru,
    next_files: meta.next_files,
    source_files: gate.source_files
  };
});

writeCsv(OUT, rows, [
  'gate_id',
  'linked_hypotheses',
  'status_ru',
  'decision_effect',
  'evidence_type_ru',
  'completed_vs_required',
  'success_vs_threshold',
  'min_completed_gap',
  'min_success_gap',
  'current_evidence_ru',
  'claim_boundary_ru',
  'next_real_validation_ru',
  'next_files',
  'source_files'
]);

const lines = [];
lines.push('# Global Validation Executive Rollup V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Зачем нужен этот слой');
lines.push('');
lines.push('Этот rollup сводит H1-H6 в одну управленческую таблицу: что уже заполнено, какой это тип evidence, почему это еще не validation proof и какой следующий реальный шаг нужен. Он нужен, чтобы отчет не становился длиннее без роста доказательной силы.');
lines.push('');
lines.push('## Gate Rollup');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'linked_hypotheses', label: 'H' },
  { key: 'status_ru', label: 'Статус' },
  { key: 'evidence_type_ru', label: 'Тип evidence' },
  { key: 'completed_vs_required', label: 'Rows' },
  { key: 'success_vs_threshold', label: 'Success' },
  { key: 'min_success_gap', label: 'Success gap', align: 'right' },
  { key: 'claim_boundary_ru', label: 'Граница claim' },
  { key: 'next_real_validation_ru', label: 'Следующий реальный шаг' }
]));
lines.push('');
lines.push('## Главный вывод');
lines.push('');
lines.push('Все 6 gates уже стартовали, но все 6 остаются hold/validate. H1/H3 основаны на listing-only evidence, H2 на paid-flow signoff с context-only строками, H5 на secondary VOC, H4/H6 на prototype readiness. Это хорошая исследовательская инфраструктура, но еще не product validation.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${GATES}\``);
lines.push('- `data_processed/manual_public_listing_signoff.csv`');
lines.push('- `data_processed/paid_flow_local_signoff.csv`');
lines.push('- `data_processed/icp_secondary_voc_signoff.csv`');
lines.push('- `data_processed/prototype_readiness_signoff.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`global_validation_executive_rollup=${OUT}`);
console.log(`doc=${DOC}`);
console.log(`rows=${rows.length}`);
