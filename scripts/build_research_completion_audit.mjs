import fs from 'fs';

const OUT = 'data_processed/research_completion_audit.csv';
const OUT_DOC = 'docs/decision/research-completion-audit-v1.md';

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
  return body.filter(r => r.some(Boolean)).map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])));
}

function csv(file) {
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : [];
}

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, [headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n'));
}

function mdTable(rows, columns) {
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = rows.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function fileExistsList(files) {
  return files.filter(file => fs.existsSync(file)).length;
}

function countBy(rows, key) {
  const out = {};
  for (const row of rows) out[row[key] || 'unknown'] = (out[row[key] || 'unknown'] || 0) + 1;
  return out;
}

function bulletCounts(counts) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');
}

const expanded = csv('data_raw/expanded/all_expanded_dedup.csv');
const expandedRaw = csv('data_raw/expanded/all_expanded_raw.csv');
const feature = csv('data_processed/competitor_feature_matrix.csv');
const audience = csv('data_processed/audience_signal_matrix.csv');
const whitespace = csv('data_processed/whitespace_signal_matrix.csv');
const tam = csv('data_processed/tam_sam_som_model.csv');
const marketConfidence = csv('data_processed/market_source_confidence_review.csv');
const monetizationProxy = csv('data_processed/market_monetization_proxy_matrix.csv');
const evidence = csv('data_processed/evidence_claim_register.csv');
const roadmap = csv('data_processed/validation_gap_roadmap.csv');
const manifest = csv('data_processed/evidence_artifact_manifest.csv');
const top100 = csv('data_processed/top100_competitor_review_scorecard.csv');
const validationQueue = csv('data_processed/top100_human_validation_queue.csv');
const icpSegments = csv('data_processed/icp_segment_matrix.csv');
const icpValidation = csv('data_processed/icp_validation_test_plan.csv');

const p0Roadmap = roadmap.filter(row => row.priority === 'P0');
const p1Roadmap = roadmap.filter(row => row.priority === 'P1');
const humanConfirmed = validationQueue.filter(row => !['', 'not_started'].includes(row.validation_status)).length;
const manifestMissing = manifest.filter(row => row.exists !== 'yes').length;
const primaryApps = top100.filter(row => row.duplicate_flag === 'primary_app_entry').length;
const strongMoneyMarkets = monetizationProxy.filter(row => row.monetization_proxy_band === 'strong_paid_behavior_proxy').length;

const requirements = [
  {
    requirement_id: 'REQ_01_MASTER_PLAN',
    requirement: 'Large plan and phased backlog are documented.',
    objective_source: 'User requested a large plan and autonomous execution path.',
    status: fs.existsSync('docs/research-expansion-master-plan.md') && roadmap.length ? 'proved_v1' : 'missing',
    evidence_strength: 'strong',
    proof: `master_plan=${fs.existsSync('docs/research-expansion-master-plan.md')}; roadmap_rows=${roadmap.length}`,
    evidence_files: 'docs/research-expansion-master-plan.md;data_processed/validation_gap_roadmap.csv;docs/decision/validation-gap-roadmap-v1.md',
    remaining_gap: 'Keep refreshing as validation results change.',
    next_action: 'Update after any manual validation/prototype result.'
  },
  {
    requirement_id: 'REQ_02_COMPETITOR_UNIVERSE',
    requirement: 'Competitor/source universe is expanded across five markets toward the aspirational 30k-50k app/source target.',
    objective_source: 'User requested 30k-50k applications/sources across app stores, forums, web apps, desktop apps, websites.',
    status: expandedRaw.length >= 30000 ? 'proved_scale_target' : 'partial_substantial_not_30k_50k',
    evidence_strength: expanded.length >= 10000 ? 'medium_high' : 'medium',
    proof: `dedup=${expanded.length}; raw=${expandedRaw.length}; niches=${Object.keys(countBy(expanded, 'niche')).length}; source_kinds=${Object.keys(countBy(expanded, 'source_kind')).length}`,
    evidence_files: 'data_raw/expanded/all_expanded_raw.csv;data_raw/expanded/all_expanded_dedup.csv;data_processed/competitor_feature_matrix.csv;docs/competitive/expanded-source-map.md;docs/competitive/source-expansion-backlog-v1.md',
    remaining_gap: 'Below aspirational 30k-50k raw source/app target; desktop stores, Product Hunt/AlternativeTo, B2B directories, forums, and curated lists remain backlog.',
    next_action: 'Run next non-search-heavy collectors from source expansion backlog.'
  },
  {
    requirement_id: 'REQ_03_FIVE_MARKET_COVERAGE',
    requirement: 'Research covers five core markets: coaching, mindfulness, avatar/identity, astrology/esoterics, gaming/progression benchmark.',
    objective_source: 'User framed five key directions / markets.',
    status: Object.keys(countBy(expanded, 'niche')).length >= 5 && tam.length >= 5 ? 'proved_v1' : 'incomplete',
    evidence_strength: 'strong',
    proof: `expanded_markets=${Object.keys(countBy(expanded, 'niche')).length}; tam_rows=${tam.length}; audience_rows=${audience.length}`,
    evidence_files: 'data_raw/expanded/all_expanded_dedup.csv;data_processed/tam_sam_som_model.csv;data_processed/audience_signal_matrix.csv',
    remaining_gap: 'Gaming should remain benchmark-only unless direct consumer overlap is validated.',
    next_action: 'Keep market-specific validation gates explicit.'
  },
  {
    requirement_id: 'REQ_04_MARKET_MONEY',
    requirement: 'TAM/SAM/SOM methodology and market-money evidence are prepared.',
    objective_source: 'User asked for complex market evaluation formulas and open research source gathering.',
    status: tam.length && marketConfidence.length && monetizationProxy.length ? 'supported_with_ranges_not_final' : 'missing',
    evidence_strength: 'medium',
    proof: `tam_rows=${tam.length}; source_confidence_rows=${marketConfidence.length}; strong_paid_proxy_markets=${strongMoneyMarkets}/5`,
    evidence_files: 'docs/market/market-sizing-methodology.md;data_processed/tam_sam_som_model.csv;data_processed/market_source_confidence_review.csv;data_processed/market_monetization_proxy_matrix.csv;docs/market/tam-sam-som-model-v1.md',
    remaining_gap: 'Market sizing remains range-based; competitor revenue/proxy triangulation and additional credible sources are needed for final claims.',
    next_action: 'Add competitor revenue/proxy review and refresh source confidence.'
  },
  {
    requirement_id: 'REQ_05_WHITESPACE',
    requirement: 'Whitespace/competitor gap analysis exists and identifies whether a narrow opening is plausible.',
    objective_source: 'User asked to prove a white spot among markets/apps and absence or weakness of existing solutions.',
    status: whitespace.length && top100.length ? 'narrow_supported_not_final' : 'missing',
    evidence_strength: 'medium',
    proof: `whitespace_rows=${whitespace.length}; high_ws=${whitespace.filter(row => row.whitespace_band === 'high').length}; top100=${top100.length}; behavior_tied=${top100.filter(row => row.behavior_tied_progression === 'yes').length}`,
    evidence_files: 'data_processed/whitespace_signal_matrix.csv;data_processed/top100_competitor_review_scorecard.csv;docs/intersections/whitespace-map-v2.md;docs/competitive/top100-competitor-review-v1.md',
    remaining_gap: 'Metadata can miss hidden in-app mechanics; manual app/onboarding validation is still required.',
    next_action: 'Execute P0/P1 human validation queue and Chrome mechanic validation.'
  },
  {
    requirement_id: 'REQ_06_AUDIENCE_ICP',
    requirement: 'Audience, ICP, JTBD, pain, and shared segment hypotheses are prepared.',
    objective_source: 'User asked for common audience, segments, customer profile, detailed matrices.',
    status: audience.length && icpSegments.length && icpValidation.length ? 'directionally_supported_validation_ready' : 'missing',
    evidence_strength: 'medium',
    proof: `audience_rows=${audience.length}; icp_segments=${icpSegments.length}; icp_validation_tests=${icpValidation.length}`,
    evidence_files: 'data_processed/audience_signal_matrix.csv;data_processed/icp_segment_matrix.csv;data_processed/icp_validation_test_plan.csv;docs/audience/icp-segment-matrix-v1.md;docs/audience/icp-validation-packet-v1.md',
    remaining_gap: 'Segments are directional and need interviews/prototype/WTP validation.',
    next_action: 'Run ICP validation packet for top two segments.'
  },
  {
    requirement_id: 'REQ_07_COMPETITIVE_ADVANTAGE',
    requirement: 'Competitive advantage and product-core hypotheses are made explicit.',
    objective_source: 'User asked to prove competitive advantage and move toward product ядро.',
    status: feature.length && fs.existsSync('docs/product/product-core-evidence-v1.md') ? 'supported_for_mvp_framing_not_validated' : 'missing',
    evidence_strength: 'medium',
    proof: `feature_rows=${feature.length}; primary_top100_apps=${primaryApps}; evidence_claims=${evidence.length}`,
    evidence_files: 'data_processed/product_core_evidence_matrix.csv;docs/product/product-core-evidence-v1.md;docs/strategy/value-proposition-v1.md;data_processed/evidence_claim_register.csv',
    remaining_gap: 'No prototype or user test proves the loop is understood/preferred.',
    next_action: 'Prototype two-minute loop and measure comprehension, emotional value, return intent.'
  },
  {
    requirement_id: 'REQ_08_REPORT_PDF',
    requirement: 'A large PDF/report artifact exists.',
    objective_source: 'User ultimately wanted a huge PDF report.',
    status: fs.existsSync('output/pdf/alina-evidence-first-report-draft.pdf') ? 'draft_done_not_polished_final' : 'missing',
    evidence_strength: 'medium_high',
    proof: `report_md=${fs.existsSync('reports/alina-evidence-first-report-draft.md')}; evidence_pdf=${fs.existsSync('output/pdf/alina-evidence-first-report-draft.pdf')}; visual_pdf=${fs.existsSync('output/pdf/alina-evidence-visual-report-v1.pdf')}`,
    evidence_files: 'reports/alina-evidence-first-report-draft.md;output/pdf/alina-evidence-first-report-draft.pdf;output/pdf/alina-evidence-visual-report-v1.pdf',
    remaining_gap: 'PDF is draft evidence/reporting artifact, not final polished investor/user-facing publication.',
    next_action: 'Create final designed PDF after human/prototype validation or mark as evidence draft explicitly.'
  },
  {
    requirement_id: 'REQ_09_VERSIONING_PROVENANCE',
    requirement: 'Research is saved locally, traceable, committed, and pushed to GitHub.',
    objective_source: 'User asked to save data locally, commit, and push so work is not lost.',
    status: manifest.length && manifestMissing === 0 ? 'proved_active' : 'partial',
    evidence_strength: 'high',
    proof: `manifest_rows=${manifest.length}; missing_manifest=${manifestMissing}; git_versioned=active`,
    evidence_files: 'data_processed/evidence_artifact_manifest.csv;docs/decision/evidence-package-manifest-v1.md;git log',
    remaining_gap: 'Manifest must be regenerated after future evidence changes.',
    next_action: 'Regenerate manifest and commit after each major layer.'
  },
  {
    requirement_id: 'REQ_10_VALIDATION_GATES',
    requirement: 'Remaining validation gates are explicit and prioritized.',
    objective_source: 'User wanted critical thinking and continued work when information is missing.',
    status: roadmap.length ? 'proved_v1_open_gates' : 'missing',
    evidence_strength: 'strong',
    proof: `roadmap_rows=${roadmap.length}; p0=${p0Roadmap.length}; p1=${p1Roadmap.length}; human_confirmed=${humanConfirmed}`,
    evidence_files: 'data_processed/validation_gap_roadmap.csv;docs/decision/validation-gap-roadmap-v1.md;data_processed/top100_human_validation_queue.csv',
    remaining_gap: 'Open P0 gates remain: manual competitor validation, paywall review, whitespace validation, competitive advantage prototype, ICP validation.',
    next_action: 'Work P0 roadmap rows in order.'
  }
];

writeCsv(OUT, requirements, [
  'requirement_id', 'requirement', 'objective_source', 'status', 'evidence_strength',
  'proof', 'evidence_files', 'remaining_gap', 'next_action'
]);

const lines = [];
lines.push('# Research Completion Audit V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This audit maps the original user objective to current evidence. It prevents the project from declaring victory just because many artifacts exist: each requirement is marked as proved, partial, directional, draft, or still requiring validation.');
lines.push('');
lines.push('## Status Mix');
lines.push('');
lines.push(bulletCounts(countBy(requirements, 'status')));
lines.push('');
lines.push('## Evidence Strength Mix');
lines.push('');
lines.push(bulletCounts(countBy(requirements, 'evidence_strength')));
lines.push('');
lines.push('## Completion Matrix');
lines.push('');
lines.push(mdTable(requirements, [
  { key: 'requirement_id', label: 'Requirement' },
  { key: 'status', label: 'Status' },
  { key: 'evidence_strength', label: 'Strength' },
  { key: 'proof', label: 'Proof' },
  { key: 'remaining_gap', label: 'Remaining Gap' },
  { key: 'next_action', label: 'Next Action' }
]));
lines.push('');
lines.push('## Decision Read');
lines.push('');
lines.push('- The research OS and evidence package are now strong enough for continued structured validation.');
lines.push('- The goal is not complete because the aspirational 30k-50k source universe, human/manual competitor validation, user/prototype validation, and final polished PDF are still not fully proven.');
lines.push('- The next highest-value work is to close P0 validation gates rather than add more unvalidated claims.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`audit=${OUT}`);
console.log(`doc=${OUT_DOC}`);
console.log(`requirements=${requirements.length}`);
console.log(`p0_open=${p0Roadmap.length}`);
