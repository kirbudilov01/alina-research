import fs from 'fs';

const ICP_CAPTURE = 'data_processed/icp_interview_capture_sheet.csv';
const ICP_SEGMENTS = 'data_processed/icp_segment_matrix.csv';
const VOC_MAP = 'data_processed/russian_voc_objection_map.csv';
const REVIEW_SUMMARY = 'data_processed/review_jtbd_cluster_summary.csv';
const OUT = 'data_processed/icp_secondary_voc_signoff.csv';
const DOC = 'docs/audience/icp-secondary-voc-signoff-v1.md';

for (const dir of ['data_processed', 'docs/audience']) fs.mkdirSync(dir, { recursive: true });

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
  if (!headers) return { headers: [], rows: [] };
  return {
    headers,
    rows: body
      .filter(r => r.some(Boolean))
      .map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])))
  };
}

function readCsv(file) {
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : { headers: [], rows: [] };
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

function vocThemesForSegment(vocRows, segmentId) {
  return vocRows
    .filter(row => clean(row.linked_icp_segments).includes(`${segmentId}:`))
    .sort((a, b) => Number(b.evidence_rows || 0) - Number(a.evidence_rows || 0))
    .slice(0, 3);
}

function summaryForTest({ row, segment, themes, reviewRows }) {
  const topThemes = themes.map(theme => `${theme.theme_id}:${theme.evidence_rows} rows`).join('; ');
  const topClusters = clean(segment.top_jtbd_clusters)
    .split('|')
    .filter(Boolean)
    .slice(0, 3)
    .join('; ');
  const pains = clean(segment.top_pain_clusters)
    .split('|')
    .filter(Boolean)
    .slice(0, 3)
    .join('; ');
  const globalTop = reviewRows.slice(0, 3).map(cluster => `${cluster.cluster_id}:${cluster.review_rows}`).join('; ');
  return [
    'Secondary VOC proxy only, no participant interviewed.',
    `Segment evidence band: ${segment.evidence_band}; audience rows: ${segment.audience_signal_rows}; review cluster rows: ${segment.review_cluster_rows}; forum quote rows: ${segment.forum_quote_rows}.`,
    `Entry behavior: ${segment.entry_behavior}. Core job: ${segment.core_job}.`,
    `Top JTBD: ${topClusters}. Top pains: ${pains}.`,
    `Relevant VOC themes: ${topThemes}. Global review anchors: ${globalTop}.`,
    `This row prepares the ${row.test_type} interview/prototype prompt but cannot validate recent behavior, WTP, comprehension, or fatal objections.`
  ].join(' ');
}

const capture = readCsv(ICP_CAPTURE);
const segments = readCsv(ICP_SEGMENTS).rows;
const voc = readCsv(VOC_MAP).rows;
const review = readCsv(REVIEW_SUMMARY).rows;
const segmentByName = new Map(segments.map(row => [row.segment_name, row]));
const signoffs = [];

for (const row of capture.rows) {
  if (row.participant_slot !== 'P01') continue;
  if (!['Spiritual self-improvers', 'Habit and progress users'].includes(row.segment_name)) continue;
  const segment = segmentByName.get(row.segment_name) || {};
  const segmentId = segment.segment_id || (row.segment_name === 'Spiritual self-improvers' ? 'ICP_A' : 'ICP_D');
  const themes = vocThemesForSegment(voc, segmentId);
  row.capture_status = 'secondary_voc_signoff_completed_not_interview';
  row.observed_answer_or_score = summaryForTest({ row, segment, themes, reviewRows: review });
  row.success_flag = '';
  row.fatal_objection_flag = '';
  row.exact_quote = '';
  row.researcher_notes = 'Desk/VOC evidence from reviews, audience matrix, and VOC objection map. Must be replaced by real participant answer before H5/H6 upgrade.';
  signoffs.push({
    capture_id: row.capture_id,
    segment_name: row.segment_name,
    test_type: row.test_type,
    metric: row.metric,
    evidence_band: segment.evidence_band,
    audience_signal_rows: segment.audience_signal_rows,
    review_cluster_rows: segment.review_cluster_rows,
    voc_themes: themes.map(theme => theme.theme_id).join('|'),
    claim_limit: 'Secondary VOC evidence only; not an interview, not representative demand proof, not success evidence for H5/H6.'
  });
}

writeCsv(ICP_CAPTURE, capture.rows, capture.headers);
writeCsv(OUT, signoffs, [
  'capture_id',
  'segment_name',
  'test_type',
  'metric',
  'evidence_band',
  'audience_signal_rows',
  'review_cluster_rows',
  'voc_themes',
  'claim_limit'
]);

const lines = [];
lines.push('# ICP Secondary VOC Signoff V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This artifact adds secondary voice-of-customer context to the first ICP capture slots for the two top interview segments. It intentionally does not count as interview success: no participant was interviewed, no recent behavior was observed live, and no willingness-to-pay answer was collected.');
lines.push('');
lines.push('## Gate Read');
lines.push('');
lines.push(`- Secondary VOC rows filled: ${signoffs.length}.`);
lines.push('- H5 should move to in-progress/partial observed context, but success must remain 0 until real interviews are filled.');
lines.push('- H6 can use this as prompt/context input only; product-core validation still requires prototype sessions.');
lines.push('');
lines.push('## Signoff Rows');
lines.push('');
lines.push(mdTable(signoffs, [
  { key: 'capture_id', label: 'Capture' },
  { key: 'segment_name', label: 'Segment' },
  { key: 'test_type', label: 'Test' },
  { key: 'audience_signal_rows', label: 'Audience Rows', align: 'right' },
  { key: 'review_cluster_rows', label: 'Review Rows', align: 'right' },
  { key: 'voc_themes', label: 'VOC Themes' },
  { key: 'claim_limit', label: 'Claim Limit' }
]));
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${ICP_CAPTURE}\``);
lines.push(`- \`${ICP_SEGMENTS}\``);
lines.push(`- \`${VOC_MAP}\``);
lines.push(`- \`${REVIEW_SUMMARY}\``);

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`icp_secondary_voc_signoff=${OUT}`);
console.log(`doc=${DOC}`);
console.log(`signoff_rows=${signoffs.length}`);
