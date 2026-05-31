import fs from 'fs';

const QUEUE = 'data_processed/reddit_manual_reading_queue.csv';
const PROMPTS = 'data_processed/reddit_manual_reading_prompt_bank.csv';
const OUT = 'data_processed/reddit_manual_reading_capture_sheet.csv';
const OUT_DOC = 'docs/audience/reddit-manual-reading-capture-sheet-v1.md';

for (const dir of ['data_processed', 'docs/audience']) fs.mkdirSync(dir, { recursive: true });

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

function countBy(rows, key) {
  const out = {};
  for (const row of rows) out[row[key] || 'unknown'] = (out[row[key] || 'unknown'] || 0) + 1;
  return out;
}

function mdTable(rows, columns, limit = rows.length) {
  const limited = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

const queue = csv(QUEUE);
const prompts = csv(PROMPTS);
const promptByLane = new Map(prompts.map(row => [row.queue_lane, row]));

const captureRows = queue
  .filter(row => ['P0_read_first', 'P1_read_next'].includes(row.priority_band))
  .map(row => {
    const prompt = promptByLane.get(row.queue_lane) || {};
    return {
      capture_id: `RRC_${String(row.priority_rank).padStart(4, '0')}`,
      reddit_read_id: row.reddit_read_id,
      priority_rank: row.priority_rank,
      priority_band: row.priority_band,
      queue_lane: row.queue_lane,
      niche_mix: row.niche_mix,
      linked_icp_segments: row.linked_icp_segments,
      app_names_prefill: row.app_names,
      thread_title: row.thread_title,
      source_url: row.source_url,
      capture_status: 'not_started',
      manual_read_task: row.manual_read_task,
      interview_prompt_seed: row.interview_prompt_seed || prompt.interview_prompt_seed,
      whitespace_prompt_seed: row.whitespace_prompt_seed || prompt.whitespace_prompt_seed,
      observed_user_job: '',
      named_alternatives_in_comments: '',
      rejected_patterns: '',
      accepted_solution_pattern: '',
      paid_or_wtp_signal: '',
      safety_or_trust_boundary: '',
      alina_implication: '',
      direct_quote_short: '',
      quote_use_permission_status: 'not_approved_external_use',
      claim_status_after_read: 'unread_do_not_upgrade',
      claim_update_target: 'data_processed/evidence_claim_register.csv;data_processed/research_completion_audit.csv;reports/alina-evidence-first-report-draft.md',
      researcher_notes: '',
      claim_boundary: 'Unread capture row. Do not cite externally or upgrade demand/market/competitor claims until a human completes this row.'
    };
  });

writeCsv(OUT, captureRows, [
  'capture_id', 'reddit_read_id', 'priority_rank', 'priority_band', 'queue_lane',
  'niche_mix', 'linked_icp_segments', 'app_names_prefill', 'thread_title',
  'source_url', 'capture_status', 'manual_read_task', 'interview_prompt_seed',
  'whitespace_prompt_seed', 'observed_user_job', 'named_alternatives_in_comments',
  'rejected_patterns', 'accepted_solution_pattern', 'paid_or_wtp_signal',
  'safety_or_trust_boundary', 'alina_implication', 'direct_quote_short',
  'quote_use_permission_status', 'claim_status_after_read', 'claim_update_target',
  'researcher_notes', 'claim_boundary'
]);

const byLane = Object.entries(countBy(captureRows, 'queue_lane'))
  .sort((a, b) => b[1] - a[1])
  .map(([queue_lane, row_count]) => ({
    queue_lane,
    row_count,
    p0_rows: captureRows.filter(row => row.queue_lane === queue_lane && row.priority_band === 'P0_read_first').length,
    p1_rows: captureRows.filter(row => row.queue_lane === queue_lane && row.priority_band === 'P1_read_next').length,
    prompt: promptByLane.get(queue_lane)?.interview_prompt_seed || ''
  }));

const lines = [];
lines.push('# Reddit Manual Reading Capture Sheet V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This sheet turns the Reddit manual reading queue into fillable evidence capture rows. It covers P0 and P1 threads only, preserving lower-priority context reads in the queue but keeping execution focused.');
lines.push('');
lines.push('## Evidence Boundary');
lines.push('');
lines.push('- Default status is `not_started` and `unread_do_not_upgrade`.');
lines.push('- External quotes require manual reading and explicit quote-use approval.');
lines.push('- A completed row can inform ICP language, competitor walkthrough notes, whitespace claim boundaries, and interview scripts; it still cannot prove representative demand by itself.');
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- Capture rows: ${captureRows.length}`);
lines.push(`- P0 rows: ${captureRows.filter(row => row.priority_band === 'P0_read_first').length}`);
lines.push(`- P1 rows: ${captureRows.filter(row => row.priority_band === 'P1_read_next').length}`);
lines.push(`- Queue lanes represented: ${byLane.length}`);
lines.push('');
lines.push('## Rows By Lane');
lines.push('');
lines.push(mdTable(byLane, [
  { key: 'queue_lane', label: 'Lane' },
  { key: 'row_count', label: 'Rows', align: 'right' },
  { key: 'p0_rows', label: 'P0', align: 'right' },
  { key: 'p1_rows', label: 'P1', align: 'right' },
  { key: 'prompt', label: 'Prompt Seed' }
], byLane.length));
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${OUT_DOC}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`reddit_manual_capture_rows=${captureRows.length}`);
console.log(`reddit_manual_capture_p0=${captureRows.filter(row => row.priority_band === 'P0_read_first').length}`);
console.log(`reddit_manual_capture_p1=${captureRows.filter(row => row.priority_band === 'P1_read_next').length}`);
