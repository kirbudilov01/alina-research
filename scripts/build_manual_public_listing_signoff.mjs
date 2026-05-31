import fs from 'fs';

const LISTING = 'data_processed/public_listing_inspection_results.csv';
const WALKTHROUGH = 'data_processed/manual_walkthrough_capture_sheet.csv';
const PACKET = 'data_processed/manual_competitor_inspection_packet.csv';
const OUT = 'data_processed/manual_public_listing_signoff.csv';
const DOC = 'docs/decision/manual-public-listing-signoff-v1.md';

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

function directnessLabel(row) {
  if (row.public_listing_verdict === 'public_listing_supports_strict_loop_claim') {
    return 'public_listing_strict_loop_risk_not_app_walkthrough';
  }
  return 'public_listing_adjacent_loop_not_app_walkthrough';
}

function paywallLabel(row) {
  return clean(row.top_iap_public_rows)
    ? 'public_iap_visible_first_value_boundary_not_inspected'
    : 'public_iap_not_visible_first_value_boundary_not_inspected';
}

function observedAnswer(row) {
  const excerpt = clean(row.public_evidence_excerpt);
  return [
    `Public App Store listing read: ${row.public_listing_verdict || 'no verdict'}.`,
    `Audience/product promise: ${excerpt}`,
    `IAP/pricing rows visible in listing: ${row.top_iap_public_rows || 'not visible in current row'}.`
  ].join(' ');
}

const listing = readCsv(LISTING);
const walkthrough = readCsv(WALKTHROUGH);
const packet = readCsv(PACKET);

const listingByAppId = new Map(listing.rows.map(row => [row.app_store_id, row]));
const signoffs = [];

for (const row of walkthrough.rows) {
  if (row.screenshot_slot !== 'app_store_listing_or_public_positioning') continue;
  const source = listingByAppId.get(row.app_store_id);
  if (!source) continue;
  row.capture_status = 'public_listing_signoff_completed_not_app_walkthrough';
  row.observed_answer = observedAnswer(source);
  row.directness_label = directnessLabel(source);
  row.action_to_avatar_causality_label = source.action_to_avatar_causality_public_read || 'not_visible_public_listing';
  row.paywall_boundary_label = paywallLabel(source);
  row.inspector_notes = [
    `Local signoff 2026-05-31: public listing has been inspected, but app onboarding, first action, progress/avatar feedback, and first paywall timing have not been walked through.`,
    `Hidden-clone risk: ${source.hidden_clone_risk_public_read || 'unknown'}.`,
    `H3 implication: ${source.implication_for_h3_whitespace || 'requires walkthrough'}.`
  ].join(' ');
  signoffs.push({
    capture_id: row.capture_id,
    inspection_rank: row.inspection_rank,
    app_name: row.app_name,
    listing_verdict: source.public_listing_verdict,
    hidden_clone_risk: source.hidden_clone_risk_public_read,
    causality_public_read: source.action_to_avatar_causality_public_read,
    directness_label: row.directness_label,
    paywall_boundary_label: row.paywall_boundary_label,
    claim_limit: 'Listing-only evidence: use to prioritize walkthrough and describe public positioning, not to prove H1/H3 or rule out hidden full-loop clones.'
  });
}

for (const row of packet.rows) {
  const source = listingByAppId.get(row.app_store_id);
  if (!source) continue;
  row.inspection_status = 'public_listing_signoff_completed_not_app_walkthrough';
  row.inspector_notes = `Public listing signoff completed from ${LISTING}; app/onboarding walkthrough still open. Hidden-clone risk: ${source.hidden_clone_risk_public_read || 'unknown'}.`;
  row.final_verdict_after_inspection = 'listing_only_no_app_walkthrough_claim_upgrade_blocked';
}

writeCsv(WALKTHROUGH, walkthrough.rows, walkthrough.headers);
writeCsv(PACKET, packet.rows, packet.headers);
writeCsv(OUT, signoffs, [
  'capture_id',
  'inspection_rank',
  'app_name',
  'listing_verdict',
  'hidden_clone_risk',
  'causality_public_read',
  'directness_label',
  'paywall_boundary_label',
  'claim_limit'
]);

const strictRows = signoffs.filter(row => row.directness_label === 'public_listing_strict_loop_risk_not_app_walkthrough');
const lines = [];
lines.push('# Manual Public Listing Signoff V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This artifact moves the manual competitor walkthrough workstream from empty capture rows to listing-only observed evidence. It deliberately does not count as app/onboarding walkthrough success: public copy can reveal risk and prioritization, but cannot prove whether a hidden full Alina loop exists inside the product.');
lines.push('');
lines.push('## Gate Read');
lines.push('');
lines.push(`- Listing signoff rows filled: ${signoffs.length}.`);
lines.push(`- Strict public-loop risk rows that still require app walkthrough: ${strictRows.length}.`);
lines.push('- H1/H3 should move from zero observed rows to in-progress, but remain below threshold and keep hold_validate.');
lines.push('');
lines.push('## Signoff Rows');
lines.push('');
lines.push(mdTable(signoffs, [
  { key: 'inspection_rank', label: 'Rank', align: 'right' },
  { key: 'app_name', label: 'App' },
  { key: 'listing_verdict', label: 'Listing Verdict' },
  { key: 'hidden_clone_risk', label: 'Hidden Clone Risk' },
  { key: 'causality_public_read', label: 'Public Causality Read' },
  { key: 'claim_limit', label: 'Claim Limit' }
]));
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${WALKTHROUGH}\``);
lines.push(`- \`${PACKET}\``);
lines.push(`- \`${LISTING}\``);

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`manual_public_listing_signoff=${OUT}`);
console.log(`doc=${DOC}`);
console.log(`signoff_rows=${signoffs.length}`);
