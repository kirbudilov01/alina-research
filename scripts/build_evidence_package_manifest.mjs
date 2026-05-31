import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const OUT = 'data_processed/evidence_artifact_manifest.csv';
const OUT_DOC = 'docs/decision/evidence-package-manifest-v1.md';

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
  if (!headers) return { headers: [], rows: [] };
  return {
    headers,
    rows: body.filter(r => r.some(Boolean)).map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])))
  };
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

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function lineCount(text) {
  if (!text) return 0;
  return text.endsWith('\n') ? text.split('\n').length - 1 : text.split('\n').length;
}

function classify(file) {
  if (file.startsWith('data_raw/')) return 'raw_data';
  if (file.startsWith('data_processed/')) return 'processed_data';
  if (file.startsWith('docs/')) return 'research_doc';
  if (file.startsWith('reports/')) return 'report';
  if (file.startsWith('output/pdf/')) return 'pdf';
  if (file.startsWith('output/charts/')) return 'chart';
  if (file.startsWith('output/validation/')) return 'validation_workspace';
  if (file.startsWith('scripts/')) return 'generator_script';
  return 'other';
}

function evidenceRole(file) {
  if (/expanded|top300|competitor_universe|chrome_extension|p0_external/.test(file)) return 'competitor_universe';
  if (/tam|som|market|monetization|pricing|iap|paywall/.test(file)) return 'market_money';
  if (/whitespace|product_core|battlecard|top100/.test(file)) return 'competitive_whitespace';
  if (/audience|review|forum|icp/.test(file)) return 'audience_icp';
  if (/evidence|validation|roadmap|status|report|pdf|chart|hypothesis/.test(file)) return 'decision_artifact';
  if (/source|registry|claim/.test(file)) return 'source_claim';
  return 'supporting';
}

function csvStats(file, text) {
  const parsed = parseCsv(text);
  const sourceLikeColumns = parsed.headers.filter(h => /url|source|link|domain|app_store_id|track_id|bundle|package/i.test(h));
  let nonEmptySourceRefs = 0;
  for (const row of parsed.rows) {
    if (sourceLikeColumns.some(col => clean(row[col]))) nonEmptySourceRefs += 1;
  }
  return {
    row_count: parsed.rows.length,
    column_count: parsed.headers.length,
    source_ref_rows: nonEmptySourceRefs,
    source_ref_columns: sourceLikeColumns.join('|')
  };
}

function fileRow(file) {
  const exists = fs.existsSync(file);
  if (!exists) {
    return {
      file_path: file,
      artifact_type: classify(file),
      evidence_role: evidenceRole(file),
      exists: 'no',
      bytes: 0,
      line_count: 0,
      row_count: '',
      column_count: '',
      source_ref_rows: '',
      source_ref_columns: '',
      sha256: '',
      generated_or_manual: 'missing'
    };
  }
  const stat = fs.statSync(file);
  const text = fs.readFileSync(file, 'utf8');
  const ext = path.extname(file).toLowerCase();
  const stats = ext === '.csv'
    ? csvStats(file, text)
    : { row_count: '', column_count: '', source_ref_rows: '', source_ref_columns: '' };
  return {
    file_path: file,
    artifact_type: classify(file),
    evidence_role: evidenceRole(file),
    exists: 'yes',
    bytes: stat.size,
    line_count: lineCount(text),
    row_count: stats.row_count,
    column_count: stats.column_count,
    source_ref_rows: stats.source_ref_rows,
    source_ref_columns: stats.source_ref_columns,
    sha256: sha256(file).slice(0, 16),
    generated_or_manual: file.startsWith('scripts/') ? 'generator' : 'artifact'
  };
}

function listFiles(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(full, predicate));
    else if (predicate(full)) out.push(full);
  }
  return out.sort();
}

const requiredArtifacts = [
  'data_raw/expanded/all_expanded_raw.csv',
  'data_raw/expanded/all_expanded_dedup.csv',
  'data_raw/expanded/p0_external_sources_raw.csv',
  'data_raw/expanded_itch_raw.csv',
  'data_raw/expanded_steam_tags_raw.csv',
  'data_raw/expanded_desktop_store_raw.csv',
  'data_raw/expanded_chrome_extensions_raw.csv',
  'data_raw/expanded_reddit_competitor_mentions_raw.csv',
  'data_raw/chrome_extension_detail_raw.csv',
  'data_raw/app_store_top_candidate_reviews.csv',
  'data_raw/app_store_iap_pricing_raw.csv',
  'data_raw/google_play_pricing_raw.csv',
  'data_raw/web_paywall_discovery_raw.csv',
  'data_raw/forum_quote_evidence_raw.csv',
  'data_processed/competitor_feature_matrix.csv',
  'data_processed/cross_source_universe_raw_index.csv',
  'data_processed/cross_source_universe_dedup.csv',
  'data_processed/cross_source_universe_summary.csv',
  'data_processed/cross_source_coverage_matrix.csv',
  'data_processed/cross_source_market_saturation_matrix.csv',
  'data_processed/audience_signal_matrix.csv',
  'data_processed/whitespace_signal_matrix.csv',
  'data_processed/tam_sam_som_model.csv',
  'data_processed/som_sensitivity_scenarios.csv',
  'data_processed/market_claims.csv',
  'data_processed/market_source_confidence_review.csv',
  'data_processed/market_sizing_assumption_audit.csv',
  'data_processed/market_sizing_stress_test.csv',
  'data_processed/market_monetization_proxy_matrix.csv',
  'data_processed/market_money_triangulation.csv',
  'data_processed/market_money_triangulation_summary.csv',
  'data_processed/competitor_revenue_proxy_review.csv',
  'data_processed/competitor_revenue_proxy_market_summary.csv',
  'data_processed/web_paywall_visual_adjudication.csv',
  'data_processed/web_paywall_visual_adjudication_summary.csv',
  'data_processed/itch_source_summary.csv',
  'data_processed/steam_tag_source_summary.csv',
  'data_processed/desktop_store_source_summary.csv',
  'data_processed/chrome_webstore_source_expansion_summary.csv',
  'data_processed/reddit_competitor_mentions_summary.csv',
  'data_processed/reddit_mention_signal_matrix.csv',
  'data_processed/reddit_mention_app_summary.csv',
  'data_processed/reddit_manual_reading_queue.csv',
  'data_processed/reddit_manual_reading_prompt_bank.csv',
  'data_processed/reddit_manual_reading_capture_sheet.csv',
  'data_processed/top100_competitor_review_scorecard.csv',
  'data_processed/top100_human_validation_queue.csv',
  'data_processed/manual_competitor_inspection_packet.csv',
  'data_processed/manual_competitor_inspection_rubric.csv',
  'data_processed/public_listing_inspection_results.csv',
  'data_processed/public_listing_inspection_summary.csv',
  'data_processed/review_jtbd_cluster_summary.csv',
  'data_processed/community_referral_signal_rows.csv',
  'data_processed/community_referral_summary.csv',
  'data_processed/forum_quote_coding_matrix.csv',
  'data_processed/icp_segment_matrix.csv',
  'data_processed/icp_validation_test_plan.csv',
  'data_processed/icp_recruiting_bridge.csv',
  'data_processed/icp_recruiting_message_bank.csv',
  'data_processed/prototype_validation_stimulus_flow.csv',
  'data_processed/prototype_validation_scorecard.csv',
  'data_processed/hypothesis_decision_matrix.csv',
  'data_processed/evidence_claim_register.csv',
  'data_processed/research_navigation_index.csv',
  'data_processed/russian_narrative_evidence_map.csv',
  'data_processed/russian_market_deep_dives.csv',
  'data_processed/validation_gap_roadmap.csv',
  'data_processed/validation_execution_dashboard.csv',
  'data_processed/p0_validation_command_center.csv',
  'data_processed/p0_validation_field_guide.csv',
  'data_processed/russian_validation_fieldbook.csv',
  'data_processed/validation_evidence_workspace_index.csv',
  'data_processed/validation_batch_01_index.csv',
  'data_processed/validation_batch_02_index.csv',
  'data_processed/validation_batch_03_index.csv',
  'data_processed/validation_evidence_rollup.csv',
  'data_processed/validation_tranche_planner.csv',
  'data_processed/validation_tranche_briefing_index.csv',
  'data_processed/validation_gate_calculator.csv',
  'data_processed/validation_gate_status_summary.csv',
  'data_processed/manual_walkthrough_capture_sheet.csv',
  'data_processed/paid_flow_capture_sheet.csv',
  'data_processed/icp_interview_capture_sheet.csv',
  'data_processed/prototype_session_capture_sheet.csv',
  'reports/alina-evidence-first-report-draft.md',
  'reports/alina-russian-narrative-report-v1.md',
  'docs/decision/research-navigation-index-v1.md',
  'docs/decision/russian-narrative-evidence-map-v1.md',
  'docs/market/russian-market-deep-dives-v1.md',
  'docs/decision/russian-validation-fieldbook-v1.md',
  'reports/evidence-status-2026-05-31.md',
  'output/pdf/alina-evidence-first-report-draft.pdf',
  'output/pdf/alina-evidence-visual-report-v1.pdf',
  'output/pdf/alina-polished-evidence-pack-v1.pdf',
  'output/pdf/alina-russian-narrative-report-v1.pdf',
  'output/validation/README.md',
  'output/validation/templates/generic-validation-note-template.md',
  'docs/decision/validation-batch-01-v1.md',
  'docs/decision/validation-batch-02-v1.md',
  'docs/decision/validation-batch-03-v1.md',
  'docs/decision/validation-evidence-rollup-v1.md',
  'docs/decision/validation-tranche-planner-v1.md',
  'docs/decision/validation-tranche-briefings-v1.md'
];

const discoveredArtifacts = [
  ...listFiles('data_processed/cross_source_universe_raw_parts', file => /\.csv$/i.test(file)),
  ...listFiles('docs', file => /\.(md)$/i.test(file)),
  ...listFiles('reports', file => /\.(md)$/i.test(file)),
  ...listFiles('output/charts', file => /\.(svg)$/i.test(file)),
  ...listFiles('output/validation', file => /\.(md)$/i.test(file)),
  ...listFiles('scripts', file => /^scripts\/(build_|collect_|enrich_|capture_|interpret_|expand_).*\.(mjs|py)$/i.test(file))
];

const files = Array.from(new Set([...requiredArtifacts, ...discoveredArtifacts])).sort();
const rows = files.map(fileRow);

writeCsv(OUT, rows, [
  'file_path', 'artifact_type', 'evidence_role', 'exists', 'bytes', 'line_count',
  'row_count', 'column_count', 'source_ref_rows', 'source_ref_columns',
  'sha256', 'generated_or_manual'
]);

const missing = rows.filter(row => row.exists !== 'yes');
const csvRows = rows.filter(row => row.file_path.endsWith('.csv'));
const totalCsvRows = csvRows.reduce((sum, row) => sum + Number(row.row_count || 0), 0);
const sourceBackedRows = csvRows.reduce((sum, row) => sum + Number(row.source_ref_rows || 0), 0);
const byType = rows.reduce((acc, row) => {
  acc[row.artifact_type] = (acc[row.artifact_type] || 0) + 1;
  return acc;
}, {});
const byRole = rows.reduce((acc, row) => {
  acc[row.evidence_role] = (acc[row.evidence_role] || 0) + 1;
  return acc;
}, {});

const lines = [];
lines.push('# Evidence Package Manifest V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This manifest makes the research package auditable. It lists key raw data, processed data, docs, reports, charts, PDFs, and generator scripts with row counts, file sizes, source-reference coverage, and short SHA-256 hashes.');
lines.push('');
lines.push('## Package Summary');
lines.push('');
lines.push(`- Manifest rows: ${rows.length}`);
lines.push(`- Missing required artifacts: ${missing.length}`);
lines.push(`- CSV artifacts: ${csvRows.length}`);
lines.push(`- Total CSV data rows tracked: ${totalCsvRows}`);
lines.push(`- CSV rows with source-like identifiers/URLs/domains/packages: ${sourceBackedRows}`);
lines.push('');
lines.push('Artifact types:');
lines.push('');
lines.push(Object.entries(byType).sort((a, b) => b[1] - a[1]).map(([key, value]) => `- ${key}: ${value}`).join('\n'));
lines.push('');
lines.push('Evidence roles:');
lines.push('');
lines.push(Object.entries(byRole).sort((a, b) => b[1] - a[1]).map(([key, value]) => `- ${key}: ${value}`).join('\n'));
lines.push('');
if (missing.length) {
  lines.push('## Missing Artifacts');
  lines.push('');
  lines.push(mdTable(missing, [
    { key: 'file_path', label: 'File' },
    { key: 'evidence_role', label: 'Role' }
  ]));
  lines.push('');
}
lines.push('## Key Data Artifacts');
lines.push('');
lines.push(mdTable(rows.filter(row => ['raw_data', 'processed_data'].includes(row.artifact_type)), [
  { key: 'file_path', label: 'File' },
  { key: 'evidence_role', label: 'Role' },
  { key: 'row_count', label: 'Rows', align: 'right' },
  { key: 'source_ref_rows', label: 'Source Ref Rows', align: 'right' },
  { key: 'sha256', label: 'Hash' }
], 40));
lines.push('');
lines.push('## Decision Artifacts');
lines.push('');
lines.push(mdTable(rows.filter(row => ['research_doc', 'report', 'pdf'].includes(row.artifact_type) && row.evidence_role === 'decision_artifact'), [
  { key: 'file_path', label: 'File' },
  { key: 'artifact_type', label: 'Type' },
  { key: 'line_count', label: 'Lines', align: 'right' },
  { key: 'bytes', label: 'Bytes', align: 'right' },
  { key: 'sha256', label: 'Hash' }
], 40));
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`manifest=${OUT}`);
console.log(`doc=${OUT_DOC}`);
console.log(`artifacts=${rows.length}`);
console.log(`missing=${missing.length}`);
console.log(`csv_rows=${totalCsvRows}`);
console.log(`source_ref_rows=${sourceBackedRows}`);
