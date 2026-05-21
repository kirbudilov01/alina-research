import gplay from 'google-play-scraper';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const NICHES = {
  gaming: [
    'mobile games', 'action games', 'rpg mobile', 'casual games', 'puzzle games',
    'strategy games', 'multiplayer games', 'indie games', 'battle royale mobile',
    'idle games', 'arcade games', 'simulation games', 'sports games mobile',
    'card games mobile', 'gacha games', 'moba mobile', 'survival games mobile'
  ],
  astrology_esoterics: [
    'astrology', 'horoscope', 'tarot reading', 'zodiac', 'birth chart',
    'palm reading', 'fortune teller', 'numerology', 'moon phase app',
    'spiritual guidance app', 'oracle cards app', 'chakra app',
    'manifestation app', 'dream interpretation app', 'synastry app',
    'vedic astrology app', 'daily horoscope app'
  ],
  avatar_identity: [
    'avatar maker', 'character creator', 'vtuber app', 'digital identity',
    '3d avatar', 'personal emoji', 'metaverse avatar', 'ai avatar generator',
    'face animation app', 'photo avatar app', 'video avatar app', 'animoji app',
    'virtual influencer app', 'profile picture ai app', 'virtual persona app'
  ],
  coaching: [
    'life coaching', 'business coaching', 'career coaching', 'health coaching',
    'productivity coach', 'executive coaching', 'skills coaching', 'habit coach app',
    'goal tracker coach', 'self improvement app', 'accountability app',
    'confidence coach app', 'mindset coach app', 'performance coach app',
    'personal development app', 'ai coaching app'
  ],
  mindfulness: [
    'meditation', 'mindfulness', 'sleep sounds', 'anxiety relief', 'breathwork',
    'wellness tracker', 'mental health', 'guided meditation', 'stress relief app',
    'focus timer app', 'sleep meditation app', 'calm app', 'mindful breathing app',
    'relaxation app', 'journaling mindfulness app', 'gratitude app'
  ]
};

const MAX_PER_NICHE = 1000;

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function getGooglePlay(keyword) {
  try {
    const results = await gplay.search({ term: keyword, num: 120 });
    const mapped = results.map(app => ({
      app_name: app.title,
      publisher: app.developer,
      platform: 'android',
      rank_position: null,
      category: app.genre,
      rating: app.score,
      review_count: app.reviews,
      pricing_type: app.free ? 'free' : 'paid',
      iap_present: app.offersIAP,
      subscription_present: null,
      core_features: app.summary,
      retention_mechanics: '',
      personalization_tags: '',
      source_url: app.url,
      collected_at: new Date().toISOString(),
      source_kind: 'google_play'
    }));
    if (mapped.length > 0) {
      return mapped;
    }
  } catch (e) {
    // Fallback below handles environments where library scraping fails.
  }

  try {
    const url = `https://play.google.com/store/search?c=apps&q=${encodeURIComponent(keyword)}`;
    const res = await fetchWithTimeout(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, 9000);
    const html = await res.text();
    const $ = cheerio.load(html);
    const ids = new Set();

    $('a[href*="/store/apps/details?id="]').each((_, el) => {
      const href = $(el).attr('href') || '';
      const m = href.match(/id=([^&"]+)/);
      if (m && m[1]) {
        ids.add(m[1]);
      }
    });

    const fallbackRows = [];
    for (const appId of Array.from(ids).slice(0, 80)) {
      const appUrl = `https://play.google.com/store/apps/details?id=${appId}`;
      fallbackRows.push({
        app_name: appId,
        publisher: '',
        platform: 'android',
        rank_position: null,
        category: '',
        rating: null,
        review_count: null,
        pricing_type: '',
        iap_present: null,
        subscription_present: null,
        core_features: '',
        retention_mechanics: '',
        personalization_tags: '',
        source_url: appUrl,
        collected_at: new Date().toISOString(),
        source_kind: 'google_play'
      });
    }

    return fallbackRows;
  } catch (e) {
    return [];
  }
}

async function getAppStore(keyword) {
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(keyword)}&entity=software&limit=200`;
    const res = await fetchWithTimeout(url, {}, 9000);
    const data = await res.json();
    return data.results.map(app => ({
      app_name: app.trackName,
      publisher: app.artistName,
      platform: 'ios',
      rank_position: null,
      category: app.primaryGenreName,
      rating: app.averageUserRating,
      review_count: app.userRatingCount,
      pricing_type: app.price === 0 ? 'free' : 'paid',
      iap_present: null,
      subscription_present: null,
      core_features: app.description ? app.description.substring(0, 200) : '',
      retention_mechanics: '',
      personalization_tags: '',
      source_url: app.trackViewUrl,
      collected_at: new Date().toISOString(),
      source_kind: 'app_store'
    }));
  } catch (e) { return []; }
}

async function getWebSearch(keyword) {
  try {
    const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(keyword + ' app')}`;
    const res = await fetchWithTimeout(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, 9000);
    const html = await res.text();
    const $ = cheerio.load(html);
    const results = [];
    $('.result__body').slice(0, 40).each((i, el) => {
      const title = $(el).find('.result__title').text().trim();
      const link = $(el).find('.result__a').attr('href');
      const snippet = $(el).find('.result__snippet').text().trim();
      results.push({
        app_name: title,
        publisher: '',
        platform: 'web',
        rank_position: i + 1,
        category: '',
        rating: null,
        review_count: null,
        pricing_type: '',
        iap_present: null,
        subscription_present: null,
        core_features: snippet,
        retention_mechanics: '',
        personalization_tags: '',
        source_url: link,
        collected_at: new Date().toISOString(),
        source_kind: 'web_search'
      });
    });
    return results;
  } catch (e) { return []; }
}

function toCsv(rows) {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const lines = rows.map(row => headers.map(h => {
    let val = row[h];
    if (val === null || val === undefined) val = '';
    val = String(val).replace(/"/g, '""');
    return `"${val}"`;
  }).join(','));
  return [headers.join(','), ...lines].join('\n');
}

async function run() {
  const summary = [];
  const universe = [];
  for (const [niche, keywords] of Object.entries(NICHES)) {
    console.log(`Processing niche: ${niche}`);
    let allRecords = [];
    for (const kw of keywords) {
      console.log(`  Keyword: ${kw}`);
      const [gp, as, ws] = await Promise.all([getGooglePlay(kw), getAppStore(kw), getWebSearch(kw)]);
      allRecords.push(...gp, ...as, ...ws);
    }
    
    // Deduplicate
    const seen = new Set();
    const uniqueRecords = [];
    for (const r of allRecords) {
      const key = `${r.app_name?.toLowerCase()}|${r.platform}|${r.source_kind}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueRecords.push(r);
      }
    }
    
    const limited = uniqueRecords.slice(0, MAX_PER_NICHE);
    const filePath = `data_raw/top1000_${niche}_multi_source.csv`;
    fs.writeFileSync(filePath, toCsv(limited));
    universe.push(...limited.map(r => ({ ...r, niche })));
    
    // Summary
    const counts = limited.reduce((acc, r) => {
      acc[r.source_kind] = (acc[r.source_kind] || 0) + 1;
      return acc;
    }, {});
    
    summary.push({ niche, ...counts, total: limited.length });
  }
  
  fs.writeFileSync('data_processed/top300_collection_summary.csv', toCsv(summary));
  const seenUniverse = new Set();
  const dedupUniverse = [];
  for (const r of universe) {
    const key = `${(r.app_name || '').toLowerCase()}|${r.platform}|${r.niche}`;
    if (!seenUniverse.has(key)) {
      seenUniverse.add(key);
      dedupUniverse.push(r);
    }
  }
  fs.writeFileSync('data_processed/competitor_universe_raw.csv', toCsv(universe));
  fs.writeFileSync('data_processed/competitor_universe_dedup.csv', toCsv(dedupUniverse));
  console.log('Collection complete.');
}

run();
