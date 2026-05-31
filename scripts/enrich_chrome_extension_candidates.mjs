import fs from 'fs';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const IN = 'data_raw/expanded_chrome_extensions_raw.csv';
const OUT_RAW = 'data_raw/chrome_extension_detail_raw.csv';
const OUT_MATRIX = 'data_processed/chrome_extension_fit_matrix.csv';
const OUT_DOC = 'docs/competitive/chrome-extension-detail-enrichment-v1.md';

const LIMIT = Number(process.env.CHROME_EXTENSION_DETAIL_LIMIT || 0);
const TIMEOUT_MS = Number(process.env.CHROME_EXTENSION_DETAIL_TIMEOUT_MS || 12000);

for (const dir of ['data_raw', 'data_processed', 'docs/competitive']) fs.mkdirSync(dir, { recursive: true });

function clean(value) {
  return String(value ?? '')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
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

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: { 'user-agent': 'Mozilla/5.0' }
    });
  } finally {
    clearTimeout(timer);
  }
}

function textNearLabel($, label) {
  const node = $('div.QDHp8e').filter((_, el) => clean($(el).text()).toLowerCase() === label.toLowerCase()).first();
  if (!node.length) return '';
  return clean(node.parent().children('div').not(node).first().text());
}

function meta($, nameOrProperty) {
  return clean($(`meta[name="${nameOrProperty}"]`).attr('content') || $(`meta[property="${nameOrProperty}"]`).attr('content') || '');
}

function extensionId(url) {
  return clean(url).split('/').filter(Boolean).pop() || '';
}

function featureTags(text) {
  const haystack = clean(text).toLowerCase();
  const tags = [];
  const checks = [
    ['ai_coaching', /\bai\b|coach|assistant|prompt|suggestion|hint/],
    ['habit_tracking', /habit|routine|daily|streak|goal/],
    ['accountability', /accountab|partner|monitor|screenshot|block|focus|addictive/],
    ['progress_feedback', /progress|stats|insight|rating|score|weakness|lesson/],
    ['mood_or_reflection', /mood|journal|gratitude|reflection/],
    ['meeting_or_sales_coach', /meeting|sales|deal|video|zoom|teams/],
    ['developer_or_learning_coach', /leetcode|chess|code|interview|study/],
    ['security_or_workflow', /security|alert|workflow|investigation|enterprise/]
  ];
  for (const [tag, rx] of checks) {
    if (rx.test(haystack)) tags.push(tag);
  }
  return tags;
}

function fitBand(tags, sourceText) {
  let score = 0;
  if (tags.includes('habit_tracking')) score += 3;
  if (tags.includes('progress_feedback')) score += 2;
  if (tags.includes('ai_coaching')) score += 2;
  if (tags.includes('accountability')) score += 2;
  if (tags.includes('mood_or_reflection')) score += 2;
  if (tags.includes('meeting_or_sales_coach')) score -= 2;
  if (tags.includes('developer_or_learning_coach')) score -= 2;
  if (tags.includes('security_or_workflow')) score -= 2;
  if (/avatar|identity|persona|character/i.test(sourceText)) score += 2;
  if (/free forever|free and unlimited|free website blocker/i.test(sourceText)) score += 1;
  if (score >= 6) return ['strong_adjacent', score];
  if (score >= 3) return ['useful_adjacent', score];
  if (score >= 1) return ['weak_adjacent', score];
  return ['out_of_scope_or_b2b', score];
}

function parseNumberLike(text) {
  const match = clean(text).match(/([\d,.]+)\s*([KMB])?/i);
  if (!match) return '';
  const base = Number(match[1].replace(/,/g, ''));
  if (!Number.isFinite(base)) return '';
  const mult = { K: 1000, M: 1000000, B: 1000000000 }[String(match[2] || '').toUpperCase()] || 1;
  return String(Math.round(base * mult));
}

async function detailRow(candidate, index) {
  const url = candidate.source_url;
  try {
    const res = await fetchWithTimeout(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    const title = clean(meta($, 'og:title').replace(/\s*-\s*Chrome Web Store$/i, '')) || candidate.app_name;
    const description = meta($, 'description') || meta($, 'og:description') || candidate.core_features;
    const fullText = clean($('body').text()).slice(0, 12000);
    const offeredBy = textNearLabel($, 'Offered by');
    const version = textNearLabel($, 'Version');
    const updated = textNearLabel($, 'Updated');
    const size = textNearLabel($, 'Size');
    const languages = textNearLabel($, 'Languages');
    const rating = clean((html.match(/Average rating ([0-9.]+) out of 5/i) || [])[1] || candidate.rating || '');
    const users = parseNumberLike((fullText.match(/([\d,.]+[KMB]?)\s+users/i) || [])[0] || '');
    const candidateText = `${title} ${description} ${candidate.core_features}`;
    const tags = featureTags(candidateText);
    const [fit, score] = fitBand(tags, candidateText);
    return {
      extension_id: extensionId(url),
      app_name: title,
      source_url: url,
      niche: candidate.niche,
      keyword: candidate.keyword,
      source_rank: candidate.rank_position,
      offered_by: offeredBy,
      version,
      updated,
      size,
      languages,
      rating,
      users,
      short_description: description,
      feature_tags: tags.join('|'),
      alina_fit_band: fit,
      fit_score: score,
      detail_status: res.ok ? 'ok' : `http_${res.status}`,
      collected_at: new Date().toISOString(),
      evidence_quality: res.ok ? 'medium_high' : 'low',
      interpretation_note: tags.includes('habit_tracking') || tags.includes('progress_feedback')
        ? 'Useful for browser-extension habit/progress mechanics comparison.'
        : 'Mostly adjacent or out-of-scope; keep as boundary evidence.'
    };
  } catch (error) {
    return {
      extension_id: extensionId(url),
      app_name: candidate.app_name,
      source_url: url,
      niche: candidate.niche,
      keyword: candidate.keyword,
      source_rank: candidate.rank_position,
      offered_by: '',
      version: '',
      updated: '',
      size: '',
      languages: '',
      rating: candidate.rating,
      users: '',
      short_description: candidate.core_features,
      feature_tags: '',
      alina_fit_band: 'unclassified',
      fit_score: '',
      detail_status: `error:${clean(error.message)}`,
      collected_at: new Date().toISOString(),
      evidence_quality: 'low',
      interpretation_note: 'Detail page fetch failed; keep only smoke-pass evidence.'
    };
  }
}

const candidates = parseCsv(fs.readFileSync(IN, 'utf8'))
  .filter(row => row.collection_status === 'ok' && row.source_url)
  .slice(0, LIMIT > 0 ? LIMIT : undefined);

const rows = [];
for (const [index, candidate] of candidates.entries()) {
  console.log(`[Chrome detail] ${index + 1}/${candidates.length} ${candidate.app_name}`);
  rows.push(await detailRow(candidate, index));
  await new Promise(resolve => setTimeout(resolve, 200));
}

const headers = [
  'extension_id', 'app_name', 'source_url', 'niche', 'keyword', 'source_rank',
  'offered_by', 'version', 'updated', 'size', 'languages', 'rating', 'users',
  'short_description', 'feature_tags', 'alina_fit_band', 'fit_score',
  'detail_status', 'collected_at', 'evidence_quality', 'interpretation_note'
];

writeCsv(OUT_RAW, rows, headers);
writeCsv(OUT_MATRIX, rows, headers);

const okRows = rows.filter(row => row.detail_status === 'ok');
const strong = rows.filter(row => row.alina_fit_band === 'strong_adjacent');
const useful = rows.filter(row => row.alina_fit_band === 'useful_adjacent');
const lines = [];
lines.push('# Chrome Extension Detail Enrichment V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Scope');
lines.push('');
lines.push('This is a detail-page enrichment pass over the already collected P0 Chrome Web Store candidates. It does not perform broad search; it only reads known candidate URLs from the controlled smoke pass.');
lines.push('');
lines.push('## Coverage');
lines.push('');
lines.push(`- Detail candidates attempted: ${rows.length}`);
lines.push(`- Successful detail pages: ${okRows.length}`);
lines.push(`- Strong adjacent candidates: ${strong.length}`);
lines.push(`- Useful adjacent candidates: ${useful.length}`);
lines.push('');
lines.push('Fit bands:');
lines.push('');
lines.push(bulletCounts(countBy(rows, 'alina_fit_band')));
lines.push('');
lines.push('Feature tags:');
lines.push('');
lines.push(bulletCounts(countBy(rows.flatMap(row => row.feature_tags.split('|').filter(Boolean)).map(tag => ({ tag })), 'tag')));
lines.push('');
lines.push('## Highest-Fit Candidates');
lines.push('');
lines.push('| Candidate | Fit | Score | Tags | Why It Matters |');
lines.push('| --- | --- | ---: | --- | --- |');
for (const row of rows
  .slice()
  .sort((a, b) => Number(b.fit_score || 0) - Number(a.fit_score || 0))
  .slice(0, 12)) {
  lines.push(`| ${row.app_name} | ${row.alina_fit_band} | ${row.fit_score} | ${row.feature_tags.replace(/\|/g, '<br>')} | ${row.interpretation_note} |`);
}
lines.push('');
lines.push('## Interpretation');
lines.push('');
lines.push('- Browser extensions are not the core target market, but they are useful evidence for lightweight daily habit/progress loops and accountability mechanics.');
lines.push('- Strong/useful adjacent rows should be used as mechanic references, not as proof of a complete Alina-like direct competitor.');
lines.push('- Out-of-scope/B2B rows are still helpful boundary evidence because they show where AI coaching language is used for narrow work tasks.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT_RAW}\``);
lines.push(`- \`${OUT_MATRIX}\``);
fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`raw=${OUT_RAW}`);
console.log(`matrix=${OUT_MATRIX}`);
console.log(`doc=${OUT_DOC}`);
console.log(`rows=${rows.length}`);
console.log(`detail_ok=${okRows.length}`);
console.log(`strong_adjacent=${strong.length}`);
