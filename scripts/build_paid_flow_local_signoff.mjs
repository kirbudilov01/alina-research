import fs from 'fs';

const CAPTURE = 'data_processed/paid_flow_capture_sheet.csv';
const ADJUDICATION = 'data_processed/web_paywall_visual_adjudication.csv';
const OUT = 'data_processed/paid_flow_local_signoff.csv';
const OUT_DOC = 'docs/market/paid-flow-local-signoff-v1.md';

for (const dir of ['data_processed', 'docs/market']) fs.mkdirSync(dir, { recursive: true });

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
    rows: body.filter(r => r.some(Boolean)).map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])))
  };
}

function readCsv(file) {
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : { headers: [], rows: [] };
}

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, [headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n'));
}

function mdTable(rows, columns) {
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = rows.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function noCleanPriceRows({ prefix, appName, screenshotPath, observedSurface, productMatch, notes, claimLimit }) {
  return [
    {
      capture_id: `${prefix}_PF_S01`,
      app_name: appName,
      screenshot_path: screenshotPath,
      observed_price_or_trial: observedSurface,
      paid_flow_label: 'reviewed_no_clean_public_price',
      product_match_label: productMatch,
      human_notes: `${notes} No clean public price, trial, or plan term is visible in the saved screenshot/OCR.`,
      signoff_strength: 'reviewed_no_clean_public_price',
      claim_limit: claimLimit
    },
    {
      capture_id: `${prefix}_PF_S02`,
      app_name: appName,
      screenshot_path: screenshotPath,
      observed_price_or_trial: 'First meaningful in-app paywall boundary was not inspected in the local screenshot.',
      paid_flow_label: 'reviewed_no_clean_boundary_unknown',
      product_match_label: productMatch,
      human_notes: `${notes} The captured public page does not show onboarding order or the first value/paywall boundary.`,
      signoff_strength: 'reviewed_no_clean_public_price',
      claim_limit: 'Use only as a weak public paid-surface cue; keep first-value/paywall timing open.'
    },
    {
      capture_id: `${prefix}_PF_S03`,
      app_name: appName,
      screenshot_path: screenshotPath,
      observed_price_or_trial: 'Paid-feature depth could not be cleanly reconstructed from the saved public screenshot.',
      paid_flow_label: 'reviewed_no_clean_plan_depth',
      product_match_label: productMatch,
      human_notes: `${notes} The screenshot is useful for product context, but not enough for a plan-depth comparison matrix.`,
      signoff_strength: 'reviewed_no_clean_public_price',
      claim_limit: 'Do not use as plan-depth proof until app/store or in-app paywall evidence is captured.'
    },
    {
      capture_id: `${prefix}_PF_S04`,
      app_name: appName,
      screenshot_path: screenshotPath,
      observed_price_or_trial: 'Human review completed from saved screenshot/OCR; product-match remains conservative because the evidence is public web only.',
      paid_flow_label: 'reviewed_no_clean_product_match_boundary',
      product_match_label: productMatch,
      human_notes: notes,
      signoff_strength: 'reviewed_no_clean_public_price',
      claim_limit: claimLimit
    }
  ];
}

const signoffs = [
  {
    capture_id: 'PF_01_PF_S01',
    app_name: 'Character AI: Chat, Talk, Text',
    screenshot_path: 'output/paywall_screenshots/02-character-ai-chat-talk-text-high.png',
    observed_price_or_trial: '$9.99/month; $94.99/year; annual page also shows $119.88 struck-through reference price',
    paid_flow_label: 'confirmed_public_web_subscription_pricing',
    product_match_label: 'confirmed_same_product_public_pricing',
    human_notes: 'Local visual review 2026-05-31: screenshot shows Upgrade to c.ai+, monthly and annual c.ai+ plan cards, subscribe CTA, and c.ai+ feature comparison. Public web evidence only; in-app first-value boundary and WTP are not proven.',
    signoff_strength: 'confirmed_public_web',
    claim_limit: 'Supports adjacent paid-behavior / paid-depth proxy for AI companion/avatar-identity market; does not prove Alina WTP or in-app conversion.'
  },
  {
    capture_id: 'PF_01_PF_S02',
    app_name: 'Character AI: Chat, Talk, Text',
    screenshot_path: 'output/paywall_screenshots/02-character-ai-chat-talk-text-high.png',
    observed_price_or_trial: 'Public subscribe page is visible independently; first meaningful in-app value boundary was not inspected.',
    paid_flow_label: 'conservative_partial_public_paywall_boundary_unknown',
    product_match_label: 'confirmed_same_product_public_pricing',
    human_notes: 'Local visual review 2026-05-31: public paywall exists, but this screenshot does not show onboarding or first-session sequence. Treat boundary as unknown until app walkthrough.',
    signoff_strength: 'partial_boundary_unknown',
    claim_limit: 'Use as public paid-surface evidence only, not as first-value/paywall-timing proof.'
  },
  {
    capture_id: 'PF_01_PF_S03',
    app_name: 'Character AI: Chat, Talk, Text',
    screenshot_path: 'output/paywall_screenshots/02-character-ai-chat-talk-text-high.png',
    observed_price_or_trial: 'Paid tier unlocks: better memory, ad-free chats, bonus Charms, latest/best models, no slow mode, unlimited voice calls, more muted words/voice memos/go-ons/swipes, customization.',
    paid_flow_label: 'confirmed_paid_feature_depth_public_web',
    product_match_label: 'confirmed_same_product_public_pricing',
    human_notes: 'Local visual review 2026-05-31: feature comparison is visible and product-matched. This supports paid-depth design reference, not revenue proof.',
    signoff_strength: 'confirmed_public_web',
    claim_limit: 'Useful for paid-depth analogs around memory, personalization, voice, and premium model access.'
  },
  {
    capture_id: 'PF_01_PF_S04',
    app_name: 'Character AI: Chat, Talk, Text',
    screenshot_path: 'output/paywall_screenshots/02-character-ai-chat-talk-text-high.png',
    observed_price_or_trial: 'Same public page brands the paid tier as c.ai+ and includes Character AI site footer links.',
    paid_flow_label: 'confirmed_same_product_public_page',
    product_match_label: 'confirmed_same_product_public_pricing',
    human_notes: 'Local visual review 2026-05-31: page appears product-matched to Character AI/c.ai+. No parent-company mismatch observed in screenshot.',
    signoff_strength: 'confirmed_public_web',
    claim_limit: 'Product-match support for public pricing row; still not a substitute for in-app subscription confirmation.'
  },
  {
    capture_id: 'PF_02_PF_S01',
    app_name: 'Meditopia: Sleep & Meditation',
    screenshot_path: 'output/paywall_screenshots/04-meditopia-sleep-meditation-high.png',
    observed_price_or_trial: '$3.50 per user per month (PUPM) average price shown for Essential Care on Meditopia business pricing page.',
    paid_flow_label: 'confirmed_b2b_public_pricing_not_consumer_app',
    product_match_label: 'partial_same_brand_b2b_not_consumer_app',
    human_notes: 'Local visual review 2026-05-31: pricing page is Meditopia-branded and shows B2B/EAP pricing for organizations. It is not consumer app subscription pricing.',
    signoff_strength: 'partial_b2b_price',
    claim_limit: 'Supports enterprise wellness monetization proxy only; do not use as direct consumer app WTP proof.'
  },
  {
    capture_id: 'PF_02_PF_S02',
    app_name: 'Meditopia: Sleep & Meditation',
    screenshot_path: 'output/paywall_screenshots/04-meditopia-sleep-meditation-high.png',
    observed_price_or_trial: 'Business pricing page with Calculate Pricing / Book a Demo CTAs; consumer first meaningful paywall boundary not inspected.',
    paid_flow_label: 'conservative_partial_b2b_boundary_unknown',
    product_match_label: 'partial_same_brand_b2b_not_consumer_app',
    human_notes: 'Local visual review 2026-05-31: screenshot confirms a B2B paid surface, not the consumer app onboarding/paywall order. Boundary remains unknown for consumer flow.',
    signoff_strength: 'partial_boundary_unknown',
    claim_limit: 'Use only as B2B paid-surface evidence; keep consumer paywall boundary open.'
  },
  {
    capture_id: 'PF_02_PF_S03',
    app_name: 'Meditopia: Sleep & Meditation',
    screenshot_path: 'output/paywall_screenshots/04-meditopia-sleep-meditation-high.png',
    observed_price_or_trial: 'Essential Care includes personalized wellbeing library with AI support, 10,000+ resources, web/mobile/smartwatch access; Total Care adds 1:1 expert sessions, integrations, social features.',
    paid_flow_label: 'confirmed_b2b_paid_feature_depth',
    product_match_label: 'partial_same_brand_b2b_not_consumer_app',
    human_notes: 'Local visual review 2026-05-31: plan depth is visible, but in enterprise/EAP packaging. Helpful for wellness paid-depth taxonomy, not direct consumer pricing.',
    signoff_strength: 'partial_b2b_feature_depth',
    claim_limit: 'Use as wellness/EAP paid-depth benchmark; do not treat as direct Alina consumer subscription analog.'
  },
  {
    capture_id: 'PF_02_PF_S04',
    app_name: 'Meditopia: Sleep & Meditation',
    screenshot_path: 'output/paywall_screenshots/04-meditopia-sleep-meditation-high.png',
    observed_price_or_trial: 'Same Meditopia brand, business navigation, and EAP pricing page; product family matches, consumer app plan does not.',
    paid_flow_label: 'partial_same_brand_b2b_product_match',
    product_match_label: 'partial_same_brand_b2b_not_consumer_app',
    human_notes: 'Local visual review 2026-05-31: product family match is credible, but the page is B2B / employer wellness rather than the consumer meditation app paywall.',
    signoff_strength: 'partial_b2b_product_match',
    claim_limit: 'Use as same-brand enterprise monetization context; keep consumer product-match and WTP open.'
  },
  ...noCleanPriceRows({
    prefix: 'PF_03',
    appName: 'Carrom Pool: Disc Game',
    screenshotPath: 'output/paywall_screenshots/08-carrom-pool-disc-game-medium.png',
    observedSurface: 'Saved Miniclip public page shows games/company context and cookie/privacy language, but no clean Carrom Pool price or plan term.',
    productMatch: 'partial_parent_brand_page_no_clean_price',
    notes: 'Local visual review 2026-05-31: evidence belongs to Miniclip/public web context, not a clean Carrom Pool subscription/IAP page.',
    claimLimit: 'Use only as a weak gaming monetization cue from a parent-brand page; do not use as Carrom Pool pricing proof.'
  }),
  ...noCleanPriceRows({
    prefix: 'PF_04',
    appName: 'Avatar World ®',
    screenshotPath: 'output/paywall_screenshots/13-avatar-world-medium.png',
    observedSurface: 'Saved Pazu Games page shows Avatar World portfolio context and scale claims, but no visible price or subscription term.',
    productMatch: 'partial_same_brand_portfolio_no_clean_price',
    notes: 'Local visual review 2026-05-31: evidence is same-brand/portfolio context for Avatar World, but the paywall or IAP list is not visible.',
    claimLimit: 'Use only as avatar-market product context; do not use as Avatar World pricing or paid-depth proof.'
  }),
  ...noCleanPriceRows({
    prefix: 'PF_05',
    appName: 'AstroSage Kundli: AI Astrology',
    screenshotPath: 'output/paywall_screenshots/15-astrosage-kundli-ai-astrology-medium.png',
    observedSurface: 'Saved AstroSage page shows astrology services and “Buy Brihat Kundli”/buy-now language, but no clean app subscription price.',
    productMatch: 'partial_same_brand_service_no_clean_app_price',
    notes: 'Local visual review 2026-05-31: evidence shows monetized astrology/service context, not a clean consumer app subscription or IAP screen.',
    claimLimit: 'Use only as astrology monetization context; do not use as app paywall, plan-depth, or WTP proof.'
  }),
  ...noCleanPriceRows({
    prefix: 'PF_07',
    appName: 'Everskies: Virtual Dress up',
    screenshotPath: 'output/paywall_screenshots/21-everskies-virtual-dress-up-medium.png',
    observedSurface: 'Saved Everskies page shows logged-out public site context and mentions StarPass/Stars, but no clean price or plan term.',
    productMatch: 'partial_same_product_public_page_no_clean_price',
    notes: 'Local visual review 2026-05-31: evidence appears product-matched to Everskies, but the saved page is logged-out/public and does not expose pricing.',
    claimLimit: 'Use as weak avatar-economy paid-surface cue; do not use as pricing or conversion proof.'
  }),
  ...noCleanPriceRows({
    prefix: 'PF_08',
    appName: 'Mindfulness with Petit BamBou',
    screenshotPath: 'output/paywall_screenshots/25-mindfulness-with-petit-bambou-medium.png',
    observedSurface: 'Saved Petit BamBou page shows Subscribe/Login and free-version/account language, but no clean subscription price.',
    productMatch: 'partial_same_product_public_page_no_clean_price',
    notes: 'Local visual review 2026-05-31: evidence appears product-matched and suggests a subscription surface, but pricing is not visible.',
    claimLimit: 'Use as weak mindfulness paid-surface cue; do not use as pricing, plan-depth, or WTP proof.'
  })
];

const capture = readCsv(CAPTURE);
const signoffById = new Map(signoffs.map(row => [row.capture_id, row]));
for (const row of capture.rows) {
  const signoff = signoffById.get(row.capture_id);
  if (!signoff) continue;
  row.capture_status = 'local_visual_signoff_completed';
  row.observed_price_or_trial = signoff.observed_price_or_trial;
  row.paid_flow_label = signoff.paid_flow_label;
  row.product_match_label = signoff.product_match_label;
  row.human_notes = signoff.human_notes;
}
writeCsv(CAPTURE, capture.rows, capture.headers);

const adjudication = readCsv(ADJUDICATION);
const partialNoPriceAdjudication = new Map([
  ['Carrom Pool: Disc Game', {
    status: 'local_visual_signoff_completed_no_clean_price_parent_brand',
    rationale: 'Local visual review confirms the saved Miniclip page is not a clean Carrom Pool pricing/paywall page; it only provides weak parent-brand monetization context.',
    limit: 'Weak parent-brand paid-surface cue only; do not use as Carrom Pool pricing proof.'
  }],
  ['Avatar World ®', {
    status: 'local_visual_signoff_completed_no_clean_price_portfolio',
    rationale: 'Local visual review confirms same-brand/portfolio context for Avatar World but no visible price, plan term, or in-app paywall.',
    limit: 'Avatar-market product context only; pricing, plan depth, and paywall timing remain open.'
  }],
  ['AstroSage Kundli: AI Astrology', {
    status: 'local_visual_signoff_completed_no_clean_app_price',
    rationale: 'Local visual review shows monetized astrology/service language on AstroSage, but not a clean app subscription or IAP page.',
    limit: 'Astrology monetization context only; do not use as app pricing or WTP proof.'
  }],
  ['Everskies: Virtual Dress up', {
    status: 'local_visual_signoff_completed_no_clean_price',
    rationale: 'Local visual review shows a product-matched public/logged-out Everskies page with StarPass/Stars language, but no clean price.',
    limit: 'Weak avatar-economy paid-surface cue only; pricing and conversion remain open.'
  }],
  ['Mindfulness with Petit BamBou', {
    status: 'local_visual_signoff_completed_no_clean_price',
    rationale: 'Local visual review shows Subscribe/Login and free-version language on Petit BamBou, but no clean subscription price.',
    limit: 'Weak mindfulness paid-surface cue only; pricing, plan depth, and WTP remain open.'
  }]
]);
for (const row of adjudication.rows) {
  if (row.app_name === 'Character AI: Chat, Talk, Text') {
    row.signoff_status = 'local_visual_signoff_completed';
    row.conservative_rationale = 'Local visual review confirms a product-matched public c.ai+ subscription page with $9.99/month and $94.99/year. In-app first-value boundary and WTP remain unproven.';
    row.final_claim_limit = 'Confirmed public web subscription evidence for Character AI/c.ai+; use as paid-depth proxy, not as Alina WTP or in-app conversion proof.';
  }
  if (row.app_name === 'Meditopia: Sleep & Meditation') {
    row.signoff_status = 'local_visual_signoff_completed_partial_b2b';
    row.conservative_rationale = 'Local visual review confirms Meditopia-branded B2B/EAP pricing at $3.50 per user per month, not consumer app subscription pricing.';
    row.final_claim_limit = 'Partial B2B wellness monetization evidence; do not use as direct consumer app WTP proof.';
  }
  const partial = partialNoPriceAdjudication.get(row.app_name);
  if (partial) {
    row.signoff_status = partial.status;
    row.conservative_rationale = partial.rationale;
    row.final_claim_limit = partial.limit;
  }
}
writeCsv(ADJUDICATION, adjudication.rows, adjudication.headers);

writeCsv(OUT, signoffs, [
  'capture_id', 'app_name', 'screenshot_path', 'observed_price_or_trial',
  'paid_flow_label', 'product_match_label', 'human_notes',
  'signoff_strength', 'claim_limit'
]);

const lines = [];
lines.push('# Paid Flow Local Signoff V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This artifact records local visual review for the first paid-flow spike. It uses already captured screenshots rather than new broad search. The goal is to move H2 from zero observed rows to partial observed evidence while keeping the claim boundary conservative.');
lines.push('');
lines.push('## Signoff Rows');
lines.push('');
lines.push(mdTable(signoffs, [
  { key: 'capture_id', label: 'Capture' },
  { key: 'app_name', label: 'App' },
  { key: 'signoff_strength', label: 'Strength' },
  { key: 'observed_price_or_trial', label: 'Observed' },
  { key: 'product_match_label', label: 'Product Match' },
  { key: 'claim_limit', label: 'Claim Limit' }
]));
lines.push('');
lines.push('## Decision Read');
lines.push('');
lines.push('- Character AI/c.ai+ is confirmed as a product-matched public web subscription page with visible monthly and annual pricing.');
lines.push('- Meditopia is confirmed only as a Meditopia-branded B2B/EAP paid surface; it should not be upgraded into direct consumer subscription proof.');
lines.push('- Carrom Pool, Avatar World, AstroSage, Everskies, and Petit BamBou are reviewed as local public-page evidence, but without clean visible public prices. They increase observed coverage and clarify uncertainty; they should not increase paid-money confidence.');
lines.push('- H2 should move to in-progress/partial observed evidence after the gate calculator rebuild, not to pass-ready: the gate requires more completed paid-flow rows and WTP/prototype evidence.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${CAPTURE}\``);
lines.push(`- \`${ADJUDICATION}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`paid_flow_local_signoff=${OUT}`);
console.log(`doc=${OUT_DOC}`);
console.log(`signoff_rows=${signoffs.length}`);
