import fs from 'fs';

const OUT = 'data_processed/evidence_claim_register.csv';
const OUT_DOC = 'docs/decision/evidence-audit-v1.md';

for (const dir of ['data_processed', 'docs/decision']) fs.mkdirSync(dir, { recursive: true });

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
  if (!header) return [];
  return rows.filter(r => r.length === header.length).map(r => Object.fromEntries(header.map((h, i) => [h, r[i] || ''])));
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

function bulletCounts(counts) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');
}

function pct(num, den) {
  if (!den) return '0%';
  return `${Math.round((num / den) * 1000) / 10}%`;
}

const expanded = csv('data_raw/expanded/all_expanded_dedup.csv');
const expandedRaw = csv('data_raw/expanded/all_expanded_raw.csv');
const feature = csv('data_processed/competitor_feature_matrix.csv');
const audience = csv('data_processed/audience_signal_matrix.csv');
const whitespace = csv('data_processed/whitespace_signal_matrix.csv');
const tam = csv('data_processed/tam_sam_som_model.csv');
const som = csv('data_processed/som_sensitivity_scenarios.csv');
const claims = csv('data_processed/market_claims.csv');
const marketSourceConfidence = csv('data_processed/market_source_confidence_review.csv');
const marketConfidenceSummary = csv('data_processed/market_confidence_summary.csv');
const monetizationProxy = csv('data_processed/market_monetization_proxy_matrix.csv');
const competitorRevenueProxy = csv('data_processed/competitor_revenue_proxy_review.csv');
const competitorRevenueProxySummary = csv('data_processed/competitor_revenue_proxy_market_summary.csv');
const top100 = csv('data_processed/top100_competitor_review_scorecard.csv');
const validationQueue = csv('data_processed/top100_human_validation_queue.csv');
const iap = csv('data_raw/app_store_iap_pricing_raw.csv');
const googlePlay = csv('data_raw/google_play_pricing_raw.csv');
const webPaywalls = csv('data_processed/web_paywall_signal_matrix.csv');
const screenshots = csv('data_processed/web_paywall_screenshot_validation.csv');
const screenshotInterpretation = csv('data_processed/web_paywall_screenshot_interpretation.csv');
const webPaywallVisualAdjudication = csv('data_processed/web_paywall_visual_adjudication.csv');
const webPaywallVisualAdjudicationSummary = csv('data_processed/web_paywall_visual_adjudication_summary.csv');
const reviews = csv('data_raw/app_store_top_candidate_reviews.csv');
const reviewSignals = csv('data_processed/review_signal_matrix.csv');
const reviewClusters = csv('data_processed/review_jtbd_cluster_summary.csv');
const forumSources = csv('data_raw/forum_evidence_signals.csv');
const forumQuotes = csv('data_processed/forum_quote_coding_matrix.csv');
const icpSegments = csv('data_processed/icp_segment_matrix.csv');
const icpValidationPlan = csv('data_processed/icp_validation_test_plan.csv');
const prototypeStimulusFlow = csv('data_processed/prototype_validation_stimulus_flow.csv');
const prototypeScorecard = csv('data_processed/prototype_validation_scorecard.csv');
const productCore = csv('data_processed/product_core_evidence_matrix.csv');
const p0External = csv('data_raw/expanded/p0_external_sources_raw.csv');
const itchRows = csv('data_raw/expanded_itch_raw.csv');
const steamTagRows = csv('data_raw/expanded_steam_tags_raw.csv');
const chromeExtensionFit = csv('data_processed/chrome_extension_fit_matrix.csv');
const chromeExtensionBattlecards = csv('data_processed/chrome_extension_mechanic_battlecards.csv');
const validationGapRoadmap = csv('data_processed/validation_gap_roadmap.csv');
const evidenceManifest = csv('data_processed/evidence_artifact_manifest.csv');
const completionAudit = csv('data_processed/research_completion_audit.csv');
const highUseMarketSources = marketSourceConfidence.filter(row => row.confidence_review_band === 'high_use');
const rangeOnlyMarketSources = marketSourceConfidence.filter(row => ['low_use_range_only', 'context_only'].includes(row.confidence_review_band));
const strongMonetizationMarkets = monetizationProxy.filter(row => row.monetization_proxy_band === 'strong_paid_behavior_proxy');
const strongRevenueProxyCompetitors = competitorRevenueProxy.filter(row => row.revenue_proxy_band === 'strong_bottom_up_money_proxy');
const mediumPlusRevenueProxyCompetitors = competitorRevenueProxy.filter(row => ['strong_bottom_up_money_proxy', 'medium_bottom_up_money_proxy'].includes(row.revenue_proxy_band));

const primary = top100.filter(row => row.duplicate_flag === 'primary_app_entry');
const highThreat = primary.filter(row => Number(row.competitive_threat_score || 0) >= 24);
const direct = primary.filter(row => row.competitive_verdict === 'direct_reference_competitor');
const behaviorTied = productCore.filter(row => row.behavior_tied_progression === 'yes');
const highWhitespace = whitespace.filter(row => row.whitespace_band === 'high');
const googleOk = googlePlay.filter(row => row.collection_status === 'ok');
const appsWithIap = new Set(iap.map(row => row.app_store_id).filter(Boolean)).size;
const webConfirmedPricing = screenshotInterpretation.filter(row => row.screenshot_interpretation_verdict === 'confirms_public_pricing_signal');
const webWeakens = screenshotInterpretation.filter(row => row.screenshot_interpretation_verdict === 'weakens_signal_not_found');
const webVisualConfirmed = webPaywallVisualAdjudication.filter(row => row.visual_adjudication === 'confirmed_visible_public_pricing');
const webVisualPartial = webPaywallVisualAdjudication.filter(row => ['confirmed_paid_surface_no_clean_price', 'partial_paid_surface_language', 'visible_price_context_uncertain'].includes(row.visual_adjudication));
const webVisualWeakened = webPaywallVisualAdjudication.filter(row => row.visual_adjudication === 'reject_or_weaken_public_page_signal');
const p0 = validationQueue.filter(row => row.priority_band === 'P0_validate_first');
const p1 = validationQueue.filter(row => row.priority_band === 'P1_high');
const reviewApps = new Set(reviews.map(row => row.app_store_id).filter(Boolean)).size;
const forumSourceCount = new Set(forumQuotes.map(row => row.source_id).filter(Boolean)).size;
const strongIcpSegments = icpSegments.filter(row => row.evidence_band === 'strong_directional_icp');
const prototypeSegments = new Set(prototypeStimulusFlow.map(row => row.segment_id).filter(Boolean));
const prototypeScreens = new Set(prototypeStimulusFlow.map(row => row.screen_id).filter(Boolean));
const intersection = tam.find(row => row.pillar === 'intersection') || {};
const p0ExternalUsable = p0External.filter(row => row.collection_status === 'ok');
const itchOk = itchRows.filter(row => row.collection_status === 'ok');
const steamTagOk = steamTagRows.filter(row => row.collection_status === 'ok');
const chromeExtensionDetailOk = chromeExtensionFit.filter(row => row.detail_status === 'ok');
const chromeExtensionStrong = chromeExtensionFit.filter(row => row.alina_fit_band === 'strong_adjacent');
const chromeMechanicPriority = chromeExtensionBattlecards.filter(row => ['mechanic_threat_high', 'mechanic_threat_medium', 'mechanic_reference_high'].includes(row.threat_band));
const validationRoadmapP0 = validationGapRoadmap.filter(row => row.priority === 'P0');
const manifestMissing = evidenceManifest.filter(row => row.exists !== 'yes');
const manifestCsvRows = evidenceManifest.filter(row => row.file_path.endsWith('.csv'));
const manifestTrackedRows = manifestCsvRows.reduce((sum, row) => sum + Number(row.row_count || 0), 0);
const completionOpen = completionAudit.filter(row => !/^proved/.test(row.status));

const rows = [
  {
    claim_id: 'REQ_plan',
    claim_type: 'project_requirement',
    claim: 'A large expansion plan/backlog exists and routes the research into phased work.',
    evidence_status: 'proved_v1',
    confidence: 'high',
    primary_metric: `master plan exists; ${validationGapRoadmap.length} validation roadmap rows`,
    quantitative_evidence: `roadmap_rows=${validationGapRoadmap.length}; roadmap_p0=${validationRoadmapP0.length}`,
    evidence_files: 'docs/research-expansion-master-plan.md;docs/strategy/research-phases.md;docs/decision/validation-gap-roadmap-v1.md;data_processed/validation_gap_roadmap.csv;reports/expanded-research-kickoff-2026-05-31.md',
    strongest_support: 'Research expansion plan, phase docs, and validation gap roadmap exist in repository.',
    key_gap: 'Needs periodic refresh as validation findings change.',
    next_action: 'Update plan after human validation and prototype testing.'
  },
  {
    claim_id: 'REQ_evidence_package_traceability',
    claim_type: 'project_requirement',
    claim: 'The research package is traceable through a manifest of raw data, processed data, docs, reports, PDFs, charts, and generator scripts.',
    evidence_status: manifestMissing.length ? 'manifest_has_missing_artifacts' : 'proved_v1',
    confidence: manifestMissing.length ? 'medium' : 'high',
    primary_metric: `${evidenceManifest.length} manifest rows; ${manifestMissing.length} missing artifacts`,
    quantitative_evidence: `manifest_rows=${evidenceManifest.length}; csv_artifacts=${manifestCsvRows.length}; tracked_csv_rows=${manifestTrackedRows}; missing=${manifestMissing.length}`,
    evidence_files: 'data_processed/evidence_artifact_manifest.csv;docs/decision/evidence-package-manifest-v1.md',
    strongest_support: 'Evidence package manifest records row counts, source-reference coverage, file sizes, and short SHA-256 hashes for key research artifacts and generator scripts.',
    key_gap: 'Manifest is a reproducibility layer, not a substitute for human validation of claims.',
    next_action: 'Regenerate manifest after each major data/report/PDF update and before final archive.'
  },
  {
    claim_id: 'REQ_completion_readiness_audit',
    claim_type: 'project_requirement',
    claim: 'The original research objective is audited requirement-by-requirement so completion is not overclaimed.',
    evidence_status: 'proved_v1_open_requirements',
    confidence: 'high',
    primary_metric: `${completionAudit.length} completion requirements; ${completionOpen.length} not fully proved/final`,
    quantitative_evidence: `completion_rows=${completionAudit.length}; open_or_partial=${completionOpen.length}`,
    evidence_files: 'data_processed/research_completion_audit.csv;docs/decision/research-completion-audit-v1.md',
    strongest_support: 'Completion audit maps the user objective to current proof, remaining gaps, and next actions, including scale, validation, and final PDF gaps.',
    key_gap: 'Several objective requirements remain partial, directional, draft, or validation-ready rather than fully complete.',
    next_action: 'Use completion audit to prioritize P0 validation and source expansion before any final completion claim.'
  },
  {
    claim_id: 'REQ_competitor_universe',
    claim_type: 'project_requirement',
    claim: 'Competitor/source universe has been expanded across the five target markets.',
    evidence_status: 'substantial_v1_not_50k_dedup',
    confidence: 'medium_high',
    primary_metric: `${expanded.length} dedup rows; ${expandedRaw.length} raw expanded rows; ${itchOk.length} usable itch rows; ${steamTagOk.length} usable Steam tag rows; ${p0ExternalUsable.length} usable P0 external smoke rows; ${chromeExtensionDetailOk.length} Chrome detail pages`,
    quantitative_evidence: `niches=${Object.keys(countBy(expanded, 'niche')).length}; source_kinds=${Object.keys(countBy(expanded, 'source_kind')).length}; p0_external_rows=${p0External.length}; p0_external_usable=${p0ExternalUsable.length}; itch_rows=${itchRows.length}; itch_ok=${itchOk.length}; steam_tag_rows=${steamTagRows.length}; steam_tag_ok=${steamTagOk.length}; chrome_detail_ok=${chromeExtensionDetailOk.length}; chrome_strong_adjacent=${chromeExtensionStrong.length}`,
    evidence_files: 'data_raw/expanded/all_expanded_raw.csv;data_raw/expanded/all_expanded_dedup.csv;data_raw/expanded/p0_external_sources_raw.csv;data_raw/expanded_itch_raw.csv;data_raw/expanded_steam_tags_raw.csv;data_raw/chrome_extension_detail_raw.csv;data_processed/p0_external_source_summary.csv;data_processed/itch_source_summary.csv;data_processed/steam_tag_source_summary.csv;data_processed/chrome_extension_fit_matrix.csv;data_processed/competitor_feature_matrix.csv;docs/competitive/expanded-source-map.md;docs/competitive/p0-external-source-collection-v1.md;docs/competitive/itch-source-expansion-v1.md;docs/competitive/steam-tag-expansion-v1.md;docs/competitive/chrome-extension-detail-enrichment-v1.md',
    strongest_support: 'Large normalized universe exists across App Store, Steam, Google Play fallback, and web search rows; controlled P0 external smoke, Chrome detail enrichment, source-native itch.io tag collection, and Steam tag expansion add browser/web-game/PC mechanic references.',
    key_gap: 'Deduped universe is below the aspirational 30k-50k app target; Product Hunt/AlternativeTo, desktop stores, B2B directories, Reddit mentions, and deeper source-native expansion remain backlog.',
    next_action: 'Continue source-native expansion through Product Hunt/AlternativeTo, desktop stores, B2B directories, Reddit mentions, and deeper itch/Steam tags while keeping evidence quality labels explicit.'
  },
  {
    claim_id: 'H1_product_shape_exists',
    claim_type: 'product_hypothesis',
    claim: 'The proposed product shape exists as an intersection of meaning, daily action, reset, identity/avatar feedback, and progression.',
    evidence_status: 'partially_supported',
    confidence: 'medium',
    primary_metric: `${top100.length} top-candidate rows; ${primary.length} primary apps`,
    quantitative_evidence: `primary_apps=${primary.length}; high_threat=${highThreat.length}; direct_reference=${direct.length}; behavior_tied=${behaviorTied.length}`,
    evidence_files: 'data_processed/top100_competitor_review_scorecard.csv;docs/competitive/top100-competitor-review-v1.md;docs/product/product-core-evidence-v1.md',
    strongest_support: 'Top-100 scorecard shows many adjacent products combining several required primitives.',
    key_gap: 'Strict full loop is rare and needs manual product/onboarding validation.',
    next_action: 'Execute P0/P1 human validation queue and inspect app flows/screenshots.'
  },
  {
    claim_id: 'H2_markets_have_money',
    claim_type: 'product_hypothesis',
    claim: 'The five adjacent markets contain monetizable demand and paid behavior.',
    evidence_status: 'supported_with_ranges_and_bottom_up_proxy',
    confidence: 'medium',
    primary_metric: `intersection SAM base USD ${intersection.samBase || 'n/a'}; ${marketSourceConfidence.length} market sources confidence-reviewed; ${strongMonetizationMarkets.length}/5 strong market-level monetization proxies; ${strongRevenueProxyCompetitors.length} strong competitor money proxies`,
    quantitative_evidence: `market_claims=${claims.length}; SOM scenarios=${som.length}; market_source_reviews=${marketSourceConfidence.length}; high_use_sources=${highUseMarketSources.length}; range_only_or_context=${rangeOnlyMarketSources.length}; monetization_proxy_markets=${monetizationProxy.length}; strong_monetization_proxy=${strongMonetizationMarkets.length}; competitor_revenue_proxy_rows=${competitorRevenueProxy.length}; competitor_revenue_proxy_markets=${competitorRevenueProxySummary.length}; strong_competitor_money_proxy=${strongRevenueProxyCompetitors.length}; medium_plus_competitor_money_proxy=${mediumPlusRevenueProxyCompetitors.length}; App Store IAP rows=${iap.length}; Google Play IAP apps=${googleOk.filter(row => row.offers_iap === 'yes').length}`,
    evidence_files: 'data_processed/tam_sam_som_model.csv;data_processed/som_sensitivity_scenarios.csv;data_processed/market_claims.csv;data_processed/market_source_confidence_review.csv;data_processed/market_confidence_summary.csv;data_processed/market_monetization_proxy_matrix.csv;data_processed/monetization_proxy_examples.csv;data_processed/competitor_revenue_proxy_review.csv;data_processed/competitor_revenue_proxy_market_summary.csv;data_raw/app_store_iap_pricing_raw.csv;data_raw/google_play_pricing_raw.csv;docs/market/tam-sam-som-model-v1.md;docs/market/market-source-confidence-review-v1.md;docs/market/monetization-proxy-matrix-v1.md;docs/market/competitor-revenue-proxy-review-v1.md',
    strongest_support: 'TAM/SAM/SOM model, observed IAP metadata, Google Play IAP metadata, web paywall signals, source confidence review, and competitor-level revenue proxy review show paid depth while preserving range and source-quality caveats.',
    key_gap: 'Market sizing still needs actual revenue estimates, paid intelligence, or manual in-app paywall validation for final investor-grade claims.',
    next_action: 'Validate the highest-scoring competitor money proxies manually and refresh source confidence after any new market sources.'
  },
  {
    claim_id: 'H2_paywall_visible_evidence',
    claim_type: 'pricing_subclaim',
    claim: 'Some adjacent products expose public web paywall/pricing signals outside app stores.',
    evidence_status: 'supported_narrowly_with_visual_adjudication',
    confidence: 'medium_low',
    primary_metric: `${webVisualConfirmed.length}/${webPaywallVisualAdjudication.length} screenshots confirm visible public pricing; ${webVisualPartial.length} partial paid-surface examples`,
    quantitative_evidence: `web_domains=${webPaywalls.length}; screenshot_captured=${screenshots.filter(row => row.screenshot_status === 'captured').length}; ocr_confirmed=${webConfirmedPricing.length}; visual_adjudication_rows=${webPaywallVisualAdjudication.length}; visual_summary_markets=${webPaywallVisualAdjudicationSummary.length}; visual_confirmed=${webVisualConfirmed.length}; visual_partial=${webVisualPartial.length}; visual_weakened=${webVisualWeakened.length}; weakens_signal=${webWeakens.length}`,
    evidence_files: 'data_processed/web_paywall_signal_matrix.csv;data_processed/web_paywall_screenshot_validation.csv;data_processed/web_paywall_screenshot_interpretation.csv;data_processed/web_paywall_visual_adjudication.csv;data_processed/web_paywall_visual_adjudication_summary.csv;docs/competitive/web-paywall-screenshot-interpretation-v1.md;docs/competitive/web-paywall-visual-adjudication-v1.md;output/paywall_screenshots/*.png',
    strongest_support: 'Character.ai and Meditopia screenshots/OCR confirm visible price signals; additional public pages partially confirm paid-surface language or uncertain visible price context.',
    key_gap: 'Most web signals remain ambiguous, not found, parent-company pages, login-gated, or require human sign-off/in-app inspection.',
    next_action: 'Human-signoff the adjudication queue and inspect in-app paywall flows for the highest competitor revenue proxies.'
  },
  {
    claim_id: 'H3_whitespace_exists',
    claim_type: 'product_hypothesis',
    claim: 'There is a narrow whitespace around behavior-tied avatar/identity progression caused by a daily action.',
    evidence_status: 'narrow_supported_not_final',
    confidence: 'medium',
    primary_metric: `${behaviorTied.length}/100 strict behavior-tied progression signals; ${chromeMechanicPriority.length} Chrome mechanic references to inspect`,
    quantitative_evidence: `high_whitespace=${highWhitespace.length}; medium_whitespace=${whitespace.filter(row => row.whitespace_band === 'medium').length}; low_whitespace=${whitespace.filter(row => row.whitespace_band === 'low').length}; chrome_battlecards=${chromeExtensionBattlecards.length}; chrome_priority_mechanics=${chromeMechanicPriority.length}`,
    evidence_files: 'data_processed/whitespace_signal_matrix.csv;data_processed/product_core_evidence_matrix.csv;data_processed/chrome_extension_mechanic_battlecards.csv;docs/intersections/whitespace-map-v2.md;docs/product/product-core-evidence-v1.md;docs/competitive/chrome-extension-mechanic-battlecards-v1.md',
    strongest_support: 'Broad adjacent market is crowded; Chrome battlecards show habit/progress/accountability mechanics exist, while strict behavior-tied avatar progression still appears rare in current metadata.',
    key_gap: 'Metadata can under-detect in-app mechanics; Chrome battlecards explicitly require screenshot/onboarding inspection for hidden identity metaphors.',
    next_action: 'Validate P0/P1 competitors and Chrome mechanic references for actual in-app progression and identity/avatar causality.'
  },
  {
    claim_id: 'H4_competitive_advantage_plausible',
    claim_type: 'product_hypothesis',
    claim: 'A competitive advantage is plausible if Alina owns the integrated daily transformation loop rather than a generic feature.',
    evidence_status: 'prototype_stimulus_ready_unvalidated',
    confidence: 'medium',
    primary_metric: `${direct.length} direct reference competitor; ${highThreat.length} high-threat competitors; ${prototypeScreens.size} prototype screens; ${prototypeScorecard.length} success/kill metrics`,
    quantitative_evidence: `P0_validation=${p0.length}; P1_validation=${p1.length}; chrome_priority_mechanics=${chromeMechanicPriority.length}; prototype_segments=${prototypeSegments.size}; prototype_flow_rows=${prototypeStimulusFlow.length}; prototype_screens=${prototypeScreens.size}; prototype_scorecard_metrics=${prototypeScorecard.length}; human_confirmed=0`,
    evidence_files: 'data_processed/top100_competitor_review_scorecard.csv;data_processed/top100_human_validation_queue.csv;data_processed/chrome_extension_mechanic_battlecards.csv;data_processed/prototype_validation_stimulus_flow.csv;data_processed/prototype_validation_scorecard.csv;docs/product/prototype-validation-stimulus-v1.md;docs/competitive/human-validation-guide-v1.md;docs/competitive/chrome-extension-mechanic-battlecards-v1.md;docs/strategy/value-proposition-v1.md',
    strongest_support: 'Scorecard separates close substitutes from the one current direct reference; Chrome battlecards identify table-stakes mechanics; prototype stimulus pack now defines the two-minute loop and measurable success/kill gates.',
    key_gap: 'No human prototype session yet proves users understand, prefer, or value the integrated loop.',
    next_action: 'Run prototype sessions with the top two ICP segments and fill the scorecard with observed results.'
  },
  {
    claim_id: 'H5_shared_audience_exists',
    claim_type: 'product_hypothesis',
    claim: 'A shared audience exists around digital rituals for identity, emotional regulation, self-improvement, and visible progress.',
    evidence_status: 'directionally_supported',
    confidence: 'medium',
    primary_metric: `${audience.length} audience signal rows; ${icpSegments.length} ICP segment hypotheses; ${icpValidationPlan.length} ICP validation tests`,
    quantitative_evidence: `reviews=${reviews.length}; review_apps=${reviewApps}; review_signals=${reviewSignals.length}; review_clusters=${reviewClusters.length}; forum_quote_rows=${forumQuotes.length}; icp_segments=${icpSegments.length}; strong_icp=${strongIcpSegments.length}; icp_validation_tests=${icpValidationPlan.length}`,
    evidence_files: 'data_processed/audience_signal_matrix.csv;data_raw/app_store_top_candidate_reviews.csv;data_processed/review_signal_matrix.csv;data_processed/review_jtbd_cluster_summary.csv;data_processed/forum_quote_coding_matrix.csv;data_processed/icp_segment_matrix.csv;data_processed/icp_validation_test_plan.csv;docs/audience/review-language-synthesis-v1.md;docs/audience/forum-quote-coding-v1.md;docs/audience/icp-segment-matrix-v1.md;docs/audience/icp-validation-packet-v1.md',
    strongest_support: 'Reviews and forum snippets converge on daily anchors, visible progress, emotional support, pricing sensitivity, and safety boundaries; the ICP segment matrix converts those signals into testable primary-segment hypotheses.',
    key_gap: 'Keyword/OCR/forum coding and directional ICP segments need human validation, interviews, and prototype tests.',
    next_action: 'Execute the ICP validation packet for the top two segments, then update segment status and selected primary ICP.'
  },
  {
    claim_id: 'H6_product_core_defined',
    claim_type: 'product_hypothesis',
    claim: 'The MVP product core can be defined as personal meaning -> one daily action -> short reset -> avatar/identity feedback -> visible progression -> next-day hook.',
    evidence_status: 'supported_for_mvp_framing',
    confidence: 'medium',
    primary_metric: `${feature.length} feature matrix rows; ${productCore.length} product-core rows; ${prototypeScreens.size} prototype screens`,
    quantitative_evidence: `retention_tags=${Object.keys(countBy(csv('data_processed/pricing_retention_matrix.csv'), 'retention_tags')).length}; product_core_rows=${productCore.length}; prototype_flow_rows=${prototypeStimulusFlow.length}; prototype_scorecard_metrics=${prototypeScorecard.length}`,
    evidence_files: 'data_processed/product_core_evidence_matrix.csv;data_processed/prototype_validation_stimulus_flow.csv;data_processed/prototype_validation_scorecard.csv;docs/product/product-core-evidence-v1.md;docs/product/prototype-validation-stimulus-v1.md;docs/strategy/user-flow-v1.md;docs/strategy/avatar-loop-spec.md',
    strongest_support: 'Product-core matrix, strategy docs, and prototype stimulus pack converge on a testable MVP loop.',
    key_gap: 'No user prototype evidence yet confirms comprehension, emotional value, or retention impact.',
    next_action: 'Run prototype sessions and measure loop completion, comprehension, meaning lift, return intent, and paid-depth interest.'
  },
  {
    claim_id: 'REQ_final_artifacts_versioned',
    claim_type: 'project_requirement',
    claim: 'Research artifacts are saved locally, rendered into PDFs, and versioned in GitHub.',
    evidence_status: 'proved_active',
    confidence: 'high',
    primary_metric: 'current branch pushed through latest commit',
    quantitative_evidence: 'PDFs rendered; report/status/docs/data committed',
    evidence_files: 'output/pdf/alina-evidence-first-report-draft.pdf;output/pdf/alina-evidence-visual-report-v1.pdf;reports/evidence-status-2026-05-31.md;git log',
    strongest_support: 'Artifacts exist in repo and commits have been pushed after each major layer.',
    key_gap: 'Final polished investor/user-facing PDF is still draft-level, not final designed publication.',
    next_action: 'After human validation, produce final polished PDF and archive data provenance.'
  }
];

writeCsv(OUT, rows, [
  'claim_id', 'claim_type', 'claim', 'evidence_status', 'confidence',
  'primary_metric', 'quantitative_evidence', 'evidence_files',
  'strongest_support', 'key_gap', 'next_action'
]);

const lines = [];
lines.push('# Evidence Audit V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This register turns the large research corpus into an auditable claim map. Each row states what is currently proved, what is only directional, what evidence files support it, and what remains to validate.');
lines.push('');
lines.push('## Status Mix');
lines.push('');
lines.push(bulletCounts(countBy(rows, 'evidence_status')));
lines.push('');
lines.push('## Confidence Mix');
lines.push('');
lines.push(bulletCounts(countBy(rows, 'confidence')));
lines.push('');
lines.push('## Claim Register');
lines.push('');
lines.push('| Claim ID | Status | Confidence | Primary Metric | Key Gap |');
lines.push('| --- | --- | --- | --- | --- |');
for (const row of rows) {
  lines.push(`| ${row.claim_id} | ${row.evidence_status} | ${row.confidence} | ${clean(row.primary_metric).replace(/\|/g, '/')} | ${clean(row.key_gap).replace(/\|/g, '/')} |`);
}
lines.push('');
lines.push('## Audit Read');
lines.push('');
lines.push('- Strongest proved project layers: plan/backlog, TAM/SAM/SOM v1, matrices, saved artifacts, PDF rendering, and GitHub versioning.');
lines.push('- Traceability layer: evidence package manifest tracks raw/processed data, docs, reports, charts, PDFs, and generator scripts with row counts and short hashes.');
lines.push('- Readiness layer: completion audit maps the original objective to proved, partial, draft, and validation-ready requirements.');
lines.push('- Strongest product evidence: adjacent markets are monetized; the user language around daily ritual/progress is real; strict behavior-tied avatar progression remains narrow in current metadata.');
lines.push('- Weakest remaining proof: human validation of competitors, actual in-app paywall/onboarding flows, real user prototype response, and final source-by-source market sizing review.');
lines.push('- Current decision should remain conditional-go for validation, not full product-build go.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);
fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`register=${OUT}`);
console.log(`doc=${OUT_DOC}`);
console.log(`claims=${rows.length}`);
