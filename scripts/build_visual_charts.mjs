import fs from 'fs';

const OUT_DIR = 'output/charts';
const OUT_DOC = 'docs/visuals/chart-index-v1.md';

for (const dir of [OUT_DIR, 'docs/visuals']) fs.mkdirSync(dir, { recursive: true });

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const n = text[i + 1];
    if (quoted) {
      if (c === '"' && n === '"') {
        cell += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
      } else {
        cell += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ',') {
      row.push(cell);
      cell = '';
    } else if (c === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else if (c !== '\r') {
      cell += c;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const header = rows.shift();
  return rows.filter(r => r.length === header.length).map(r => Object.fromEntries(header.map((h, i) => [h, r[i] || ''])));
}

function csv(file) {
  return parseCsv(fs.readFileSync(file, 'utf8'));
}

function countBy(rows, key) {
  const out = {};
  for (const row of rows) out[row[key] || 'unknown'] = (out[row[key] || 'unknown'] || 0) + 1;
  return out;
}

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmt(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value ?? '');
  if (Math.abs(n) >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return n.toLocaleString('en-US');
  return String(n);
}

function horizontalBarChart({ title, subtitle, rows, file, valueLabel = fmt }) {
  const width = 1120;
  const rowH = 58;
  const top = 112;
  const left = 310;
  const right = 80;
  const height = top + rows.length * rowH + 56;
  const max = Math.max(...rows.map(r => Number(r.value) || 0), 1);
  const colors = ['#2563eb', '#059669', '#d97706', '#7c3aed', '#dc2626', '#0891b2', '#4f46e5', '#16a34a'];
  const parts = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`);
  parts.push('<rect width="100%" height="100%" fill="#ffffff"/>');
  parts.push(`<text x="48" y="48" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="700" fill="#111827">${esc(title)}</text>`);
  parts.push(`<text x="48" y="78" font-family="Inter, Arial, sans-serif" font-size="15" fill="#4b5563">${esc(subtitle)}</text>`);
  rows.forEach((row, i) => {
    const y = top + i * rowH;
    const value = Number(row.value) || 0;
    const barW = Math.max(2, ((width - left - right) * value) / max);
    parts.push(`<text x="48" y="${y + 24}" font-family="Inter, Arial, sans-serif" font-size="17" fill="#111827">${esc(row.label)}</text>`);
    parts.push(`<rect x="${left}" y="${y}" width="${width - left - right}" height="28" rx="5" fill="#eef2f7"/>`);
    parts.push(`<rect x="${left}" y="${y}" width="${barW}" height="28" rx="5" fill="${colors[i % colors.length]}"/>`);
    parts.push(`<text x="${left + barW + 10}" y="${y + 20}" font-family="Inter, Arial, sans-serif" font-size="14" font-weight="700" fill="#111827">${esc(valueLabel(value))}</text>`);
  });
  parts.push('</svg>');
  fs.writeFileSync(`${OUT_DIR}/${file}`, `${parts.join('\n')}\n`);
}

const whitespace = csv('data_processed/whitespace_signal_matrix.csv');
const reviewClusters = csv('data_processed/review_jtbd_cluster_summary.csv');
const tam = csv('data_processed/tam_sam_som_model.csv');
const som = csv('data_processed/som_sensitivity_scenarios.csv');
const forum = csv('data_raw/forum_evidence_signals.csv');
const forumQuoteCoding = fs.existsSync('data_processed/forum_quote_coding_matrix.csv')
  ? csv('data_processed/forum_quote_coding_matrix.csv')
  : [];
const top100Review = fs.existsSync('data_processed/top100_competitor_review_scorecard.csv')
  ? csv('data_processed/top100_competitor_review_scorecard.csv')
  : [];
const iapRows = fs.existsSync('data_raw/app_store_iap_pricing_raw.csv')
  ? csv('data_raw/app_store_iap_pricing_raw.csv')
  : [];
const googlePlayPricing = fs.existsSync('data_raw/google_play_pricing_raw.csv')
  ? csv('data_raw/google_play_pricing_raw.csv')
  : [];
const webPaywallSignals = fs.existsSync('data_processed/web_paywall_signal_matrix.csv')
  ? csv('data_processed/web_paywall_signal_matrix.csv')
  : [];
const icpSegments = fs.existsSync('data_processed/icp_segment_matrix.csv')
  ? csv('data_processed/icp_segment_matrix.csv')
  : [];

horizontalBarChart({
  title: 'Whitespace Bands Across Expanded Competitor Universe',
  subtitle: 'High whitespace is narrow; most rows are crowded adjacent substitutes.',
  rows: Object.entries(countBy(whitespace, 'whitespace_band'))
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value })),
  file: 'whitespace-bands.svg'
});

horizontalBarChart({
  title: 'Top Review JTBD and Pain Clusters',
  subtitle: 'Keyword-clustered public App Store reviews from top intersection candidates.',
  rows: reviewClusters.slice(0, 8).map(row => ({ label: row.cluster_label, value: row.review_rows })),
  file: 'review-jtbd-clusters.svg'
});

horizontalBarChart({
  title: 'Modeled SAM Base by Market Pillar',
  subtitle: 'Intersection SAM is modeled separately to avoid adding five adjacent TAMs together.',
  rows: tam.map(row => ({ label: row.pillar, value: row.samBase })),
  file: 'sam-base-by-pillar.svg'
});

horizontalBarChart({
  title: 'SOM Sensitivity Scenarios',
  subtitle: 'Annual revenue scenarios based on reach, activation, paid conversion, and ARPPU.',
  rows: som.map(row => ({ label: row.scenario, value: row.annualRevenue })),
  file: 'som-scenarios.svg'
});

horizontalBarChart({
  title: 'Forum Source Map by Market',
  subtitle: 'Qualitative source rows discovered outside App Store reviews.',
  rows: Object.entries(countBy(forum, 'market'))
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value })),
  file: 'forum-signals-by-market.svg'
});

if (top100Review.length) {
  horizontalBarChart({
    title: 'Top-100 Competitor Verdicts',
    subtitle: 'AI-assisted scorecard verdicts; still requires human validation.',
    rows: Object.entries(countBy(top100Review, 'competitive_verdict'))
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value })),
    file: 'top100-competitor-verdicts.svg'
  });

  horizontalBarChart({
    title: 'Highest Competitive Threat Scores',
    subtitle: 'Unique primary app entries scored from core fit, retention, review evidence, and threat level.',
    rows: top100Review
      .filter(row => row.duplicate_flag === 'primary_app_entry')
      .sort((a, b) => Number(b.competitive_threat_score) - Number(a.competitive_threat_score))
      .slice(0, 12)
      .map(row => ({ label: row.app_name, value: row.competitive_threat_score })),
    file: 'top100-threat-scores.svg',
    valueLabel: value => String(value)
  });
}

if (iapRows.length) {
  horizontalBarChart({
    title: 'Observed App Store IAP Price Bands',
    subtitle: 'Publicly visible in-app purchase prices from top intersection candidates.',
    rows: Object.entries(countBy(iapRows, 'price_band'))
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value })),
    file: 'iap-price-bands.svg'
  });
}

if (forumQuoteCoding.length) {
  const forumTagCounts = {};
  for (const row of forumQuoteCoding) {
    for (const tag of String(row.coding_tags || '').split('|').filter(Boolean)) {
      forumTagCounts[tag] = (forumTagCounts[tag] || 0) + 1;
    }
  }
  horizontalBarChart({
    title: 'Forum Quote Coding Tags',
    subtitle: 'Retrieval-assisted qualitative coding from public forum/source snippets.',
    rows: Object.entries(forumTagCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value })),
    file: 'forum-quote-coding-tags.svg'
  });
}

if (googlePlayPricing.length) {
  const okRows = googlePlayPricing.filter(row => row.collection_status === 'ok');
  horizontalBarChart({
    title: 'Google Play Pricing Models',
    subtitle: 'Android metadata from top market-pillar package rows.',
    rows: Object.entries(countBy(okRows, 'pricing_model'))
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value })),
    file: 'google-play-pricing-models.svg'
  });

  horizontalBarChart({
    title: 'Google Play IAP Apps by Market',
    subtitle: 'Count of successful Android lookups with offersIAP=true.',
    rows: Object.entries(
      okRows.filter(row => row.offers_iap === 'yes').reduce((acc, row) => {
        acc[row.niche] = (acc[row.niche] || 0) + 1;
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value })),
    file: 'google-play-iap-by-market.svg'
  });
}

if (webPaywallSignals.length) {
  horizontalBarChart({
    title: 'Developer Website Paywall Signal Strength',
    subtitle: 'Fetched public developer sites from Google Play metadata; screenshot validation still pending.',
    rows: Object.entries(countBy(webPaywallSignals, 'strongest_signal'))
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value })),
    file: 'web-paywall-signal-strength.svg'
  });

  horizontalBarChart({
    title: 'Web Paywall Screenshot Queue by Market',
    subtitle: 'Domains with medium/high public pricing or paywall language.',
    rows: Object.entries(
      webPaywallSignals.filter(row => row.needs_screenshot_validation === 'yes').reduce((acc, row) => {
        acc[row.niche] = (acc[row.niche] || 0) + 1;
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value })),
    file: 'web-paywall-screenshot-queue-by-market.svg'
  });
}

if (icpSegments.length) {
  horizontalBarChart({
    title: 'ICP Segment Evidence Scores',
    subtitle: 'Directional segment hypotheses from audience, review, forum, and monetization evidence.',
    rows: icpSegments
      .slice()
      .sort((a, b) => Number(b.evidence_score) - Number(a.evidence_score))
      .map(row => ({ label: row.segment_name, value: row.evidence_score })),
    file: 'icp-segment-evidence-scores.svg',
    valueLabel: value => String(value)
  });
}

const lines = [];
lines.push('# Chart Index V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Charts');
lines.push('');
lines.push('- `output/charts/whitespace-bands.svg`');
lines.push('- `output/charts/review-jtbd-clusters.svg`');
lines.push('- `output/charts/sam-base-by-pillar.svg`');
lines.push('- `output/charts/som-scenarios.svg`');
lines.push('- `output/charts/forum-signals-by-market.svg`');
if (top100Review.length) {
  lines.push('- `output/charts/top100-competitor-verdicts.svg`');
  lines.push('- `output/charts/top100-threat-scores.svg`');
}
if (iapRows.length) lines.push('- `output/charts/iap-price-bands.svg`');
if (forumQuoteCoding.length) lines.push('- `output/charts/forum-quote-coding-tags.svg`');
if (googlePlayPricing.length) {
  lines.push('- `output/charts/google-play-pricing-models.svg`');
  lines.push('- `output/charts/google-play-iap-by-market.svg`');
}
if (webPaywallSignals.length) {
  lines.push('- `output/charts/web-paywall-signal-strength.svg`');
  lines.push('- `output/charts/web-paywall-screenshot-queue-by-market.svg`');
}
if (icpSegments.length) lines.push('- `output/charts/icp-segment-evidence-scores.svg`');
lines.push('');
lines.push('## Notes');
lines.push('');
lines.push('- Charts are generated from normalized CSV files already committed in the repository.');
lines.push('- These are draft research visuals for fast inspection and later PDF/layout design.');
fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`charts=${OUT_DIR}`);
console.log(`doc=${OUT_DOC}`);
