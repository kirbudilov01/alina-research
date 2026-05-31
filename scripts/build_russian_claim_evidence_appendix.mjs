import fs from 'fs';

const OUT = 'data_processed/russian_claim_evidence_appendix.csv';
const DOC = 'docs/decision/russian-claim-evidence-appendix-v1.md';

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

function ruStatus(status) {
  if (/proved/.test(status)) return 'доказано как исследовательский слой';
  if (/supported|directional|narrow/.test(status)) return 'поддержано направленно, но не финально доказано';
  if (/ready|open|hold|not_started/.test(status)) return 'готово к проверке, gate открыт';
  if (/missing/.test(status)) return 'нет достаточного evidence';
  return 'требует ручной интерпретации';
}

function ruBoundary(row) {
  const id = row.claim_id || row.requirement_id || '';
  const gap = clean(row.key_gap || row.remaining_gap);
  if (/H1|H3|whitespace|product_shape/i.test(id)) {
    return 'Нельзя усиливать claim без app/onboarding walkthrough и скриншотов причинной петли.';
  }
  if (/H2|money|paywall|market/i.test(id)) {
    return 'Нельзя читать proxy как выручку Alina; нужны paid-flow signoff и WTP evidence.';
  }
  if (/H4|H6|prototype|product_core/i.test(id)) {
    return 'Нельзя считать продуктовое преимущество доказанным без prototype sessions и observed scorecard.';
  }
  if (/H5|audience|ICP/i.test(id)) {
    return 'Нельзя превращать directional language signals в финальную персону без интервью.';
  }
  if (/validation|gate|batch|workspace/i.test(id)) {
    return 'Это операционная готовность, не observed validation evidence.';
  }
  if (/manifest|traceability|version/i.test(id)) {
    return 'Это provenance proof, а не содержательное доказательство спроса.';
  }
  return gap || 'Claim остается ограниченным качеством текущих источников и открытыми validation gates.';
}

const claimRegister = csv('data_processed/evidence_claim_register.csv');
const completion = csv('data_processed/research_completion_audit.csv');
const manifest = csv('data_processed/evidence_artifact_manifest.csv');

const completionById = new Map(completion.map(row => [row.requirement_id, row]));

const rows = claimRegister.map((row, idx) => {
  const linkedCompletion = completionById.get(row.claim_id) || {};
  const sourceFiles = clean(row.evidence_files || linkedCompletion.evidence_files);
  const fileCount = sourceFiles ? sourceFiles.split(';').filter(Boolean).length : 0;
  return {
    appendix_rank: idx + 1,
    claim_id: row.claim_id,
    claim_type: row.claim_type,
    claim_ru: row.claim,
    status: row.evidence_status,
    status_ru: ruStatus(row.evidence_status),
    confidence: row.confidence,
    primary_metric: row.primary_metric,
    quantitative_evidence: row.quantitative_evidence,
    strongest_support_ru: row.strongest_support,
    boundary_ru: ruBoundary(row),
    key_gap_ru: row.key_gap,
    next_action_ru: row.next_action,
    source_file_count: fileCount,
    evidence_files: sourceFiles
  };
});

const headers = [
  'appendix_rank', 'claim_id', 'claim_type', 'claim_ru', 'status', 'status_ru',
  'confidence', 'primary_metric', 'quantitative_evidence', 'strongest_support_ru',
  'boundary_ru', 'key_gap_ru', 'next_action_ru', 'source_file_count', 'evidence_files'
];
writeCsv(OUT, rows, headers);

const statusCounts = rows.reduce((acc, row) => {
  acc[row.status_ru] = (acc[row.status_ru] || 0) + 1;
  return acc;
}, {});

const lines = [];
lines.push('# Русское приложение Claim -> Evidence -> Boundary V1');
lines.push('');
lines.push(`Собрано: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Зачем нужен этот файл');
lines.push('');
lines.push('Этот appendix переводит evidence claim register в русскую проверочную карту. Его задача - не усилить claims, а сделать каждый сильный тезис проверяемым: что утверждается, какой статус evidence, какая метрика, где файлы-источники, какая граница и какое следующее действие.');
lines.push('');
lines.push('## Сводка');
lines.push('');
lines.push(`- Claim rows: ${rows.length}`);
lines.push(`- Manifest artifacts at build time: ${manifest.length}`);
for (const [status, count] of Object.entries(statusCounts)) lines.push(`- ${status}: ${count}`);
lines.push('');
lines.push('## Главная таблица');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'claim_id', label: 'Claim' },
  { key: 'status_ru', label: 'Статус' },
  { key: 'confidence', label: 'Confidence' },
  { key: 'primary_metric', label: 'Метрика' },
  { key: 'boundary_ru', label: 'Граница' },
  { key: 'source_file_count', label: 'Файлы', align: 'right' }
], rows.length));
lines.push('');
lines.push('## Файлы');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${DOC}\``);
lines.push('- `data_processed/evidence_claim_register.csv`');
lines.push('- `data_processed/evidence_artifact_manifest.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`russian_claim_evidence_rows=${rows.length}`);
console.log(`doc=${DOC}`);
