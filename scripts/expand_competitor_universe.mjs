import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import gplay from 'google-play-scraper';

const OUT_DIR = 'data_raw/expanded';
const PROCESSED_DIR = 'data_processed';
const MAX_PER_KEYWORD = Number(process.env.MAX_PER_KEYWORD || 160);
const KEYWORD_LIMIT = Number(process.env.KEYWORD_LIMIT || 0);

const NICHES = {
  gaming: [
    'mobile games', 'casual games', 'cozy games', 'idle games', 'life simulation game',
    'habit game', 'wellness game', 'mindfulness game', 'daily quest app', 'gamified self improvement',
    'gamified wellness', 'meditation RPG', 'habit RPG', 'avatar progression game', 'streak app game',
    'life sim mobile', 'cozy RPG', 'self care game', 'mental health game', 'routine game'
  ],
  astrology_esoterics: [
    'astrology', 'horoscope', 'tarot', 'birth chart', 'zodiac', 'numerology', 'moon phase',
    'manifestation', 'spiritual guidance', 'human design', 'AI astrologer', 'astrology coach',
    'daily spiritual guidance', 'tarot AI chat', 'birth chart compatibility', 'spiritual companion app',
    'manifestation coach', 'oracle cards app', 'palm reading app', 'vedic astrology app'
  ],
  avatar_identity: [
    'avatar maker', 'AI avatar', 'digital identity', 'character creator', 'profile picture generator',
    'virtual persona', 'vtuber', 'AI companion avatar', 'best self avatar', 'avatar habit tracker',
    'identity transformation app', 'AI self portrait', 'personal growth avatar', 'avatar coaching',
    '3d avatar maker', 'photo avatar app', 'video avatar app', 'virtual influencer app',
    'digital human app', 'anime avatar generator'
  ],
  coaching: [
    'life coaching', 'AI coach', 'habit coach', 'accountability app', 'goal tracker',
    'personal development', 'confidence coach', 'mindset coach', 'spiritual coach',
    'AI life companion', 'daily coaching action', 'micro coaching app', 'self improvement AI',
    'values coach', 'career coaching app', 'productivity coach', 'wellbeing coach',
    'mental fitness app', 'goal setting app', 'behavior change app'
  ],
  mindfulness: [
    'meditation', 'mindfulness', 'breathwork', 'sleep meditation', 'stress relief',
    'anxiety relief', 'guided meditation', 'journaling', 'gratitude', 'mindful habit tracker',
    'gamified meditation', 'meditation streaks', 'mindfulness companion', 'emotional reset app',
    'daily calm challenge', 'self care app', 'mood tracker', 'breathing exercises',
    'mental wellness app', 'focus meditation'
  ]
};

function ensureDirs() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(PROCESSED_DIR, { recursive: true });
}

function now() {
  return new Date().toISOString();
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

function clean(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\s+/g, ' ').trim();
}

function csvEscape(value) {
  return `"${clean(value).replace(/"/g, '""')}"`;
}

function toCsv(rows) {
  const headers = [
    'app_name', 'publisher', 'platform', 'source_kind', 'source_url', 'niche', 'keyword',
    'rank_position', 'category', 'rating', 'review_count', 'pricing_type', 'iap_present',
    'subscription_present', 'core_features', 'retention_mechanics', 'personalization_tags',
    'audience_tags', 'monetization_notes', 'collected_at', 'evidence_quality'
  ];
  return [headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n');
}

function row(base) {
  return {
    app_name: '',
    publisher: '',
    platform: '',
    source_kind: '',
    source_url: '',
    niche: '',
    keyword: '',
    rank_position: '',
    category: '',
    rating: '',
    review_count: '',
    pricing_type: '',
    iap_present: '',
    subscription_present: '',
    core_features: '',
    retention_mechanics: '',
    personalization_tags: '',
    audience_tags: '',
    monetization_notes: '',
    collected_at: now(),
    evidence_quality: 'medium',
    ...base
  };
}

async function collectAppStore(niche, keyword) {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(keyword)}&entity=software&limit=200`;
  try {
    const res = await fetchWithTimeout(url);
    const data = await res.json();
    return (data.results || []).slice(0, MAX_PER_KEYWORD).map((app, i) => row({
      app_name: app.trackName,
      publisher: app.artistName,
      platform: 'ios',
      source_kind: 'app_store_search',
      source_url: app.trackViewUrl,
      niche,
      keyword,
      rank_position: i + 1,
      category: app.primaryGenreName,
      rating: app.averageUserRating,
      review_count: app.userRatingCount,
      pricing_type: app.price === 0 ? 'free' : 'paid',
      core_features: app.description,
      evidence_quality: 'high'
    }));
  } catch (error) {
    return [];
  }
}

async function collectGooglePlay(niche, keyword) {
  try {
    const results = await gplay.search({ term: keyword, num: Math.min(MAX_PER_KEYWORD, 250), fullDetail: false });
    const mapped = results.map((app, i) => row({
      app_name: app.title,
      publisher: app.developer,
      platform: 'android',
      source_kind: 'google_play_search',
      source_url: app.url,
      niche,
      keyword,
      rank_position: i + 1,
      category: app.genre,
      rating: app.score,
      review_count: app.reviews,
      pricing_type: app.free ? 'free' : 'paid',
      iap_present: app.offersIAP,
      core_features: app.summary,
      evidence_quality: 'high'
    }));
    if (mapped.length > 0) return mapped;
  } catch (error) {
    // Fallback below handles environments where Google Play blocks library scraping.
  }

  try {
    const url = `https://play.google.com/store/search?c=apps&q=${encodeURIComponent(keyword)}`;
    const res = await fetchWithTimeout(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const ids = new Set();
    const idRegex = /\/store\/apps\/details\?id=([A-Za-z0-9._]+)/g;
    let match;
    while ((match = idRegex.exec(html)) !== null) {
      ids.add(match[1]);
    }
    return Array.from(ids).slice(0, Math.min(MAX_PER_KEYWORD, 120)).map((appId, i) => row({
      app_name: appId,
      platform: 'android',
      source_kind: 'google_play_search_fallback',
      source_url: `https://play.google.com/store/apps/details?id=${appId}`,
      niche,
      keyword,
      rank_position: i + 1,
      evidence_quality: 'medium'
    }));
  } catch (error) {
    return [];
  }
}

async function collectDuckDuckGo(niche, keyword) {
  const queries = [
    `${keyword} app`,
    `${keyword} web app`,
    `${keyword} software`,
    `${keyword} platform`
  ];
  const rows = [];
  for (const q of queries) {
    try {
      const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(q)}`;
      const res = await fetchWithTimeout(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const html = await res.text();
      const $ = cheerio.load(html);
      $('.result__body').slice(0, Math.min(35, MAX_PER_KEYWORD)).each((i, el) => {
        const title = clean($(el).find('.result__title').text());
        const link = $(el).find('.result__a').attr('href') || '';
        const snippet = clean($(el).find('.result__snippet').text());
        if (!title || !link) return;
        rows.push(row({
          app_name: title,
          platform: 'web',
          source_kind: 'duckduckgo_search',
          source_url: link,
          niche,
          keyword,
          rank_position: i + 1,
          core_features: snippet,
          evidence_quality: 'low'
        }));
      });
    } catch (error) {
      // Continue with the next query.
    }
  }
  return rows;
}

async function collectSteam(niche, keyword) {
  const url = `https://store.steampowered.com/search/?term=${encodeURIComponent(keyword)}`;
  try {
    const res = await fetchWithTimeout(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const $ = cheerio.load(html);
    const rows = [];
    $('#search_resultsRows a').slice(0, Math.min(80, MAX_PER_KEYWORD)).each((i, el) => {
      const link = $(el).attr('href') || '';
      const title = clean($(el).find('.title').text());
      const price = clean($(el).find('.discount_final_price').first().text());
      if (!title || !link) return;
      rows.push(row({
        app_name: title,
        platform: 'pc',
        source_kind: 'steam_search',
        source_url: link,
        niche,
        keyword,
        rank_position: i + 1,
        pricing_type: price || '',
        monetization_notes: price ? `Steam listed price: ${price}` : '',
        evidence_quality: 'medium'
      }));
    });
    return rows;
  } catch (error) {
    return [];
  }
}

function dedupe(rows) {
  const seen = new Set();
  const out = [];
  for (const r of rows) {
    const key = [
      clean(r.app_name).toLowerCase(),
      clean(r.publisher).toLowerCase(),
      clean(r.platform).toLowerCase(),
      clean(r.source_url).toLowerCase(),
      clean(r.niche).toLowerCase()
    ].join('|');
    if (!key.replace(/\|/g, '')) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}

async function run() {
  ensureDirs();
  const all = [];
  const summary = [];

  for (const [niche, fullKeywords] of Object.entries(NICHES)) {
    const keywords = KEYWORD_LIMIT > 0 ? fullKeywords.slice(0, KEYWORD_LIMIT) : fullKeywords;
    const nicheRows = [];
    for (const keyword of keywords) {
      console.log(`[${niche}] ${keyword}`);
      const [ios, android, web, steam] = await Promise.all([
        collectAppStore(niche, keyword),
        collectGooglePlay(niche, keyword),
        collectDuckDuckGo(niche, keyword),
        collectSteam(niche, keyword)
      ]);
      nicheRows.push(...ios, ...android, ...web, ...steam);
      summary.push({
        app_name: `${niche}:${keyword}`,
        publisher: '',
        platform: 'summary',
        source_kind: 'collection_summary',
        source_url: '',
        niche,
        keyword,
        rank_position: '',
        category: '',
        rating: '',
        review_count: '',
        pricing_type: '',
        iap_present: '',
        subscription_present: '',
        core_features: `ios=${ios.length}; android=${android.length}; web=${web.length}; steam=${steam.length}`,
        retention_mechanics: '',
        personalization_tags: '',
        audience_tags: '',
        monetization_notes: '',
        collected_at: now(),
        evidence_quality: 'high'
      });
    }
    const nicheDeduped = dedupe(nicheRows);
    fs.writeFileSync(path.join(OUT_DIR, `${niche}_expanded_raw.csv`), toCsv(nicheRows));
    fs.writeFileSync(path.join(OUT_DIR, `${niche}_expanded_dedup.csv`), toCsv(nicheDeduped));
    all.push(...nicheRows);
  }

  const allDeduped = dedupe(all);
  fs.writeFileSync(path.join(OUT_DIR, 'all_expanded_raw.csv'), toCsv(all));
  fs.writeFileSync(path.join(OUT_DIR, 'all_expanded_dedup.csv'), toCsv(allDeduped));
  fs.writeFileSync(path.join(PROCESSED_DIR, 'expanded_collection_summary.csv'), toCsv(summary));

  console.log(`raw_rows=${all.length}`);
  console.log(`dedup_rows=${allDeduped.length}`);
  console.log(`output_dir=${OUT_DIR}`);
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});
