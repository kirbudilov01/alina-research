import fs from 'fs';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const OUT_FILE = 'data_raw/research_source_discovery.csv';
const MAX_RESULTS_PER_QUERY = Number(process.env.MAX_RESULTS_PER_QUERY || 25);

const QUERIES = [
  ['gaming', 'mobile games market size 2026 revenue CAGR report'],
  ['gaming', 'mobile gaming monetization trends 2026 report web stores'],
  ['gaming', 'casual mobile games retention benchmarks 2026 report'],
  ['astrology_esoterics', 'astrology app market size 2026 CAGR report'],
  ['astrology_esoterics', 'AI astrology app market 2026 trends report'],
  ['astrology_esoterics', 'spiritual wellness app market 2026 report'],
  ['avatar_identity', 'AI avatar app market size 2026 report'],
  ['avatar_identity', 'digital avatar market 2026 CAGR consumer apps'],
  ['avatar_identity', 'AI companion avatar app market 2026 report'],
  ['coaching', 'AI coaching market size 2026 report'],
  ['coaching', 'life coaching app market 2026 report'],
  ['coaching', 'digital coaching platforms market 2026 report'],
  ['mindfulness', 'meditation mindfulness apps market size 2026 CAGR report'],
  ['mindfulness', 'mental wellness apps market 2026 report'],
  ['mindfulness', 'breathwork app market 2026 report'],
  ['intersection', 'AI spiritual coach app market 2026'],
  ['intersection', 'gamified mindfulness app market'],
  ['intersection', 'avatar based self improvement app'],
  ['audience', 'reddit astrology app recommendations daily horoscope'],
  ['audience', 'reddit meditation app subscription worth it'],
  ['audience', 'reddit AI coach app self improvement'],
  ['audience', 'reddit AI avatar app recommendations'],
  ['audience', 'forum manifestation app daily routine']
];

const SEED_SOURCES = [
  ['gaming', 'BCG Video Gaming Report 2026', 'https://web-assets.bcg.com/b3/fa/fd7443244a48a24fae8299ce0f34/video-gaming-report-2026-nov-2025-edit-02.pdf', 'Analyst PDF with mobile game monetization, payment-channel, and platform trend evidence.', 'market_report_candidate'],
  ['gaming', 'Statista Mobile Games Worldwide', 'https://www.statista.com/outlook/dmo/digital-media/video-games/mobile-games/worldwide', 'Market forecast page for worldwide mobile games revenue and users.', 'market_report_candidate'],
  ['mindfulness', 'Stratistics MRC Meditation And Mindfulness Apps Market', 'https://www.strategymrc.com/report/meditation-and-mindfulness-apps-market', 'Public market report page with 2026 size, 2034 forecast, CAGR, drivers, and key players.', 'market_report_candidate'],
  ['avatar_identity', 'Global Market Insights AI Avatars Market', 'https://www.gminsights.com/industry-analysis/ai-avatars-market', 'Public market report page with AI avatars market size, forecast, CAGR, drivers, and segmentation.', 'market_report_candidate'],
  ['coaching', 'ICF Coaching Futures Report 2026', 'https://icfcoachingfuturesreport.com/wp-content/uploads/sites/2/2026/01/icf-coaching-futures-report-2026.pdf', 'Industry PDF on coaching futures, AI, virtual coaching, ethics, and accessibility.', 'market_report_candidate'],
  ['astrology_esoterics', 'Research and Markets Astrology App Market Report 2026', 'https://www.researchandmarkets.com/reports/6090017/astrology-app-market-report', 'Public market report page for astrology app market statistics, segments, trends, and competitors.', 'market_report_candidate'],
  ['astrology_esoterics', 'Global Growth Insights Astrology App Market', 'https://www.globalgrowthinsights.com/market-reports/astrology-app-market-114903', 'Public market report page with astrology app market values and growth claims requiring triangulation.', 'market_report_candidate'],
  ['avatar_identity', 'WiseGuyReports AI Avatar App Market', 'https://www.wiseguyreports.com/reports/ai-avatar-app-market', 'Public report page for AI avatar app market size and CAGR claims requiring verification.', 'market_report_candidate'],
  ['mindfulness', 'HTF Market Insights Mindfulness Apps Market', 'https://www.htfmarketinsights.com/report/4366048-mindfulness-apps-market', 'Public report page for mindfulness app market CAGR and segmentation.', 'market_report_candidate'],
  ['coaching', 'GROW: A Conversational AI Coach', 'https://arxiv.org/abs/2604.04548', 'Research paper on a goal-centered well-being coaching system using AI.', 'product_pattern'],
  ['astrology_esoterics', 'From Astronomy to Astrology: Testing Zodiac-Based Personality Prediction', 'https://arxiv.org/abs/2603.29033', 'Research paper relevant to trust, claims, and scientific risk in astrology positioning.', 'compliance_risk'],
  ['avatar_identity', 'The Rise of AI-Generated Anime Avatars', 'https://arxiv.org/abs/2603.28365', 'Research paper relevant to AI avatar generation trends, challenges, and opportunities.', 'product_pattern']
];

function now() {
  return new Date().toISOString();
}

function clean(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\s+/g, ' ').trim();
}

function csvEscape(value) {
  return `"${clean(value).replace(/"/g, '""')}"`;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function classify(title, snippet, url) {
  const text = `${title} ${snippet} ${url}`.toLowerCase();
  if (text.includes('market size') || text.includes('cagr') || text.includes('forecast')) return 'market_report_candidate';
  if (text.includes('reddit') || text.includes('forum') || text.includes('community')) return 'forum_audience_signal';
  if (text.includes('pricing') || text.includes('subscription')) return 'pricing_candidate';
  if (text.includes('app store') || text.includes('google play')) return 'app_store_candidate';
  return 'general_research_candidate';
}

async function search(query, niche) {
  const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  try {
    const res = await fetchWithTimeout(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const $ = cheerio.load(html);
    const rows = [];
    $('.result__body').slice(0, MAX_RESULTS_PER_QUERY).each((i, el) => {
      const title = clean($(el).find('.result__title').text());
      const link = $(el).find('.result__a').attr('href') || '';
      const snippet = clean($(el).find('.result__snippet').text());
      if (!title || !link) return;
      rows.push({
        niche,
        query,
        rank_position: i + 1,
        source_title: title,
        source_url: link,
        snippet,
        candidate_type: classify(title, snippet, link),
        collected_at: now(),
        extraction_status: 'discovered'
      });
    });
    return rows;
  } catch (error) {
    return [];
  }
}

function toCsv(rows) {
  const headers = [
    'niche', 'query', 'rank_position', 'source_title', 'source_url',
    'snippet', 'candidate_type', 'collected_at', 'extraction_status'
  ];
  return [headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n');
}

function dedupe(rows) {
  const seen = new Set();
  const out = [];
  for (const r of rows) {
    const key = clean(r.source_url).toLowerCase() || `${clean(r.source_title).toLowerCase()}|${r.niche}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}

async function run() {
  const all = [];
  for (const [niche, title, url, snippet, candidateType] of SEED_SOURCES) {
    all.push({
      niche,
      query: 'seed_source',
      rank_position: '',
      source_title: title,
      source_url: url,
      snippet,
      candidate_type: candidateType,
      collected_at: now(),
      extraction_status: 'seeded'
    });
  }
  for (const [niche, query] of QUERIES) {
    console.log(`[${niche}] ${query}`);
    all.push(...await search(query, niche));
  }
  const rows = dedupe(all);
  fs.writeFileSync(OUT_FILE, toCsv(rows));
  console.log(`discovered_rows=${rows.length}`);
  console.log(`output=${OUT_FILE}`);
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});
