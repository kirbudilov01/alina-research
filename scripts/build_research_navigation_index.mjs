import fs from 'fs';

const OUT = 'data_processed/research_navigation_index.csv';
const DOC = 'docs/decision/research-navigation-index-v1.md';

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
  fs.writeFileSync(file, `${[headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n')}\n`);
}

function mdTable(rows, columns, limit = rows.length) {
  const limited = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '<br>')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function countBy(rows, key) {
  const out = {};
  for (const row of rows) out[row[key] || 'unknown'] = (out[row[key] || 'unknown'] || 0) + 1;
  return out;
}

function firstExisting(files) {
  return files.split(';').map(clean).find(file => file && fs.existsSync(file)) || '';
}

function includesAny(text, values) {
  const lower = clean(text).toLowerCase();
  return values.some(value => lower.includes(value.toLowerCase()));
}

const claims = csv('data_processed/evidence_claim_register.csv');
const completion = csv('data_processed/research_completion_audit.csv');
const gates = csv('data_processed/validation_gate_calculator.csv');
const tranches = csv('data_processed/validation_tranche_planner.csv');
const briefings = csv('data_processed/validation_tranche_briefing_index.csv');
const manifest = csv('data_processed/evidence_artifact_manifest.csv');

const gateByHypothesis = new Map();
for (const gate of gates) {
  for (const h of clean(gate.linked_hypotheses).split('|').filter(Boolean)) gateByHypothesis.set(h, gate);
}

const trancheByGate = new Map();
for (const tranche of tranches) {
  for (const gate of clean(tranche.linked_gates).split('|').filter(Boolean)) {
    if (!trancheByGate.has(gate)) trancheByGate.set(gate, tranche);
  }
}

const briefingByTranche = new Map(briefings.map(row => [row.tranche_id, row]));

function linkedHypothesisForClaim(claim) {
  if (claim.claim_id?.startsWith('H1')) return 'H1';
  if (claim.claim_id?.startsWith('H2')) return 'H2';
  if (claim.claim_id?.startsWith('H3')) return 'H3';
  if (claim.claim_id?.startsWith('H4')) return 'H4';
  if (claim.claim_id?.startsWith('H5')) return 'H5';
  if (claim.claim_id?.startsWith('H6')) return 'H6';
  return '';
}

function laneForClaim(claim) {
  const id = claim.claim_id || '';
  const text = `${claim.claim} ${claim.next_action} ${claim.evidence_files}`;
  if (id.startsWith('H1') || id.startsWith('H3') || includesAny(text, ['whitespace', 'walkthrough', 'competitor'])) return 'manual_competitor_walkthrough';
  if (id.startsWith('H2') || includesAny(text, ['money', 'paywall', 'pricing', 'TAM', 'SAM', 'SOM'])) return 'paid_flow_validation';
  if (id.startsWith('H5') || includesAny(text, ['audience', 'ICP', 'interview', 'reddit'])) return 'icp_interviews|reddit_manual_reading';
  if (id.startsWith('H4') || id.startsWith('H6') || includesAny(text, ['prototype', 'product core', 'MVP'])) return 'prototype_user_validation';
  return 'project_navigation';
}

function navigationTier(claim) {
  if (claim.evidence_status?.includes('not_final') || claim.evidence_status?.includes('open') || claim.evidence_status?.includes('unvalidated')) return 'needs_validation';
  if (claim.confidence === 'high' && claim.evidence_status?.startsWith('proved')) return 'reference_anchor';
  if (claim.confidence === 'medium' || claim.evidence_status?.includes('directional')) return 'directional_claim';
  return 'supporting';
}

const claimRows = claims.map((claim, index) => {
  const hypothesis = linkedHypothesisForClaim(claim);
  const gate = hypothesis ? gateByHypothesis.get(hypothesis) : null;
  const tranche = gate ? trancheByGate.get(gate.gate_id) : null;
  const briefing = tranche ? briefingByTranche.get(tranche.tranche_id) : null;
  const evidenceFiles = clean(claim.evidence_files);
  const primaryFile = firstExisting(evidenceFiles);
  return {
    nav_id: `NAV_CLAIM_${String(index + 1).padStart(3, '0')}`,
    nav_type: 'claim',
    label: claim.claim_id,
    title: claim.claim,
    status: claim.evidence_status,
    confidence: claim.confidence,
    navigation_tier: navigationTier(claim),
    lane: laneForClaim(claim),
    linked_hypothesis: hypothesis,
    linked_gate: gate?.gate_id || '',
    gate_status: gate?.gate_status || '',
    linked_tranche: tranche?.tranche_id || '',
    briefing_path: briefing?.briefing_path || '',
    primary_file: primaryFile,
    evidence_files: evidenceFiles,
    next_action: claim.next_action,
    boundary: claim.key_gap || 'Use source files and claim register before upgrading this claim.'
  };
});

const completionRows = completion.map((row, index) => ({
  nav_id: `NAV_REQ_${String(index + 1).padStart(3, '0')}`,
  nav_type: 'requirement',
  label: row.requirement_id,
  title: row.requirement,
  status: row.status,
  confidence: row.evidence_strength,
  navigation_tier: row.status?.startsWith('proved') ? 'reference_anchor' : 'needs_validation',
  lane: includesAny(row.requirement, ['validation', 'gates']) ? 'validation_operating_system' : 'research_requirement',
  linked_hypothesis: '',
  linked_gate: '',
  gate_status: '',
  linked_tranche: '',
  briefing_path: '',
  primary_file: firstExisting(row.evidence_files),
  evidence_files: row.evidence_files,
  next_action: row.next_action,
  boundary: row.remaining_gap
}));

const gateRows = gates.map((gate, index) => {
  const tranche = trancheByGate.get(gate.gate_id);
  const briefing = tranche ? briefingByTranche.get(tranche.tranche_id) : null;
  return {
    nav_id: `NAV_GATE_${String(index + 1).padStart(3, '0')}`,
    nav_type: 'gate',
    label: gate.gate_id,
    title: gate.success_gate,
    status: gate.gate_status,
    confidence: gate.evidence_state,
    navigation_tier: gate.gate_status === 'not_started' ? 'needs_observed_evidence' : 'review_ready',
    lane: gate.workstream,
    linked_hypothesis: gate.linked_hypotheses,
    linked_gate: gate.gate_id,
    gate_status: gate.gate_status,
    linked_tranche: tranche?.tranche_id || '',
    briefing_path: briefing?.briefing_path || '',
    primary_file: gate.output_file_to_update,
    evidence_files: gate.source_files,
    next_action: gate.next_action,
    boundary: gate.kill_or_downgrade_gate
  };
});

const rows = [...completionRows, ...claimRows, ...gateRows];

writeCsv(OUT, rows, [
  'nav_id',
  'nav_type',
  'label',
  'title',
  'status',
  'confidence',
  'navigation_tier',
  'lane',
  'linked_hypothesis',
  'linked_gate',
  'gate_status',
  'linked_tranche',
  'briefing_path',
  'primary_file',
  'evidence_files',
  'next_action',
  'boundary'
]);

const lines = [];
lines.push('# Research Navigation Index V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This index is the map for the whole evidence package. It links requirements, claims, gates, tranches, briefing files, source files, next actions, and claim boundaries so the research can be navigated without opening dozens of CSVs first.');
lines.push('');
lines.push('## Package Snapshot');
lines.push('');
lines.push(`- Navigation rows: ${rows.length}`);
lines.push(`- Claim rows: ${claimRows.length}`);
lines.push(`- Requirement rows: ${completionRows.length}`);
lines.push(`- Gate rows: ${gateRows.length}`);
lines.push(`- Manifest artifacts currently tracked: ${manifest.length}`);
lines.push(`- Validation tranches: ${tranches.length}`);
lines.push(`- Tranche briefings: ${briefings.length}`);
lines.push('');
lines.push('Navigation tiers:');
lines.push('');
lines.push(Object.entries(countBy(rows, 'navigation_tier')).sort((a, b) => b[1] - a[1]).map(([key, value]) => `- ${key}: ${value}`).join('\n'));
lines.push('');
lines.push('## Open Validation Route');
lines.push('');
lines.push(mdTable(rows.filter(row => row.nav_type === 'gate'), [
  { key: 'label', label: 'Gate' },
  { key: 'linked_hypothesis', label: 'Hypothesis' },
  { key: 'status', label: 'Status' },
  { key: 'linked_tranche', label: 'Tranche' },
  { key: 'briefing_path', label: 'Briefing' },
  { key: 'next_action', label: 'Next Action' }
], gateRows.length));
lines.push('');
lines.push('## Highest-Leverage Claims');
lines.push('');
lines.push(mdTable(rows.filter(row => row.nav_type === 'claim' && row.navigation_tier !== 'reference_anchor'), [
  { key: 'label', label: 'Claim' },
  { key: 'status', label: 'Status' },
  { key: 'confidence', label: 'Confidence' },
  { key: 'linked_gate', label: 'Gate' },
  { key: 'linked_tranche', label: 'Tranche' },
  { key: 'primary_file', label: 'Primary File' },
  { key: 'boundary', label: 'Boundary' }
], 20));
lines.push('');
lines.push('## Requirement Map');
lines.push('');
lines.push(mdTable(completionRows, [
  { key: 'label', label: 'Requirement' },
  { key: 'status', label: 'Status' },
  { key: 'confidence', label: 'Strength' },
  { key: 'primary_file', label: 'Primary File' },
  { key: 'next_action', label: 'Next Action' }
], completionRows.length));
lines.push('');
lines.push('## Claim Boundary');
lines.push('');
lines.push('This is a navigation artifact, not new evidence. It must not upgrade a claim. It tells the operator where evidence lives, what remains open, and which tranche or briefing should be executed before any claim is strengthened.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${DOC}\``);

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`research_navigation_rows=${rows.length}`);
console.log(`claim_rows=${claimRows.length}`);
console.log(`gate_rows=${gateRows.length}`);
console.log(`doc=${DOC}`);
