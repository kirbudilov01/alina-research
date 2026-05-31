import fs from 'fs';

const IN = 'data_processed/chrome_extension_fit_matrix.csv';
const OUT_MATRIX = 'data_processed/chrome_extension_mechanic_battlecards.csv';
const OUT_DOC = 'docs/competitive/chrome-extension-mechanic-battlecards-v1.md';

for (const dir of ['data_processed', 'docs/competitive']) fs.mkdirSync(dir, { recursive: true });

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
  return body
    .filter(r => r.some(Boolean))
    .map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])));
}

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, [headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n'));
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

function tags(row) {
  return clean(row.feature_tags).split('|').filter(Boolean);
}

function coreMechanic(row) {
  const t = tags(row);
  if (t.includes('habit_tracking') && t.includes('progress_feedback') && t.includes('mood_or_reflection')) return 'habit_progress_reflection_loop';
  if (t.includes('habit_tracking') && t.includes('progress_feedback')) return 'habit_progress_loop';
  if (t.includes('accountability') && t.includes('ai_coaching')) return 'ai_accountability_loop';
  if (t.includes('accountability')) return 'accountability_monitoring_loop';
  if (t.includes('ai_coaching') && t.includes('progress_feedback')) return 'ai_feedback_loop';
  if (t.includes('ai_coaching')) return 'narrow_ai_coaching';
  if (t.includes('habit_tracking')) return 'simple_habit_capture';
  return 'boundary_reference';
}

function alinaLesson(row) {
  const mechanic = coreMechanic(row);
  if (mechanic === 'habit_progress_reflection_loop') {
    return 'Use visible progress plus mood/reflection as proof that tiny rituals can feel emotionally richer than checkbox habits.';
  }
  if (mechanic === 'habit_progress_loop') {
    return 'Borrow the lightweight capture/progress affordance, but connect it to identity/avatar feedback rather than a plain stat surface.';
  }
  if (mechanic === 'ai_accountability_loop') {
    return 'AI nudging and accountability can support behavior change, but Alina should avoid surveillance framing and keep consent/softness central.';
  }
  if (mechanic === 'accountability_monitoring_loop') {
    return 'Accountability creates commitment, but the consumer version should be self-compassionate and not feel punitive.';
  }
  if (mechanic === 'ai_feedback_loop') {
    return 'AI feedback is common in narrow contexts; Alina needs personal meaning and ritual continuity to avoid becoming a generic coach.';
  }
  if (mechanic === 'simple_habit_capture') {
    return 'Habit capture is table stakes; the differentiator has to be what completion changes in the user-facing identity object.';
  }
  return 'Keep as boundary evidence showing what is outside the consumer ritual/identity core.';
}

function whitespaceImplication(row) {
  const t = tags(row);
  const hasHabit = t.includes('habit_tracking');
  const hasProgress = t.includes('progress_feedback');
  const hasMood = t.includes('mood_or_reflection');
  const hasAi = t.includes('ai_coaching');
  const hasAccountability = t.includes('accountability');
  if (hasHabit && hasProgress && hasMood) {
    return 'Narrows whitespace: lightweight habit/progress/reflection exists, but no avatar/identity transformation object is visible in extracted evidence.';
  }
  if (hasHabit && hasProgress) {
    return 'Supports whitespace: progress loops exist, but they appear utilitarian rather than identity/avatar-centered.';
  }
  if (hasAi && hasAccountability) {
    return 'Supports positioning risk: AI accountability language exists, so Alina should differentiate through emotional safety and personal meaning.';
  }
  if (hasAi) {
    return 'Boundary evidence: AI coaching is crowded in narrow tasks, so generic AI coach positioning is weak.';
  }
  if (hasAccountability) {
    return 'Boundary evidence: accountability mechanics are viable but can conflict with calm/wellness framing.';
  }
  return 'Low direct impact on whitespace; keep for market-boundary mapping.';
}

function threatBand(row) {
  const fit = clean(row.alina_fit_band);
  const users = Number(row.users || 0);
  const score = Number(row.fit_score || 0);
  if (fit === 'strong_adjacent' && users >= 1000) return 'mechanic_threat_high';
  if (fit === 'strong_adjacent') return 'mechanic_threat_medium';
  if (fit === 'useful_adjacent' && (users >= 10000 || score >= 5)) return 'mechanic_reference_high';
  if (fit === 'useful_adjacent') return 'mechanic_reference_medium';
  return 'boundary_or_low';
}

function validationTask(row) {
  if (clean(row.alina_fit_band) === 'strong_adjacent') {
    return 'Manually inspect screenshots/onboarding for action -> progress causality and any identity/avatar metaphor.';
  }
  if (clean(row.alina_fit_band) === 'useful_adjacent') {
    return 'Capture screenshots of the core loop and note whether progress is emotional, behavioral, or purely numeric.';
  }
  return 'No immediate manual review unless the category becomes strategically important.';
}

const rows = parseCsv(fs.readFileSync(IN, 'utf8'))
  .filter(row => row.detail_status === 'ok')
  .sort((a, b) => Number(b.fit_score || 0) - Number(a.fit_score || 0));

const battlecards = rows.map(row => ({
  app_name: row.app_name,
  source_url: row.source_url,
  fit_band: row.alina_fit_band,
  fit_score: row.fit_score,
  threat_band: threatBand(row),
  core_mechanic: coreMechanic(row),
  users: row.users,
  rating: row.rating,
  feature_tags: row.feature_tags,
  evidence_basis: row.short_description,
  alina_lesson: alinaLesson(row),
  whitespace_implication: whitespaceImplication(row),
  validation_task: validationTask(row)
}));

writeCsv(OUT_MATRIX, battlecards, [
  'app_name', 'source_url', 'fit_band', 'fit_score', 'threat_band', 'core_mechanic',
  'users', 'rating', 'feature_tags', 'evidence_basis', 'alina_lesson',
  'whitespace_implication', 'validation_task'
]);

const highOrStrong = battlecards.filter(row => ['mechanic_threat_high', 'mechanic_threat_medium', 'mechanic_reference_high'].includes(row.threat_band));
const lines = [];
lines.push('# Chrome Extension Mechanic Battlecards V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Scope');
lines.push('');
lines.push('This layer converts enriched Chrome Web Store candidates into mechanic battlecards. It is an interpretation layer over known detail-page evidence, not a new collection pass.');
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- Battlecards: ${battlecards.length}`);
lines.push(`- High/medium mechanic references to inspect: ${highOrStrong.length}`);
lines.push('');
lines.push('Threat/reference bands:');
lines.push('');
lines.push(bulletCounts(countBy(battlecards, 'threat_band')));
lines.push('');
lines.push('Core mechanics:');
lines.push('');
lines.push(bulletCounts(countBy(battlecards, 'core_mechanic')));
lines.push('');
lines.push('## Priority Battlecards');
lines.push('');
for (const row of battlecards.slice(0, 12)) {
  lines.push(`### ${row.app_name}`);
  lines.push('');
  lines.push(`- Fit: ${row.fit_band}; threat/reference band: ${row.threat_band}; score: ${row.fit_score}.`);
  lines.push(`- Evidence basis: ${row.evidence_basis}`);
  lines.push(`- Mechanic: ${row.core_mechanic}; tags: ${row.feature_tags.replace(/\|/g, ', ')}.`);
  lines.push(`- Alina lesson: ${row.alina_lesson}`);
  lines.push(`- Whitespace implication: ${row.whitespace_implication}`);
  lines.push(`- Validation task: ${row.validation_task}`);
  lines.push(`- Source: ${row.source_url}`);
  lines.push('');
}
lines.push('## Product Implications');
lines.push('');
lines.push('- Lightweight browser tools validate that habit capture, progress display, accountability, and AI feedback can live in very small surfaces.');
lines.push('- The strongest adjacent examples still appear to stop at utility loops: habit, stat, reminder, blocker, or narrow AI suggestion.');
lines.push('- This supports a sharper Alina claim: the product should not compete as a generic habit tracker or AI coach; it should make a completed daily action visibly change a personal identity/avatar feedback object.');
lines.push('- The main validation risk is hidden mechanics: screenshots or onboarding may reveal richer identity metaphors than metadata exposes.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_MATRIX}\``);
fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`matrix=${OUT_MATRIX}`);
console.log(`doc=${OUT_DOC}`);
console.log(`battlecards=${battlecards.length}`);
console.log(`priority=${highOrStrong.length}`);
