import fs from 'fs';
import path from 'path';

const OUT = 'data_processed/validation_evidence_workspace_index.csv';
const OUT_DOC = 'docs/decision/validation-evidence-workspace-v1.md';
const ROOT = 'output/validation';
const TEMPLATE_DIR = `${ROOT}/templates`;

for (const dir of ['data_processed', 'docs/decision', ROOT, TEMPLATE_DIR]) fs.mkdirSync(dir, { recursive: true });

function clean(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function slug(value) {
  return clean(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'untitled';
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
  fs.writeFileSync(file, [headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n'));
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

function bulletCounts(counts) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');
}

function writeFile(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${text.trim()}\n`);
}

const commands = csv('data_processed/p0_validation_command_center.csv');
const fieldGuide = csv('data_processed/p0_validation_field_guide.csv');
const lanes = Array.from(new Set(commands.map(row => row.lane).filter(Boolean))).sort();
const today = new Date().toISOString().slice(0, 10);

const laneDescriptions = {
  manual_competitor_walkthrough: 'Competitor app/listing walkthrough screenshots and final directness verdicts.',
  paid_flow_validation: 'Pricing/paywall screenshot signoff, product-match checks, and conservative monetization labels.',
  icp_interviews: 'Problem interview notes, recent behavior evidence, language resonance, WTP, and disconfirmation quotes.',
  prototype_user_validation: 'Two-minute prototype session notes, screen-by-screen observations, comprehension and value ratings.',
  prototype_scorecard_gate: 'Calculated prototype scorecard gate results after session batches.'
};

const rows = [];
for (const lane of lanes) {
  const laneCommands = commands.filter(row => row.lane === lane);
  const blockerCount = laneCommands.filter(row => row.priority === 'P0_blocker').length;
  const p0Count = laneCommands.filter(row => row.priority === 'P0').length;
  const laneDir = `${ROOT}/${today}/${lane}`;
  fs.mkdirSync(laneDir, { recursive: true });
  writeFile(`${laneDir}/README.md`, `
# ${lane} Evidence Intake

Generated: ${new Date().toISOString()}

Purpose: ${laneDescriptions[lane] || 'Validation evidence intake lane.'}

Use this folder for raw screenshots, notes, and session artifacts linked to command rows.

Naming:

\`<command_id>__<target_slug>__<slot_or_metric>.png\`
\`<command_id>__<target_slug>__notes.md\`

Rules:

- Keep raw screenshots unchanged.
- Put interpretation in the relevant CSV notes fields, not in the image filename.
- Every note must include command_id, source files, pass gate, downgrade/kill gate, and final status.
- After filling evidence, rebuild audits/report/PDF and commit.
`);
  rows.push({
    lane,
    workspace_dir: laneDir,
    readme_path: `${laneDir}/README.md`,
    command_rows: laneCommands.length,
    p0_blockers: blockerCount,
    p0_rows: p0Count,
    template_file: `${TEMPLATE_DIR}/${lane}-notes-template.md`,
    evidence_description: laneDescriptions[lane] || 'Validation evidence intake lane.',
    first_command_ids: laneCommands.slice(0, 5).map(row => row.command_id).join('|')
  });
}

const genericTemplate = `
# Validation Evidence Note

- command_id:
- lane:
- target:
- date:
- operator:
- source_url:
- source_files:
- output_file_to_update:

## Raw Evidence

- screenshot_paths:
- notes_paths:
- participant_or_app_context:

## Observation

- what_was_checked:
- what_was_observed:
- exact_quote_or_visible_text:
- contradiction_or_support:

## Gate Decision

- pass_gate:
- downgrade_or_kill_gate:
- current_status: not_started | captured | confirmed | partial | rejected | blocked
- final_verdict:

## Downstream Updates Required

- source_csv_updated: yes/no
- hypothesis_decision_update_required: yes/no
- report_pdf_caveat_update_required: yes/no
`;

writeFile(`${TEMPLATE_DIR}/generic-validation-note-template.md`, genericTemplate);

const laneTemplates = {
  manual_competitor_walkthrough: `
# Manual Competitor Walkthrough Note

- command_id:
- app_name:
- app_store_id:
- date:
- operator:
- source_url:

## Screenshot Slots

- app_store_listing_or_public_positioning:
- onboarding_first_value_screen:
- first_daily_action_or_task_screen:
- progress_avatar_identity_feedback_screen:
- first_paywall_or_iap_terms_screen:

## Core Questions

- coherent_daily_loop_or_feature_shelves:
- personal_meaning_prompt_before_action:
- concrete_action_under_two_minutes:
- completion_changes_avatar_identity_progress:
- paywall_before_or_after_first_value:
- hidden_direct_clone_risk:

## Verdict

- final_directness: full_loop | adjacent_loop | weak_adjacency | blocked | hidden_direct_clone
- action_to_avatar_causality: visible | inferred | absent | blocked
- paywall_boundary:
- inspector_notes:
`,
  paid_flow_validation: `
# Paid-Flow Signoff Note

- command_id:
- app_name:
- date:
- operator:
- source_url:
- screenshot_path:

## Product Match

- same_app_or_brand:
- parent_company_only:
- unrelated_or_ocr_artifact:

## Pricing/Paywall Evidence

- monthly_price:
- annual_price:
- trial_length:
- bundle_or_consumable:
- first_meaningful_paywall_boundary:

## Verdict

- signoff_status: confirmed | partial | rejected | login_gated | unrelated
- conservative_claim_limit:
- human_signoff_note:
`,
  icp_interviews: `
# ICP Interview Note

- command_id:
- segment_id:
- participant_code:
- date:
- operator:

## Screener

- recent_behavior_match:
- tools_used_last_30_days:
- last_trigger:

## Problem Episode

- specific_episode:
- workaround:
- pain_intensity_1_5:
- exact_language:

## Concept / Prototype Response

- comprehension_yes_no:
- preferred_concept:
- differentiation_1_5:
- acceptable_price_range:
- paid_feature_rank:
- fatal_objection:
- verbatim_quote:
`,
  prototype_user_validation: `
# Prototype Session Note

- command_id:
- segment_id:
- participant_code:
- screen_id:
- date:
- operator:

## Screen Observation

- completion_time_seconds:
- comprehension_yes_no:
- meaning_lift_1_5:
- differentiation_1_5:
- return_intent_1_5:
- trust_objection:
- verbatim_quote:

## S06 Causality Probe

- what_changed:
- what_caused_change:
- action_to_avatar_causality_understood:
`,
  prototype_scorecard_gate: `
# Prototype Scorecard Gate Note

- command_id:
- metric_id:
- date:
- operator:
- sample_size:

## Calculation

- observed_value:
- supporting_quotes:
- gate_status: pass | hold | fail | kill

## Implication

- h4_update:
- h6_update:
- report_caveat_update:
`
};

for (const lane of lanes) {
  writeFile(`${TEMPLATE_DIR}/${lane}-notes-template.md`, laneTemplates[lane] || genericTemplate);
}

writeFile(`${ROOT}/README.md`, `
# Alina Validation Evidence Workspace

Generated: ${new Date().toISOString()}

This folder is the intake area for observed validation evidence. It supports the P0 command center and field guide.

Current intake date folder: \`${today}\`

## How To Use

1. Pick a row from \`data_processed/p0_validation_command_center.csv\`.
2. Copy the matching template from \`output/validation/templates/\`.
3. Save screenshots and notes under \`output/validation/${today}/<lane>/\`.
4. Fill the linked capture sheet or source CSV.
5. Rebuild: \`npm run build:p0-command-center && npm run build:hypothesis-decision && npm run build:evidence-manifest && npm run build:evidence-audit && npm run build:completion-audit && npm run build:report-draft && npm run build:polished-pdf && npm test\`.
6. Commit and push.

## Non-Negotiable Rule

Unlinked evidence cannot upgrade claims. Every screenshot, note, quote, and verdict must include a command_id.
`);

writeCsv(OUT, rows, [
  'lane', 'workspace_dir', 'readme_path', 'command_rows', 'p0_blockers', 'p0_rows',
  'template_file', 'evidence_description', 'first_command_ids'
]);

const lines = [];
lines.push('# Validation Evidence Workspace V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This workspace creates a durable intake area for real validation evidence: screenshots, participant notes, paid-flow signoff notes, and scorecard calculations. It exists so P0 validation can be executed without losing provenance.');
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- Workspace root: \`${ROOT}\``);
lines.push(`- Intake date folder: \`${ROOT}/${today}\``);
lines.push(`- Lanes: ${rows.length}`);
lines.push(`- Command rows covered: ${commands.length}`);
lines.push(`- Field guide sections referenced: ${fieldGuide.length}`);
lines.push('');
lines.push('Rows by lane command count:');
lines.push('');
lines.push(bulletCounts(Object.fromEntries(rows.map(row => [row.lane, Number(row.command_rows)]))));
lines.push('');
lines.push('## Workspace Index');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'lane', label: 'Lane' },
  { key: 'workspace_dir', label: 'Workspace Dir' },
  { key: 'command_rows', label: 'Commands', align: 'right' },
  { key: 'p0_blockers', label: 'Blockers', align: 'right' },
  { key: 'template_file', label: 'Template' }
]));
lines.push('');
lines.push('## Evidence Rule');
lines.push('');
lines.push('- Raw screenshots stay in `output/validation/...`.');
lines.push('- Interpretations and verdicts go into the relevant CSV fields.');
lines.push('- Every validation note must include command_id and output_file_to_update.');
lines.push('- The workspace is not evidence until files are filled with observed screenshots, notes, quotes, or calculations.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${ROOT}/README.md\``);
lines.push(`- \`${TEMPLATE_DIR}/generic-validation-note-template.md\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`workspace=${ROOT}`);
console.log(`index=${OUT}`);
console.log(`doc=${OUT_DOC}`);
console.log(`lanes=${rows.length}`);
console.log(`commands=${commands.length}`);
