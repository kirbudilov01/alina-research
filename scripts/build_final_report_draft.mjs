import fs from 'fs';

const OUT = 'reports/alina-evidence-first-report-draft.md';
const STATUS_OUT = 'reports/evidence-status-2026-05-31.md';

for (const dir of ['reports']) fs.mkdirSync(dir, { recursive: true });

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

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

function csv(file) {
  if (!fs.existsSync(file) && file === 'data_processed/cross_source_universe_raw.csv') {
    return csvShards('data_processed/cross_source_universe_raw_index.csv');
  }
  return parseCsv(read(file));
}

function csvShards(indexFile) {
  if (!fs.existsSync(indexFile)) return [];
  return parseCsv(read(indexFile))
    .flatMap(row => fs.existsSync(row.file_path) ? parseCsv(read(row.file_path)) : []);
}

function clean(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
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

function bulletCounts(counts) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n');
}

const expanded = csv('data_raw/expanded/all_expanded_dedup.csv');
const feature = csv('data_processed/competitor_feature_matrix.csv');
const audience = csv('data_processed/audience_signal_matrix.csv');
const whitespace = csv('data_processed/whitespace_signal_matrix.csv');
const tam = csv('data_processed/tam_sam_som_model.csv');
const som = csv('data_processed/som_sensitivity_scenarios.csv');
const claims = csv('data_processed/market_claims.csv');
const marketSourceConfidence = csv('data_processed/market_source_confidence_review.csv');
const marketConfidenceSummary = csv('data_processed/market_confidence_summary.csv');
const marketAssumptionAudit = csv('data_processed/market_sizing_assumption_audit.csv');
const marketStressTest = csv('data_processed/market_sizing_stress_test.csv');
const monetizationProxy = csv('data_processed/market_monetization_proxy_matrix.csv');
const monetizationExamples = csv('data_processed/monetization_proxy_examples.csv');
const marketMoneyTriangulation = csv('data_processed/market_money_triangulation.csv');
const marketMoneyTriangulationSummary = csv('data_processed/market_money_triangulation_summary.csv');
const prefill = csv('data_processed/top_intersection_review_prefill.csv');
const pricing = csv('data_processed/pricing_retention_matrix.csv');
const core = csv('data_processed/product_core_evidence_matrix.csv');
const reviewSignals = csv('data_processed/review_signal_matrix.csv');
const rawReviews = csv('data_raw/app_store_top_candidate_reviews.csv');
const reviewClusters = csv('data_processed/review_jtbd_cluster_summary.csv');
const communityReferralRows = csv('data_processed/community_referral_signal_rows.csv');
const communityReferralSummary = csv('data_processed/community_referral_summary.csv');
const forumSignals = csv('data_raw/forum_evidence_signals.csv');
const forumQuoteCoding = csv('data_processed/forum_quote_coding_matrix.csv');
const icpSegments = csv('data_processed/icp_segment_matrix.csv');
const icpValidationPlan = csv('data_processed/icp_validation_test_plan.csv');
const icpRecruitingBridge = csv('data_processed/icp_recruiting_bridge.csv');
const icpRecruitingMessages = csv('data_processed/icp_recruiting_message_bank.csv');
const prototypeStimulusFlow = csv('data_processed/prototype_validation_stimulus_flow.csv');
const prototypeScorecard = csv('data_processed/prototype_validation_scorecard.csv');
const top100Review = csv('data_processed/top100_competitor_review_scorecard.csv');
const humanValidationQueue = csv('data_processed/top100_human_validation_queue.csv');
const manualInspectionPacket = csv('data_processed/manual_competitor_inspection_packet.csv');
const manualInspectionRubric = csv('data_processed/manual_competitor_inspection_rubric.csv');
const publicListingInspection = csv('data_processed/public_listing_inspection_results.csv');
const publicListingSummary = csv('data_processed/public_listing_inspection_summary.csv');
const iapRaw = csv('data_raw/app_store_iap_pricing_raw.csv');
const iapSummary = csv('data_processed/app_store_iap_pricing_summary.csv');
const googlePlayPricing = csv('data_raw/google_play_pricing_raw.csv');
const googlePlayPricingSummary = csv('data_processed/google_play_pricing_summary.csv');
const webPaywallRaw = csv('data_raw/web_paywall_discovery_raw.csv');
const webPaywallSignals = csv('data_processed/web_paywall_signal_matrix.csv');
const webPaywallScreenshots = csv('data_processed/web_paywall_screenshot_validation.csv');
const webPaywallScreenshotInterpretation = csv('data_processed/web_paywall_screenshot_interpretation.csv');
const webPaywallVisualAdjudication = csv('data_processed/web_paywall_visual_adjudication.csv');
const webPaywallVisualAdjudicationSummary = csv('data_processed/web_paywall_visual_adjudication_summary.csv');
const evidenceAudit = csv('data_processed/evidence_claim_register.csv');
const sourceExpansionBacklog = csv('data_processed/source_expansion_backlog.csv');
const p0ExternalSources = csv('data_raw/expanded/p0_external_sources_raw.csv');
const p0ExternalSummary = csv('data_processed/p0_external_source_summary.csv');
const itchRows = csv('data_raw/expanded_itch_raw.csv');
const itchSummary = csv('data_processed/itch_source_summary.csv');
const steamTagRows = csv('data_raw/expanded_steam_tags_raw.csv');
const steamTagSummary = csv('data_processed/steam_tag_source_summary.csv');
const desktopStoreRows = csv('data_raw/expanded_desktop_store_raw.csv');
const desktopStoreSummary = csv('data_processed/desktop_store_source_summary.csv');
const redditMentionRows = csv('data_raw/expanded_reddit_competitor_mentions_raw.csv');
const redditMentionSummary = csv('data_processed/reddit_competitor_mentions_summary.csv');
const redditMentionSignals = csv('data_processed/reddit_mention_signal_matrix.csv');
const redditMentionAppSummary = csv('data_processed/reddit_mention_app_summary.csv');
const redditManualReadingQueue = csv('data_processed/reddit_manual_reading_queue.csv');
const redditManualPromptBank = csv('data_processed/reddit_manual_reading_prompt_bank.csv');
const redditManualCaptureSheet = csv('data_processed/reddit_manual_reading_capture_sheet.csv');
const chromeExtensionFit = csv('data_processed/chrome_extension_fit_matrix.csv');
const chromeExtensionBattlecards = csv('data_processed/chrome_extension_mechanic_battlecards.csv');
const crossSourceRaw = csv('data_processed/cross_source_universe_raw.csv');
const crossSourceDedup = csv('data_processed/cross_source_universe_dedup.csv');
const crossSourceSummary = csv('data_processed/cross_source_universe_summary.csv');
const crossSourceCoverage = csv('data_processed/cross_source_coverage_matrix.csv');
const crossSourceSaturation = csv('data_processed/cross_source_market_saturation_matrix.csv');
const validationGapRoadmap = csv('data_processed/validation_gap_roadmap.csv');
const validationExecutionDashboard = csv('data_processed/validation_execution_dashboard.csv');
const hypothesisDecisions = csv('data_processed/hypothesis_decision_matrix.csv');
const p0CommandCenter = csv('data_processed/p0_validation_command_center.csv');
const p0FieldGuide = csv('data_processed/p0_validation_field_guide.csv');
const russianValidationFieldbook = csv('data_processed/russian_validation_fieldbook.csv');
const validationWorkspace = csv('data_processed/validation_evidence_workspace_index.csv');
const validationBatch01 = csv('data_processed/validation_batch_01_index.csv');
const validationBatch02 = csv('data_processed/validation_batch_02_index.csv');
const validationBatch03 = csv('data_processed/validation_batch_03_index.csv');
const validationBatchPrefilledLocalArtifacts = [...validationBatch01, ...validationBatch02, ...validationBatch03]
  .filter(row => row.prefill_status === 'existing_local_artifact_linked').length;
const validationEvidenceRollup = csv('data_processed/validation_evidence_rollup.csv');
const validationTranchePlanner = csv('data_processed/validation_tranche_planner.csv');
const validationGateCalculator = csv('data_processed/validation_gate_calculator.csv');
const validationGateStatusSummary = csv('data_processed/validation_gate_status_summary.csv');
const manualWalkthroughCapture = csv('data_processed/manual_walkthrough_capture_sheet.csv');
const paidFlowCapture = csv('data_processed/paid_flow_capture_sheet.csv');
const icpInterviewCapture = csv('data_processed/icp_interview_capture_sheet.csv');
const prototypeSessionCapture = csv('data_processed/prototype_session_capture_sheet.csv');
const evidenceManifest = csv('data_processed/evidence_artifact_manifest.csv');
const completionAudit = csv('data_processed/research_completion_audit.csv');
const competitorRevenueProxy = csv('data_processed/competitor_revenue_proxy_review.csv');
const competitorRevenueProxySummary = csv('data_processed/competitor_revenue_proxy_market_summary.csv');

const highWhitespace = whitespace.filter(r => r.whitespace_band === 'high').length;
const mediumWhitespace = whitespace.filter(r => r.whitespace_band === 'medium').length;
const lowWhitespace = whitespace.filter(r => r.whitespace_band === 'low').length;
const veryClose = core.filter(r => r.alina_closeness === 'very_close').length;
const close = core.filter(r => r.alina_closeness === 'close').length;
const behaviorTied = core.filter(r => r.behavior_tied_progression === 'yes').length;
const baseIntersection = tam.find(r => r.pillar === 'intersection') || {};
const reviewApps = new Set(rawReviews.map(r => r.app_store_id).filter(Boolean)).size;
const ratingMix = countBy(rawReviews, 'rating');
const reviewSignalCounts = countBy(reviewSignals, 'signal');
const primaryCompetitors = top100Review.filter(r => r.duplicate_flag === 'primary_app_entry');
const highThreatCompetitors = primaryCompetitors.filter(r => Number(r.competitive_threat_score) >= 24);
const directReferenceCompetitors = primaryCompetitors.filter(r => r.competitive_verdict === 'direct_reference_competitor');
const p0HumanValidation = humanValidationQueue.filter(r => r.priority_band === 'P0_validate_first');
const p1HumanValidation = humanValidationQueue.filter(r => r.priority_band === 'P1_high');
const manualInspectionStrongMoney = manualInspectionPacket.filter(r => r.revenue_proxy_band === 'strong_bottom_up_money_proxy');
const manualInspectionBehaviorPrefill = manualInspectionPacket.filter(r => r.behavior_tied_progression_prefill === 'yes');
const publicListingInspected = publicListingInspection.filter(r => r.public_listing_inspection_status === 'public_listing_inspected');
const publicListingVisibleCausality = publicListingInspection.filter(r => r.action_to_avatar_causality_public_read === 'visible_in_public_copy');
const publicListingHighCloneRisk = publicListingInspection.filter(r => r.hidden_clone_risk_public_read === 'high_hidden_clone_risk_requires_app_walkthrough');
const appsWithIap = new Set(iapRaw.map(r => r.app_store_id).filter(Boolean)).size;
const iapPrices = iapRaw.map(r => Number(r.price_usd)).filter(Number.isFinite);
const googlePlayOk = googlePlayPricing.filter(r => r.collection_status === 'ok');
const webPaywallScreenshotQueue = webPaywallSignals.filter(r => r.needs_screenshot_validation === 'yes');
const webPaywallCapturedScreenshots = webPaywallScreenshots.filter(r => r.screenshot_status === 'captured');
const confirmedPublicPricingScreenshots = webPaywallScreenshotInterpretation.filter(r => r.screenshot_interpretation_verdict === 'confirms_public_pricing_signal');
const confirmedVisualPricing = webPaywallVisualAdjudication.filter(r => r.visual_adjudication === 'confirmed_visible_public_pricing');
const partialVisualPaidSurface = webPaywallVisualAdjudication.filter(r => ['confirmed_paid_surface_no_clean_price', 'partial_paid_surface_language', 'visible_price_context_uncertain'].includes(r.visual_adjudication));
const p0ExternalUsable = p0ExternalSources.filter(r => r.collection_status === 'ok');
const itchOk = itchRows.filter(r => r.collection_status === 'ok');
const steamTagOk = steamTagRows.filter(r => r.collection_status === 'ok');
const desktopStoreOk = desktopStoreRows.filter(r => r.collection_status === 'ok');
const redditMentionOk = redditMentionRows.filter(r => r.collection_status === 'ok');
const redditMentionKnownSignals = redditMentionSignals.filter(r => clean(r.app_name) && r.collection_status === 'ok');
const redditMentionMediumPlusSignals = redditMentionSignals.filter(r => ['medium_high_qualitative', 'medium_qualitative'].includes(r.competitor_signal_strength));
const redditManualP0 = redditManualReadingQueue.filter(r => r.priority_band === 'P0_read_first');
const redditManualP1 = redditManualReadingQueue.filter(r => r.priority_band === 'P1_read_next');
const redditManualCaptureP0 = redditManualCaptureSheet.filter(r => r.priority_band === 'P0_read_first');
const redditManualCaptureCompleted = redditManualCaptureSheet.filter(r => !['', 'not_started'].includes(r.capture_status));
const chromeExtensionDetailOk = chromeExtensionFit.filter(r => r.detail_status === 'ok');
const chromeExtensionStrong = chromeExtensionFit.filter(r => r.alina_fit_band === 'strong_adjacent');
const chromeExtensionUseful = chromeExtensionFit.filter(r => r.alina_fit_band === 'useful_adjacent');
const chromeMechanicPriority = chromeExtensionBattlecards.filter(r => ['mechanic_threat_high', 'mechanic_threat_medium', 'mechanic_reference_high'].includes(r.threat_band));
const validationRoadmapP0 = validationGapRoadmap.filter(r => r.priority === 'P0');
const validationRoadmapP1 = validationGapRoadmap.filter(r => r.priority === 'P1');
const validationExecutionP0 = validationExecutionDashboard.filter(r => r.priority === 'P0');
const validationExecutionP1 = validationExecutionDashboard.filter(r => r.priority === 'P1');
const p0CommandBlockers = p0CommandCenter.filter(r => r.priority === 'P0_blocker');
const p0CommandRows = p0CommandCenter.filter(r => r.priority === 'P0');
const validationGatesPassed = validationGateCalculator.filter(r => r.gate_status === 'pass_ready_for_review');
const validationGatesNotStarted = validationGateCalculator.filter(r => r.gate_status === 'not_started');
const validationCaptureRows = manualWalkthroughCapture.length + paidFlowCapture.length + icpInterviewCapture.length + prototypeSessionCapture.length + redditManualCaptureSheet.length;
const highUseMarketSources = marketSourceConfidence.filter(r => r.confidence_review_band === 'high_use');
const rangeOnlyMarketSources = marketSourceConfidence.filter(r => ['low_use_range_only', 'context_only'].includes(r.confidence_review_band));
const strongMonetizationMarkets = monetizationProxy.filter(r => r.monetization_proxy_band === 'strong_paid_behavior_proxy');
const mediumMonetizationMarkets = monetizationProxy.filter(r => r.monetization_proxy_band === 'medium_paid_behavior_proxy');
const strongTriangulatedMoneyMarkets = marketMoneyTriangulation.filter(r => r.money_triangulation_verdict === 'strong_directional_money_case');
const mediumTriangulatedMoneyMarkets = marketMoneyTriangulation.filter(r => r.money_triangulation_verdict === 'medium_directional_money_case');
const strongRevenueProxyCompetitors = competitorRevenueProxy.filter(r => r.revenue_proxy_band === 'strong_bottom_up_money_proxy');
const mediumPlusRevenueProxyCompetitors = competitorRevenueProxy.filter(r => ['strong_bottom_up_money_proxy', 'medium_bottom_up_money_proxy'].includes(r.revenue_proxy_band));
const prototypeSegments = new Set(prototypeStimulusFlow.map(r => r.segment_id).filter(Boolean));
const prototypeScreens = new Set(prototypeStimulusFlow.map(r => r.screen_id).filter(Boolean));
const strongestIcpSegment = [...icpSegments].sort((a, b) => Number(b.evidence_score || 0) - Number(a.evidence_score || 0))[0] || {};
const manifestMissing = evidenceManifest.filter(r => r.exists !== 'yes');
const manifestCsvRows = evidenceManifest.filter(r => r.file_path.endsWith('.csv'));
const manifestTrackedRows = manifestCsvRows.reduce((sum, row) => sum + Number(row.row_count || 0), 0);
const completionOpen = completionAudit.filter(r => !/^proved/.test(r.status));
const holdHypothesisDecisions = hypothesisDecisions.filter(r => r.current_decision === 'hold_validate');
const goHypothesisDecisions = hypothesisDecisions.filter(r => r.current_decision === 'go_for_next_phase');
const stopHypothesisDecisions = hypothesisDecisions.filter(r => r.current_decision === 'stop_or_pivot');

const report = [];

report.push('# Alina Evidence-First Research Report Draft');
report.push('');
report.push(`Generated: ${new Date().toISOString()}`);
report.push('');
report.push('## 1. Executive Summary');
report.push('');
report.push('Alina is a proposed daily companion app combining personal meaning, identity reinforcement, coaching/action, short reset practices, and game-like progression. The research now supports a more precise opportunity statement: adjacent markets and partial substitutes are real, but the under-owned space appears to be the causal loop where completing a daily action visibly changes an identity/avatar feedback object.');
report.push('');
report.push('Current evidence verdict: **continue research / conditional go**. The market existence signal is strong enough to keep going; the remaining proof burden is competitor manual review, detailed pricing/paywall extraction, forum evidence beyond App Store reviews, and user validation of the avatar-progress mechanic.');
report.push('');
report.push('Key quantified signals:');
report.push('');
report.push(`- Expanded competitor universe: ${expanded.length} deduplicated rows from ${Object.keys(countBy(expanded, 'source_kind')).length} source kinds.`);
report.push(`- Audience signal rows: ${audience.length}.`);
report.push(`- High whitespace candidates: ${highWhitespace}; medium: ${mediumWhitespace}; low: ${lowWhitespace}.`);
report.push(`- Top-100 intersection candidates enriched from App Store metadata: ${prefill.length}/100.`);
report.push(`- AI-assisted top-100 competitor review: ${top100Review.length} rows, ${primaryCompetitors.length} unique primary apps, ${highThreatCompetitors.length} high-threat apps, ${directReferenceCompetitors.length} direct reference competitor.`);
report.push(`- Human validation packet: ${humanValidationQueue.length} primary apps queued; ${p0HumanValidation.length} P0 and ${p1HumanValidation.length} P1 validation targets.`);
report.push(`- Manual competitor inspection packet: ${manualInspectionPacket.length} first-wave P0 apps, ${manualInspectionRubric.length} rubric dimensions, ${manualInspectionStrongMoney.length} strong-money targets.`);
report.push(`- P0 public listing inspection: ${publicListingInspected.length}/${manualInspectionPacket.length} public listings inspected, ${publicListingVisibleCausality.length} visible action-to-avatar causality read, ${publicListingHighCloneRisk.length} high public hidden-clone risk case.`);
report.push(`- App Store IAP pricing layer: ${iapRaw.length} observed purchase rows across ${appsWithIap} apps; observed price range ${iapPrices.length ? `$${Math.min(...iapPrices).toFixed(2)}-$${Math.max(...iapPrices).toFixed(2)}` : 'n/a'}.`);
report.push(`- Google Play pricing validation: ${googlePlayOk.length}/${googlePlayPricing.length} successful Android lookups; ${googlePlayOk.filter(r => r.offers_iap === 'yes').length} apps offer IAP.`);
report.push(`- Developer website paywall discovery: ${webPaywallRaw.length} fetched URL rows across ${webPaywallSignals.length} app/domain rows; ${webPaywallScreenshotQueue.length} domains queued for screenshot validation.`);
report.push(`- Web paywall screenshot capture: ${webPaywallCapturedScreenshots.length}/${webPaywallScreenshots.length} queued screenshots captured for manual interpretation.`);
report.push(`- Web paywall OCR interpretation: ${webPaywallScreenshotInterpretation.length} screenshots interpreted; ${confirmedPublicPricingScreenshots.length} currently confirm visible public pricing, while the rest need human review or weaken the signal.`);
report.push(`- Web paywall visual adjudication: ${webPaywallVisualAdjudication.length} screenshots adjudicated; ${confirmedVisualPricing.length} confirmed public pricing and ${partialVisualPaidSurface.length} partial paid-surface examples.`);
report.push(`- Evidence audit register: ${evidenceAudit.length} claim rows mapping hypotheses/requirements to proof status, confidence, gaps, and next actions.`);
report.push(`- Evidence package manifest: ${evidenceManifest.length} artifacts tracked, ${manifestCsvRows.length} CSV artifacts, ${manifestTrackedRows} tracked CSV rows, ${manifestMissing.length} missing required artifacts.`);
report.push(`- Completion/readiness audit: ${completionAudit.length} objective requirements mapped; ${completionOpen.length} remain partial, directional, draft, or not final.`);
report.push(`- Source expansion backlog: ${sourceExpansionBacklog.length} prioritized collector/source tasks for the next move toward a 30k-50k raw universe.`);
report.push(`- Controlled P0 external-source smoke pass: ${p0ExternalSources.length} rows, ${p0ExternalUsable.length} usable candidates, with search-engine-heavy expansion intentionally deferred.`);
report.push(`- Source-native itch.io expansion: ${itchRows.length} rows, ${itchOk.length} OK rows, adding web-game/mechanic references without broad search-engine crawling.`);
report.push(`- Source-native Steam tag expansion: ${steamTagRows.length} rows, ${steamTagOk.length} OK rows, adding PC progression/cozy/avatar mechanic references.`);
report.push(`- Source-native desktop store expansion: ${desktopStoreRows.length} Mac App Store rows, ${desktopStoreOk.length} OK rows, adding desktop wellness/productivity/avatar/game references without search-engine crawling.`);
report.push(`- Source-native Reddit forum mention expansion: ${redditMentionRows.length} old.reddit rows, ${redditMentionOk.length} known-app mention rows, adding forum competitor/need signals without search-engine crawling.`);
report.push(`- Reddit mention signal coding: ${redditMentionSignals.length} coded qualitative rows, ${Object.keys(countBy(redditMentionSignals, 'signal_group')).length} signal groups, ${redditMentionKnownSignals.length} known-app signal rows, and ${redditMentionAppSummary.length} app summaries.`);
report.push(`- Reddit manual reading queue: ${redditManualReadingQueue.length} unique threads prioritized, including ${redditManualP0.length} P0 read-first and ${redditManualP1.length} P1 read-next threads, with ${redditManualPromptBank.length} prompt-bank lanes.`);
report.push(`- Reddit manual reading capture sheet: ${redditManualCaptureSheet.length} P0/P1 fillable rows, ${redditManualCaptureP0.length} P0 rows, ${redditManualCaptureCompleted.length} completed so far; all default to unread/do-not-upgrade.`);
report.push(`- Cross-source universe normalization: ${crossSourceRaw.length} normalized raw rows and ${crossSourceDedup.length} dedup rows across core app stores, Google Play fallback, itch.io, Steam, Mac desktop store, Chrome, and Reddit forum mentions.`);
report.push(`- Cross-source coverage matrix: ${crossSourceCoverage.length} source/market cells, ${crossSourceCoverage.filter(r => r.coverage_band === 'strong_coverage').length} strong and ${crossSourceCoverage.filter(r => r.coverage_band === 'medium_coverage').length} medium coverage cells.`);
report.push(`- Cross-source saturation/whitespace matrix: ${crossSourceSaturation.length} markets scored; ${crossSourceSaturation.filter(r => r.opportunity_band === 'mechanic_benchmark_not_primary_market').length} benchmark-only markets and ${crossSourceSaturation.filter(r => r.opportunity_band === 'high_opportunity_validate_now').length} primary high-opportunity markets before manual validation.`);
report.push(`- Chrome extension detail enrichment: ${chromeExtensionDetailOk.length}/${chromeExtensionFit.length} detail pages parsed; ${chromeExtensionStrong.length} strong and ${chromeExtensionUseful.length} useful adjacent mechanic references.`);
report.push(`- Chrome mechanic battlecards: ${chromeExtensionBattlecards.length} browser-extension cards, ${chromeMechanicPriority.length} high/medium references for manual mechanic inspection.`);
report.push(`- Validation gap roadmap: ${validationGapRoadmap.length} rows; ${validationRoadmapP0.length} P0 and ${validationRoadmapP1.length} P1 next validation tasks across markets, hypotheses, and cross-source checks.`);
report.push(`- Validation execution dashboard: ${validationExecutionDashboard.length} concrete execution tasks; ${validationExecutionP0.length} P0 and ${validationExecutionP1.length} P1.`);
report.push(`- H1-H6 hypothesis decision matrix: ${hypothesisDecisions.length} rows; ${holdHypothesisDecisions.length} hold/validate, ${goHypothesisDecisions.length} go, ${stopHypothesisDecisions.length} stop/pivot.`);
report.push(`- P0 validation command center: ${p0CommandCenter.length} operator rows; ${p0CommandBlockers.length} blocker rows and ${p0CommandRows.length} P0 rows.`);
report.push(`- P0 validation field guide: ${p0FieldGuide.length} script/protocol sections for walkthroughs, paid-flow signoff, ICP interviews, prototype sessions, and rebuild/commit hygiene.`);
report.push(`- Russian validation fieldbook: ${russianValidationFieldbook.length} sequential Russian phases for manual validation execution and claim-update discipline.`);
report.push(`- Validation evidence workspace: ${validationWorkspace.length} lane folders/index rows with local templates for screenshots, notes, quotes, and scorecard calculations.`);
report.push(`- Validation Batch 01: ${validationBatch01.length} prefilled blocker-note files ready for first observed validation tranche.`);
report.push(`- Validation Batch 02: ${validationBatch02.length} prefilled P0-breadth note files for manual walkthrough, paid-flow signoff, ICP interviews, prototype sessions, and scorecard gates.`);
report.push(`- Validation Batch 03: ${validationBatch03.length} prefilled P1-context paid-flow note files to keep weaker monetization signals conservative.`);
report.push(`- Validation note local evidence links: ${validationBatchPrefilledLocalArtifacts} batch notes now point at existing local artifacts, mainly captured paywall screenshots; these are evidence links, not human signoff.`);
report.push(`- Validation evidence rollup: ${validationEvidenceRollup.length} command rows auditing note coverage, local artifact links, and missing batch notes.`);
report.push(`- Validation tranche planner: ${validationTranchePlanner.length} ordered execution tranches turn capture rows into blocker spikes, pilot batches, and rebuild gates.`);
report.push(`- Validation gate calculator: ${validationGateCalculator.length} H1-H6 gate rows; ${validationGatesPassed.length} pass-ready and ${validationGatesNotStarted.length} not started from current capture sheets.`);
report.push(`- Validation capture sheets: ${validationCaptureRows} fillable capture rows across manual walkthrough, paid-flow, ICP interview, prototype-session, and Reddit manual-read evidence.`);
report.push(`- Market source confidence review: ${marketSourceConfidence.length} sources graded; ${highUseMarketSources.length} high-use anchors and ${rangeOnlyMarketSources.length} range-only/context sources.`);
report.push(`- Market sizing stress test: ${marketAssumptionAudit.length} assumption-risk rows and ${marketStressTest.length} bottom-up stress scenarios.`);
report.push(`- Monetization proxy matrix: ${monetizationProxy.length} markets covered; ${strongMonetizationMarkets.length} strong and ${mediumMonetizationMarkets.length} medium paid-behavior proxy markets from IAP/Google Play/web paywall evidence.`);
report.push(`- Market-money triangulation: ${marketMoneyTriangulation.length} market rows; ${strongTriangulatedMoneyMarkets.length} strong and ${mediumTriangulatedMoneyMarkets.length} medium directional money cases, with H2 still gated by paid-flow/WTP validation.`);
report.push(`- Competitor revenue proxy review: ${competitorRevenueProxy.length} primary competitors reviewed; ${strongRevenueProxyCompetitors.length} strong and ${mediumPlusRevenueProxyCompetitors.length} medium-or-stronger bottom-up money proxies.`);
report.push(`- ICP segment matrix: ${icpSegments.length} segment hypotheses; strongest current directional ICP is "${strongestIcpSegment.segment_name || 'n/a'}".`);
report.push(`- ICP validation packet: ${icpValidationPlan.length} interview/prototype test rows for selecting one primary and one secondary ICP.`);
report.push(`- ICP recruiting bridge: ${icpRecruitingBridge.length} segment-channel rows and ${icpRecruitingMessages.length} opt-in outreach/message rows linking community/referral signals to screeners, prototype prompts, WTP probes, and evidence capture.`);
report.push(`- Prototype validation stimulus: ${prototypeScreens.size} screens across ${prototypeSegments.size} top ICP segments, with ${prototypeScorecard.length} success/kill metrics.`);
report.push(`- Strict behavior-tied avatar progression signal in top-100: ${behaviorTied}/100.`);
report.push(`- App Store review-language layer: ${rawReviews.length} reviews from ${reviewApps} top-candidate apps, mapped into ${reviewSignals.length} signal rows.`);
report.push(`- Review JTBD/pain clusters: ${reviewClusters.length} themes; top cluster is "${reviewClusters[0]?.cluster_label || 'n/a'}" with ${reviewClusters[0]?.review_rows || 'n/a'} rows.`);
report.push(`- Community/referral evidence matrix: ${communityReferralRows.length} local review/forum signal rows across ${communityReferralSummary.length} signal kinds.`);
report.push(`- Forum/source evidence map: ${forumSignals.length} qualitative rows across ${Object.keys(countBy(forumSignals, 'market')).length} market pillars.`);
report.push(`- Forum quote coding layer: ${forumQuoteCoding.length} snippet rows across ${new Set(forumQuoteCoding.map(r => r.source_id)).size} sources.`);
report.push(`- Reddit competitor mention layer: ${redditMentionRows.length} source-native forum rows across ${Object.keys(countBy(redditMentionRows, 'subreddit')).length} subreddits and ${Object.keys(countBy(redditMentionRows, 'mention_type')).length} mention types; coded into ${redditMentionSignals.length} signal rows for audience, competitor, and whitespace use.`);
report.push(`- Reddit manual-read routing: ${redditManualReadingQueue.length} unique source threads with manual tasks, interview prompt seeds, whitespace prompt seeds, and ${redditManualCaptureSheet.length} focused P0/P1 capture rows before any claim upgrade.`);
report.push('- Draft visual chart pack: whitespace bands, review clusters, SAM by pillar, SOM scenarios, forum source coverage, top-100 competitor verdicts, IAP price bands, Android pricing models, web paywall discovery, and forum quote coding.');
report.push('- Visual PDF companion: native ReportLab charts embedded in a separate visual report.');
report.push(`- Polished evidence pack: ${fs.existsSync('output/pdf/alina-polished-evidence-pack-v1.pdf') ? 'generated as a publication-ready evidence draft with validation caveats' : 'not generated yet'}.`);
report.push(`- Russian narrative report: ${fs.existsSync('output/pdf/alina-russian-narrative-report-v1.pdf') ? 'generated as a sequential Russian-language narrative PDF' : 'not generated yet'}; argument map: ${fs.existsSync('data_processed/russian_narrative_evidence_map.csv') ? 'generated' : 'not generated yet'}; Russian fieldbook: ${fs.existsSync('data_processed/russian_validation_fieldbook.csv') ? 'generated' : 'not generated yet'}.`);
report.push(`- Modeled direct intersection SAM base: USD ${baseIntersection.samBase || 'n/a'}.`);
report.push('');
report.push('## 2. Product Hypotheses');
report.push('');
report.push(mdTable([
  { id: 'H1', hypothesis: 'Product shape exists', status: 'partially supported', evidence: 'Adjacent apps combine several pillars; top-100 shows meaning/action/reset/progress language.' },
  { id: 'H2', hypothesis: 'Markets have money', status: 'supported with ranges', evidence: `TAM/SAM/SOM model and ${claims.length} market claims across gaming, astrology, avatar, coaching, mindfulness.` },
  { id: 'H3', hypothesis: 'Whitespace exists', status: 'narrowed', evidence: 'Broad space is crowded; strict behavior-tied avatar progression appears rare in top-100 metadata.' },
  { id: 'H4', hypothesis: 'Competitive advantage is plausible', status: 'unproven but sharpened', evidence: 'Moat candidate is integrated daily transformation loop, not any single feature.' },
  { id: 'H5', hypothesis: 'Shared audience exists', status: 'directionally supported', evidence: `Audience matrix plus ${reviewSignals.length} review-language signals, ${redditMentionSignals.length} coded Reddit signals, and ${icpSegments.length} ICP segment hypotheses point to digital ritual users across spirituality, identity, self-improvement, calm, and cozy progress.` },
  { id: 'H6', hypothesis: 'Product core can be defined', status: 'supported for MVP framing', evidence: 'Product-core evidence defines target loop and MVP testable claim.' }
], [
  { key: 'id', label: 'ID' },
  { key: 'hypothesis', label: 'Hypothesis' },
  { key: 'status', label: 'Status' },
  { key: 'evidence', label: 'Evidence' }
]));
report.push('');
if (evidenceAudit.length) {
  report.push('## 2B. Evidence Audit Register');
  report.push('');
  report.push('The project now has a claim-level audit register. This conservative layer separates proved project infrastructure from directional product evidence, and it names remaining validation burden explicitly.');
  report.push('');
  report.push('Evidence status mix:');
  report.push('');
  report.push(bulletCounts(countBy(evidenceAudit, 'evidence_status')));
  report.push('');
  report.push('Claim-level audit snapshot:');
  report.push('');
  report.push(mdTable(evidenceAudit, [
    { key: 'claim_id', label: 'Claim' },
    { key: 'evidence_status', label: 'Status' },
    { key: 'confidence', label: 'Confidence' },
    { key: 'primary_metric', label: 'Primary Metric' },
    { key: 'key_gap', label: 'Key Gap' }
  ], evidenceAudit.length));
  report.push('');
}
if (hypothesisDecisions.length) {
  report.push('## 2C. Hypothesis Decision Matrix');
  report.push('');
  report.push('The H1-H6 decision matrix converts the claim register into operating gates. It is deliberately conservative: open manual walkthrough, paid-flow, ICP, and prototype evidence keeps hypotheses in hold/validate instead of allowing metadata-only graduation.');
  report.push('');
  report.push('Decision mix:');
  report.push('');
  report.push(bulletCounts(countBy(hypothesisDecisions, 'current_decision')));
  report.push('');
  report.push(mdTable(hypothesisDecisions, [
    { key: 'hypothesis_id', label: 'ID' },
    { key: 'hypothesis', label: 'Hypothesis' },
    { key: 'current_decision', label: 'Decision' },
    { key: 'confidence', label: 'Confidence' },
    { key: 'primary_metric', label: 'Primary Metric' },
    { key: 'key_gap', label: 'Key Gap' },
    { key: 'next_action', label: 'Next Action' }
  ], hypothesisDecisions.length));
  report.push('');
  report.push('Go/hold/kill gate snapshot:');
  report.push('');
  report.push(mdTable(hypothesisDecisions, [
    { key: 'hypothesis_id', label: 'ID' },
    { key: 'go_gate', label: 'Go Gate' },
    { key: 'hold_gate', label: 'Hold Gate' },
    { key: 'kill_gate', label: 'Kill/Pivot Gate' }
  ], hypothesisDecisions.length));
  report.push('');
}
if (p0CommandCenter.length) {
  report.push('## 2D. P0 Validation Command Center');
  report.push('');
  report.push('The command center turns open gates into concrete operator rows. It is the bridge from research package to actual validation: every row names what to capture, what would pass, what would downgrade or kill, which source files support it, and which output files must be updated.');
  report.push('');
  report.push('Command rows by lane:');
  report.push('');
  report.push(bulletCounts(countBy(p0CommandCenter, 'lane')));
  report.push('');
  report.push('Command rows by priority:');
  report.push('');
  report.push(bulletCounts(countBy(p0CommandCenter, 'priority')));
  report.push('');
  report.push('Blocker commands first:');
  report.push('');
  report.push(mdTable(p0CommandBlockers, [
    { key: 'command_id', label: 'Command' },
    { key: 'lane', label: 'Lane' },
    { key: 'target', label: 'Target' },
    { key: 'linked_hypotheses', label: 'Hypotheses' },
    { key: 'next_operator_action', label: 'Next Action' }
  ], p0CommandBlockers.length));
  report.push('');
}
if (p0FieldGuide.length) {
  report.push('## 2E. P0 Validation Field Guide');
  report.push('');
  report.push('The field guide turns command rows into executable scripts. It covers evidence handling, naming conventions, competitor walkthrough, paid-flow signoff, ICP interviews, prototype sessions, scorecard calculation, and post-validation rebuild/commit protocol.');
  report.push('');
  report.push('Guide sections by lane:');
  report.push('');
  report.push(bulletCounts(countBy(p0FieldGuide, 'lane')));
  report.push('');
  report.push(mdTable(p0FieldGuide, [
    { key: 'section_id', label: 'ID' },
    { key: 'lane', label: 'Lane' },
    { key: 'title', label: 'Title' },
    { key: 'objective', label: 'Objective' },
    { key: 'evidence_to_capture', label: 'Evidence To Capture' }
  ], p0FieldGuide.length));
  report.push('');
}
if (validationWorkspace.length) {
  report.push('## 2F. Validation Evidence Workspace');
  report.push('');
  report.push('The validation workspace creates local intake folders and note templates under `output/validation/`. It is designed to keep screenshots, participant notes, paid-flow signoff, and scorecard calculations linked back to `command_id` before any claim is upgraded.');
  report.push('');
  report.push(mdTable(validationWorkspace, [
    { key: 'lane', label: 'Lane' },
    { key: 'workspace_dir', label: 'Workspace Dir' },
    { key: 'command_rows', label: 'Commands', align: 'right' },
    { key: 'p0_blockers', label: 'Blockers', align: 'right' },
    { key: 'template_file', label: 'Template' }
  ], validationWorkspace.length));
  report.push('');
}
if (validationBatch01.length) {
  report.push('## 2G. Validation Batch 01');
  report.push('');
  report.push('Batch 01 pre-creates note files for every P0 blocker command. These notes are the first files to fill before H1/H3/H4/H6 can be upgraded, downgraded, or killed.');
  report.push('');
  report.push(mdTable(validationBatch01, [
    { key: 'batch_rank', label: '#', align: 'right' },
    { key: 'command_id', label: 'Command' },
    { key: 'lane', label: 'Lane' },
    { key: 'target', label: 'Target' },
    { key: 'note_path', label: 'Note Path' }
  ], validationBatch01.length));
  report.push('');
}
if (validationBatch02.length) {
  report.push('## 2H. Validation Batch 02');
  report.push('');
  report.push('Batch 02 pre-creates note files for every non-blocker P0 command. It expands the workbench from six blocker gates into the full P0 breadth while still keeping every row in not_started until observed evidence is captured.');
  report.push('');
  report.push('Rows by lane:');
  report.push('');
  report.push(bulletCounts(countBy(validationBatch02, 'lane')));
  report.push('');
  report.push(mdTable(validationBatch02, [
    { key: 'batch_rank', label: '#', align: 'right' },
    { key: 'command_id', label: 'Command' },
    { key: 'lane', label: 'Lane' },
    { key: 'target', label: 'Target' },
    { key: 'note_path', label: 'Note Path' }
  ], validationBatch02.length));
  report.push('');
}
if (validationBatch03.length) {
  report.push('## 2I. Validation Batch 03');
  report.push('');
  report.push('Batch 03 pre-creates note files for every P1_context command. In the current command center, this is the paid-flow context lane: useful for monetization confidence and conservative downgrades, but not a substitute for P0 validation.');
  report.push('');
  report.push(mdTable(validationBatch03, [
    { key: 'batch_rank', label: '#', align: 'right' },
    { key: 'command_id', label: 'Command' },
    { key: 'lane', label: 'Lane' },
    { key: 'target', label: 'Target' },
    { key: 'note_path', label: 'Note Path' }
  ], validationBatch03.length));
  report.push('');
}
if (validationEvidenceRollup.length) {
  report.push('## 2J. Validation Evidence Rollup');
  report.push('');
  report.push('The rollup audits the full validation intake layer at command level. It proves note coverage and local artifact link status without pretending that linked screenshots are final human signoff.');
  report.push('');
  report.push('Evidence state mix:');
  report.push('');
  report.push(bulletCounts(countBy(validationEvidenceRollup, 'evidence_state')));
  report.push('');
  report.push(mdTable(Object.entries(countBy(validationEvidenceRollup, 'lane')).map(([lane, total]) => {
    const laneRows = validationEvidenceRollup.filter(row => row.lane === lane);
    return {
      lane,
      total,
      local_artifact_linked: laneRows.filter(row => row.evidence_state === 'local_artifact_linked_not_signed_off').length,
      note_ready_no_local_artifact: laneRows.filter(row => row.evidence_state === 'note_ready_no_local_artifact').length,
      missing_batch_note: laneRows.filter(row => row.evidence_state === 'missing_batch_note').length
    };
  }), [
    { key: 'lane', label: 'Lane' },
    { key: 'total', label: 'Total', align: 'right' },
    { key: 'local_artifact_linked', label: 'Local Artifact Linked', align: 'right' },
    { key: 'note_ready_no_local_artifact', label: 'Note Ready Only', align: 'right' },
    { key: 'missing_batch_note', label: 'Missing', align: 'right' }
  ], 10));
  report.push('');
}
if (validationTranchePlanner.length) {
  report.push('## 2K. Validation Tranche Planner');
  report.push('');
  report.push('The tranche planner sequences manual validation so the project does not burn time on broad capture before the highest-risk blockers are resolved. It starts with stop rules and hidden-clone inspection, then moves into top-five competitor walkthrough, paid-flow signoff, ICP/prototype pilots, Reddit language reads, and only then broader execution.');
  report.push('');
  report.push(mdTable(validationTranchePlanner, [
    { key: 'sequence', label: 'Seq', align: 'right' },
    { key: 'tranche_id', label: 'Tranche' },
    { key: 'priority', label: 'Priority' },
    { key: 'workstream_mix', label: 'Workstream' },
    { key: 'row_count', label: 'Rows', align: 'right' },
    { key: 'operator_goal_ru', label: 'Operator Goal' },
    { key: 'stop_or_downgrade_rule_ru', label: 'Stop/Downgrade' }
  ], validationTranchePlanner.length));
  report.push('');
}
if (validationGateCalculator.length) {
  report.push('## 2L. Validation Gate Calculator');
  report.push('');
  report.push('The gate calculator turns capture-sheet rows into H1-H6 readiness status. This is the anti-overclaiming layer: a gate can move only when observed screenshots, quotes, scores, or human signoff have been entered.');
  report.push('');
  report.push('Gate status mix:');
  report.push('');
  report.push(bulletCounts(countBy(validationGateCalculator, 'gate_status')));
  report.push('');
  report.push(mdTable(validationGateCalculator, [
    { key: 'gate_id', label: 'Gate' },
    { key: 'linked_hypotheses', label: 'Hypotheses' },
    { key: 'workstream', label: 'Workstream' },
    { key: 'gate_status', label: 'Status' },
    { key: 'required_capture_rows', label: 'Required', align: 'right' },
    { key: 'completed_rows', label: 'Completed', align: 'right' },
    { key: 'success_rows', label: 'Success', align: 'right' },
    { key: 'current_decision_effect', label: 'Decision Effect' }
  ], validationGateCalculator.length));
  report.push('');
  report.push('Status summary:');
  report.push('');
  report.push(mdTable(validationGateStatusSummary, [
    { key: 'gate_status', label: 'Status' },
    { key: 'row_count', label: 'Gates', align: 'right' },
    { key: 'linked_hypotheses', label: 'Hypotheses' },
    { key: 'total_required_capture_rows', label: 'Required Capture Rows', align: 'right' },
    { key: 'total_completed_rows', label: 'Completed Capture Rows', align: 'right' }
  ], validationGateStatusSummary.length));
  report.push('');
}
if (evidenceManifest.length) {
  report.push('## 2L. Evidence Package Manifest');
  report.push('');
  report.push('The repository now includes a package manifest for traceability. It is a reproducibility layer: it records key raw data, processed data, docs, reports, charts, PDFs, and generator scripts with row counts, source-reference coverage, sizes, and short hashes.');
  report.push('');
  report.push(`Manifest snapshot: ${evidenceManifest.length} artifacts; ${manifestCsvRows.length} CSV artifacts; ${manifestTrackedRows} tracked CSV rows; ${manifestMissing.length} missing required artifacts.`);
  report.push(`Validation note artifact links: ${validationBatchPrefilledLocalArtifacts} existing local artifacts linked inside batch notes.`);
  report.push('');
  report.push('Largest tracked CSV artifacts:');
  report.push('');
  report.push(mdTable(manifestCsvRows
    .slice()
    .sort((a, b) => Number(b.row_count || 0) - Number(a.row_count || 0))
    .slice(0, 12), [
      { key: 'file_path', label: 'File' },
      { key: 'evidence_role', label: 'Role' },
      { key: 'row_count', label: 'Rows', align: 'right' },
      { key: 'source_ref_rows', label: 'Source Ref Rows', align: 'right' },
      { key: 'sha256', label: 'Hash' }
    ], 12));
  report.push('');
}
if (completionAudit.length) {
  report.push('## 2M. Research Completion Audit');
  report.push('');
  report.push('The completion audit maps the original objective to current proof. It is intentionally conservative: several requirements are strong enough for continued validation, but not yet final enough to call the whole goal complete.');
  report.push('');
  report.push('Completion status mix:');
  report.push('');
  report.push(bulletCounts(countBy(completionAudit, 'status')));
  report.push('');
  report.push('Objective readiness matrix:');
  report.push('');
  report.push(mdTable(completionAudit, [
    { key: 'requirement_id', label: 'Requirement' },
    { key: 'status', label: 'Status' },
    { key: 'evidence_strength', label: 'Strength' },
    { key: 'proof', label: 'Proof' },
    { key: 'remaining_gap', label: 'Remaining Gap' }
  ], completionAudit.length));
  report.push('');
}
if (validationGapRoadmap.length) {
  report.push('## 2N. Validation Gap Roadmap');
  report.push('');
  report.push('The research now includes a validation roadmap that turns current evidence gaps into explicit success gates. This keeps the project honest: a claim is not final merely because a table exists.');
  report.push('');
  report.push('Validation priority mix:');
  report.push('');
  report.push(bulletCounts(countBy(validationGapRoadmap, 'priority')));
  report.push('');
  report.push('Market-level validation roadmap:');
  report.push('');
  report.push(mdTable(validationGapRoadmap.filter(r => r.roadmap_type === 'market_validation'), [
    { key: 'market', label: 'Market' },
    { key: 'evidence_band', label: 'Evidence Band' },
    { key: 'priority', label: 'Priority' },
    { key: 'main_gap', label: 'Main Gap' },
    { key: 'recommended_next_action', label: 'Next Action' },
    { key: 'success_gate', label: 'Success Gate' }
  ], 5));
  report.push('');
  report.push('P0 hypothesis gates:');
  report.push('');
  report.push(mdTable(validationGapRoadmap.filter(r => r.roadmap_type === 'hypothesis_validation' && r.priority === 'P0'), [
    { key: 'roadmap_id', label: 'Hypothesis' },
    { key: 'evidence_band', label: 'Evidence Band' },
    { key: 'main_gap', label: 'Gap' },
    { key: 'success_gate', label: 'Success Gate' }
  ], 8));
  report.push('');
}
if (validationExecutionDashboard.length) {
  report.push('### Validation Execution Dashboard');
  report.push('');
  report.push('The roadmap is now backed by an execution dashboard: concrete tasks, exact evidence to capture, success gates, downgrade gates, source files, and target files to update. Every row remains not_started until direct observed evidence is added.');
  report.push('');
  report.push(mdTable(validationExecutionDashboard, [
    { key: 'execution_rank', label: 'Rank', align: 'right' },
    { key: 'priority', label: 'Priority' },
    { key: 'workstream', label: 'Workstream' },
    { key: 'task', label: 'Task' },
    { key: 'success_gate', label: 'Success Gate' },
    { key: 'output_file_to_update', label: 'Update' }
  ], validationExecutionDashboard.length));
  report.push('');
}
if (validationCaptureRows) {
  report.push('### Validation Capture Sheets');
  report.push('');
  report.push('The execution dashboard is now backed by fillable capture sheets. This is the handoff layer for manual evidence: each row names the slot, status, expected screenshot/quote/observation, and the claim file that must be updated after evidence is collected.');
  report.push('');
  report.push(mdTable([
    { sheet: 'manual_walkthrough_capture_sheet.csv', rows: manualWalkthroughCapture.length, purpose: 'P0 app walkthrough screenshots by app and slot' },
    { sheet: 'paid_flow_capture_sheet.csv', rows: paidFlowCapture.length, purpose: 'Human paid-flow signoff by app and evidence slot' },
    { sheet: 'icp_interview_capture_sheet.csv', rows: icpInterviewCapture.length, purpose: 'Top-two ICP interview capture by participant and test' },
    { sheet: 'prototype_session_capture_sheet.csv', rows: prototypeSessionCapture.length, purpose: 'Two-minute prototype observations by segment, participant, and screen' },
    { sheet: 'reddit_manual_reading_capture_sheet.csv', rows: redditManualCaptureSheet.length, purpose: 'P0/P1 Reddit thread read capture with quote and claim-upgrade guardrails' }
  ], [
    { key: 'sheet', label: 'Sheet' },
    { key: 'rows', label: 'Rows', align: 'right' },
    { key: 'purpose', label: 'Purpose' }
  ]));
  report.push('');
}
if (icpRecruitingBridge.length) {
  report.push('### ICP Recruiting Bridge');
  report.push('');
  report.push('The ICP layer now has a practical bridge from evidence to fieldwork. Each row links a segment to a recruiting-channel hypothesis, matching community/referral signal counts, screener language, qualifying/disqualifying signals, prototype prompt, WTP probe, linked validation tests, and ethical constraints.');
  report.push('');
  report.push('Bridge rows by segment:');
  report.push('');
  report.push(bulletCounts(countBy(icpRecruitingBridge, 'segment_name')));
  report.push('');
  report.push('Bridge rows by source signal kind:');
  report.push('');
  report.push(bulletCounts(countBy(icpRecruitingBridge, 'source_signal_kind')));
  report.push('');
  report.push(mdTable(icpRecruitingBridge
    .slice()
    .sort((a, b) => Number(b.matched_community_signal_rows || 0) - Number(a.matched_community_signal_rows || 0)), [
      { key: 'bridge_id', label: 'Bridge' },
      { key: 'segment_name', label: 'Segment' },
      { key: 'priority', label: 'Priority' },
      { key: 'matched_community_signal_rows', label: 'Matched Rows', align: 'right' },
      { key: 'recruiting_channel_hypothesis', label: 'Channel Hypothesis' },
      { key: 'qualifying_signal', label: 'Qualifying Signal' }
    ], 16));
  report.push('');
  report.push(`Message bank rows: ${icpRecruitingMessages.length}. These are transparent opt-in research invites, not channel proof and not a license for scraped/private outreach.`);
  report.push('');
}
if (marketMoneyTriangulation.length) {
  report.push('## 2O. Market Money Triangulation');
  report.push('');
  report.push('The market-money layer now triangulates TAM/SAM/SOM, source confidence, stress-test posture, monetization proxies, competitor revenue proxies, public paywall screenshots, and the H2 validation gate. It is a prioritization and confidence layer, not a final revenue estimate.');
  report.push('');
  report.push('Verdict mix:');
  report.push('');
  report.push(bulletCounts(countBy(marketMoneyTriangulation, 'money_triangulation_verdict')));
  report.push('');
  report.push(mdTable(marketMoneyTriangulation, [
    { key: 'pillar', label: 'Pillar' },
    { key: 'directness', label: 'Directness' },
    { key: 'sam_base_usd', label: 'SAM Base', align: 'right' },
    { key: 'total_money_evidence_score', label: 'Score', align: 'right' },
    { key: 'risk_penalty', label: 'Risk', align: 'right' },
    { key: 'money_triangulation_verdict', label: 'Verdict' },
    { key: 'h2_gate_status', label: 'H2 Gate' },
    { key: 'recommended_next_proof', label: 'Next Proof' }
  ], marketMoneyTriangulation.length));
  report.push('');
  report.push('Summary by verdict:');
  report.push('');
  report.push(mdTable(marketMoneyTriangulationSummary, [
    { key: 'money_triangulation_verdict', label: 'Verdict' },
    { key: 'row_count', label: 'Markets', align: 'right' },
    { key: 'markets', label: 'Pillars' },
    { key: 'avg_money_evidence_score', label: 'Avg Score', align: 'right' }
  ], marketMoneyTriangulationSummary.length));
  report.push('');
}
report.push('## 3. Dataset Overview');
report.push('');
report.push('### Expanded Rows by Niche');
report.push('');
report.push(bulletCounts(countBy(expanded, 'niche')));
report.push('');
report.push('### Expanded Rows by Source Kind');
report.push('');
report.push(bulletCounts(countBy(expanded, 'source_kind')));
report.push('');
if (sourceExpansionBacklog.length) {
  report.push('### Next Source Expansion Backlog');
  report.push('');
  report.push('The next collector wave is now prioritized so expansion beyond the current universe is concrete rather than generic. P0 focuses on Product Hunt, AlternativeTo, and Chrome Web Store/browser extensions to reduce app-store bias.');
  report.push('');
  report.push('Backlog priority mix:');
  report.push('');
  report.push(bulletCounts(countBy(sourceExpansionBacklog, 'priority')));
  report.push('');
  report.push(mdTable(sourceExpansionBacklog, [
    { key: 'backlog_id', label: 'ID' },
    { key: 'priority', label: 'Priority' },
    { key: 'source_bucket', label: 'Source' },
    { key: 'expected_raw_rows', label: 'Expected Rows' },
    { key: 'target_output', label: 'Output' }
  ], sourceExpansionBacklog.length));
  report.push('');
}
if (p0ExternalSources.length) {
  report.push('### Controlled P0 External Source Smoke Pass');
  report.push('');
  report.push('A small P0 pass was run to test external discovery beyond mobile stores without turning the research into a broad search-engine crawl. Chrome Web Store produced usable browser-extension candidates; Product Hunt and AlternativeTo attempts are retained as empty-attempt evidence and should be revisited through source-native or curated methods.');
  report.push('');
  report.push(mdTable(p0ExternalSummary, [
    { key: 'source_bucket', label: 'Source' },
    { key: 'raw_rows', label: 'Raw Rows', align: 'right' },
    { key: 'usable_rows', label: 'Usable', align: 'right' },
    { key: 'empty_or_error_rows', label: 'Empty/Error', align: 'right' },
    { key: 'markets', label: 'Markets' },
    { key: 'top_examples', label: 'Examples' }
  ], p0ExternalSummary.length));
  report.push('');
}
if (itchRows.length) {
  report.push('### Source-Native Itch.io Expansion');
  report.push('');
  report.push(`A controlled itch.io tag-page collector adds ${itchRows.length} rows, including ${itchOk.length} OK rows. This layer is useful for gaming/progression, mindfulness, and avatar/identity mechanic discovery, but it is not treated as direct market-share proof.`);
  report.push('');
  report.push('Itch rows by market:');
  report.push('');
  report.push(bulletCounts(countBy(itchRows, 'niche')));
  report.push('');
  report.push('Itch summary:');
  report.push('');
  report.push(mdTable(itchSummary, [
    { key: 'niche', label: 'Market' },
    { key: 'core_features', label: 'Rows / OK' },
    { key: 'evidence_quality', label: 'Quality' }
  ], itchSummary.length));
  report.push('');
}
if (steamTagRows.length) {
  report.push('### Source-Native Steam Tag Expansion');
  report.push('');
  report.push(`A controlled Steam tag collector adds ${steamTagRows.length} rows, including ${steamTagOk.length} OK rows. This layer expands PC progression, cozy, idle, RPG, avatar/identity, and relaxing-game benchmarks. It is mechanic/saturation evidence, not direct mobile wellness market proof.`);
  report.push('');
  report.push('Steam tag rows by market:');
  report.push('');
  report.push(bulletCounts(countBy(steamTagRows, 'niche')));
  report.push('');
  report.push('Steam tag summary:');
  report.push('');
  report.push(mdTable(steamTagSummary, [
    { key: 'niche', label: 'Market' },
    { key: 'core_features', label: 'Rows / OK' },
    { key: 'evidence_quality', label: 'Quality' }
  ], steamTagSummary.length));
  report.push('');
}
if (desktopStoreRows.length) {
  report.push('### Source-Native Desktop Store Expansion');
  report.push('');
  report.push(`A Mac App Store/iTunes Search API collector adds ${desktopStoreRows.length} rows, including ${desktopStoreOk.length} OK rows. This layer improves PC/desktop coverage for coaching, mindfulness, avatar/identity, astrology/esoterics, and gaming/progression, but it remains discovery/mechanic evidence until manual validation.`);
  report.push('');
  report.push('Desktop rows by market:');
  report.push('');
  report.push(bulletCounts(countBy(desktopStoreRows, 'niche')));
  report.push('');
  report.push('Desktop store summary:');
  report.push('');
  report.push(mdTable(desktopStoreSummary, [
    { key: 'niche', label: 'Market' },
    { key: 'core_features', label: 'Rows / OK / Unique / Paid' },
    { key: 'retention_mechanics', label: 'Top Categories' },
    { key: 'personalization_tags', label: 'Feature Tags' }
  ], desktopStoreSummary.length));
  report.push('');
}
if (redditMentionRows.length) {
  report.push('### Source-Native Reddit Forum Mention Expansion');
  report.push('');
  report.push(`An old.reddit public-search collector adds ${redditMentionRows.length} rows, including ${redditMentionOk.length} known-app mention rows. This layer improves forum/source coverage for competitor discovery, unmet-need language, alternatives, and objections. It is qualitative discovery evidence, not representative demand or market-share proof.`);
  report.push('');
  report.push('Reddit mention rows by market:');
  report.push('');
  report.push(bulletCounts(countBy(redditMentionRows, 'niche')));
  report.push('');
  report.push('Reddit mention rows by type:');
  report.push('');
  report.push(bulletCounts(countBy(redditMentionRows, 'mention_type')));
  report.push('');
  report.push('Reddit mention summary:');
  report.push('');
  report.push(mdTable(redditMentionSummary, [
    { key: 'summary_type', label: 'Type' },
    { key: 'bucket', label: 'Bucket' },
    { key: 'count', label: 'Rows', align: 'right' }
  ], 18));
  report.push('');
}
if (redditMentionSignals.length) {
  report.push('### Reddit Mention Signal Coding');
  report.push('');
  report.push(`The Reddit raw layer is now coded into ${redditMentionSignals.length} qualitative signal rows and ${redditMentionAppSummary.length} app summaries. The coding routes threads into competitor substitution, pain/rejection, habit-progress, identity/avatar, emotional reset, spiritual guidance, gamified progression, pricing sensitivity, and unclassified-context buckets. This keeps the layer useful for ICP scripts and whitespace analysis while preserving the boundary that Reddit rows are not representative demand proof.`);
  report.push('');
  report.push('Coded Reddit signal groups:');
  report.push('');
  report.push(bulletCounts(countBy(redditMentionSignals, 'signal_group')));
  report.push('');
  report.push('Top Reddit app mention summaries:');
  report.push('');
  report.push(mdTable(redditMentionAppSummary, [
    { key: 'app_name', label: 'App' },
    { key: 'mention_rows', label: 'Rows', align: 'right' },
    { key: 'unique_subreddits', label: 'Subreddits', align: 'right' },
    { key: 'top_signal_groups', label: 'Top Signals' },
    { key: 'evidence_strength', label: 'Evidence Strength' }
  ], 20));
  report.push('');
}
if (redditManualReadingQueue.length) {
  report.push('### Reddit Manual Reading Queue');
  report.push('');
  report.push(`The coded Reddit layer now routes into ${redditManualReadingQueue.length} unique thread reads. ${redditManualP0.length} are P0 read-first items and ${redditManualP1.length} are P1 read-next items. The P0/P1 slice also has ${redditManualCaptureSheet.length} fillable capture rows, all defaulting to unread/do-not-upgrade. Each queued row has a manual task, ICP interview prompt seed, whitespace prompt seed, capture fields, and an explicit claim boundary so the team does not accidentally treat Reddit volume as representative demand proof.`);
  report.push('');
  report.push('Manual reading lanes:');
  report.push('');
  report.push(mdTable(redditManualPromptBank, [
    { key: 'queue_lane', label: 'Lane' },
    { key: 'row_count', label: 'Rows', align: 'right' },
    { key: 'p0_rows', label: 'P0', align: 'right' },
    { key: 'p1_rows', label: 'P1', align: 'right' },
    { key: 'top_icp_segments', label: 'Top ICP' },
    { key: 'interview_prompt_seed', label: 'Interview Prompt' }
  ], redditManualPromptBank.length));
  report.push('');
  report.push('Top P0 Reddit reads:');
  report.push('');
  report.push(mdTable(redditManualReadingQueue.slice(0, 15), [
    { key: 'priority_rank', label: 'Rank', align: 'right' },
    { key: 'queue_lane', label: 'Lane' },
    { key: 'app_names', label: 'Apps' },
    { key: 'thread_title', label: 'Thread' },
    { key: 'manual_read_task', label: 'Manual Task' }
  ], 15));
  report.push('');
}
if (crossSourceDedup.length) {
  report.push('### Cross-Source Universe Normalization');
  report.push('');
  report.push(`The source-native collections are now normalized into one auditable universe: ${crossSourceRaw.length} raw rows and ${crossSourceDedup.length} cross-source dedup rows. This protects the research from double-counting repeated country, query, and tag results while preserving provenance.`);
  report.push('');
  report.push('Cross-source summary:');
  report.push('');
  report.push(mdTable(crossSourceSummary.filter(r => r.summary_type === 'source_group'), [
    { key: 'segment', label: 'Source Group' },
    { key: 'raw_rows', label: 'Raw Rows', align: 'right' },
    { key: 'dedup_rows', label: 'Dedup Rows', align: 'right' },
    { key: 'ok_rows', label: 'OK Rows', align: 'right' },
    { key: 'top_niches', label: 'Top Niches' }
  ], 12));
  report.push('');
}
if (crossSourceCoverage.length) {
  report.push('### Cross-Source Coverage Matrix');
  report.push('');
  report.push('The normalized universe now has a source-by-market coverage matrix. This is the interpretation layer that says which cells are strong enough for discovery/triangulation, and which should stay thin/context-only until expanded or manually sampled.');
  report.push('');
  report.push('Coverage band mix:');
  report.push('');
  report.push(bulletCounts(countBy(crossSourceCoverage, 'coverage_band')));
  report.push('');
  report.push('Strongest coverage cells:');
  report.push('');
  report.push(mdTable(crossSourceCoverage.filter(r => r.coverage_band === 'strong_coverage').slice(0, 10), [
    { key: 'source_group', label: 'Source' },
    { key: 'niche', label: 'Market' },
    { key: 'dedup_rows', label: 'Dedup', align: 'right' },
    { key: 'ok_rate_pct', label: 'OK %', align: 'right' },
    { key: 'market_role', label: 'Role' }
  ], 10));
  report.push('');
}
if (crossSourceSaturation.length) {
  report.push('### Cross-Source Saturation And Whitespace');
  report.push('');
  report.push('The cross-source universe now has a market-level saturation read. It deliberately keeps gaming/progression as benchmark-only when the evidence is mostly mechanic/saturation evidence, not direct Alina consumer-market proof.');
  report.push('');
  report.push(mdTable(crossSourceSaturation, [
    { key: 'niche', label: 'Market' },
    { key: 'cross_source_dedup_rows', label: 'Dedup Rows', align: 'right' },
    { key: 'strong_medium_coverage_cells', label: 'Strong/Medium Cells', align: 'right' },
    { key: 'full_loop_like_candidates', label: 'Full-Loop-Like', align: 'right' },
    { key: 'full_loop_scarcity_score', label: 'Scarcity', align: 'right' },
    { key: 'opportunity_band', label: 'Opportunity Band' }
  ], crossSourceSaturation.length));
  report.push('');
}
if (chromeExtensionFit.length) {
  report.push('### Chrome Extension Detail Enrichment');
  report.push('');
  report.push('The Chrome Web Store smoke-pass candidates were enriched from their own detail pages only. This creates a small, higher-quality browser-mechanic reference layer without broad search expansion.');
  report.push('');
  report.push('Fit band mix:');
  report.push('');
  report.push(bulletCounts(countBy(chromeExtensionFit, 'alina_fit_band')));
  report.push('');
  report.push(mdTable(chromeExtensionFit
    .slice()
    .sort((a, b) => Number(b.fit_score || 0) - Number(a.fit_score || 0))
    .slice(0, 12), [
      { key: 'app_name', label: 'Candidate' },
      { key: 'alina_fit_band', label: 'Fit' },
      { key: 'fit_score', label: 'Score', align: 'right' },
      { key: 'users', label: 'Users', align: 'right' },
      { key: 'rating', label: 'Rating', align: 'right' },
      { key: 'feature_tags', label: 'Feature Tags' }
    ], 12));
  report.push('');
}
if (chromeExtensionBattlecards.length) {
  report.push('### Chrome Extension Mechanic Battlecards');
  report.push('');
  report.push('The enriched Chrome candidates are converted into mechanic battlecards. This layer is deliberately interpretive: it identifies what a browser extension proves about habits, progress, accountability, and AI feedback, then separates mechanic inspiration from direct competitive threat.');
  report.push('');
  report.push('Threat/reference band mix:');
  report.push('');
  report.push(bulletCounts(countBy(chromeExtensionBattlecards, 'threat_band')));
  report.push('');
  report.push('Core mechanic mix:');
  report.push('');
  report.push(bulletCounts(countBy(chromeExtensionBattlecards, 'core_mechanic')));
  report.push('');
  report.push(mdTable(chromeExtensionBattlecards.slice(0, 10), [
    { key: 'app_name', label: 'Candidate' },
    { key: 'threat_band', label: 'Threat/Reference' },
    { key: 'core_mechanic', label: 'Mechanic' },
    { key: 'alina_lesson', label: 'Alina Lesson' },
    { key: 'whitespace_implication', label: 'Whitespace Implication' }
  ], 10));
  report.push('');
}
report.push('## 4. Market Sizing');
report.push('');
report.push('The model intentionally avoids adding five TAMs together. Gaming is treated primarily as a mechanic benchmark; direct SAM is modeled from discounted adjacent consumer app markets.');
report.push('');
report.push(mdTable(tam, [
  { key: 'pillar', label: 'Pillar' },
  { key: 'tamLow', label: 'TAM Low', align: 'right' },
  { key: 'tamBase', label: 'TAM Base', align: 'right' },
  { key: 'tamHigh', label: 'TAM High', align: 'right' },
  { key: 'samLow', label: 'SAM Low', align: 'right' },
  { key: 'samBase', label: 'SAM Base', align: 'right' },
  { key: 'samHigh', label: 'SAM High', align: 'right' },
  { key: 'confidence', label: 'Confidence' }
]));
report.push('');
if (marketConfidenceSummary.length) {
  report.push('### Market Source Confidence');
  report.push('');
  report.push('The TAM/SAM/SOM layer now has a source-confidence review. This does not make the model final; it makes explicit which sources are direct anchors, broad benchmarks, or range-only context.');
  report.push('');
  report.push(mdTable(marketConfidenceSummary, [
    { key: 'niche', label: 'Market' },
    { key: 'source_count', label: 'Sources', align: 'right' },
    { key: 'claim_count', label: 'Claims', align: 'right' },
    { key: 'market_confidence_summary', label: 'Confidence Summary' },
    { key: 'confidence_band_mix', label: 'Source Mix' },
    { key: 'key_interpretation', label: 'Interpretation' }
  ], marketConfidenceSummary.length));
  report.push('');
  report.push('Highest-use market sources:');
  report.push('');
  report.push(mdTable(marketSourceConfidence
    .slice()
    .sort((a, b) => Number(b.confidence_review_score || 0) - Number(a.confidence_review_score || 0))
    .slice(0, 8), [
      { key: 'source_id', label: 'Source' },
      { key: 'niche', label: 'Market' },
      { key: 'publisher', label: 'Publisher' },
      { key: 'confidence_review_band', label: 'Band' },
      { key: 'confidence_review_score', label: 'Score', align: 'right' },
      { key: 'model_role', label: 'Model Role' }
    ], 8));
  report.push('');
}
if (marketAssumptionAudit.length && marketStressTest.length) {
  report.push('### Market Sizing Stress Test');
  report.push('');
  report.push('The model now includes an assumption audit and stress-test layer. It does not add new TAM claims; it checks how much the current model depends on source confidence, intersection discounts, reachable users, activation, paid conversion, and ARPPU.');
  report.push('');
  report.push('Model-risk audit:');
  report.push('');
  report.push(mdTable(marketAssumptionAudit, [
    { key: 'pillar', label: 'Pillar' },
    { key: 'sam_base', label: 'SAM Base', align: 'right' },
    { key: 'sam_spread_ratio', label: 'Spread', align: 'right' },
    { key: 'model_confidence', label: 'Confidence' },
    { key: 'monetization_proxy_band', label: 'Money Proxy' },
    { key: 'strong_competitor_money_proxy', label: 'Strong Competitors', align: 'right' },
    { key: 'model_risk', label: 'Risk' }
  ], marketAssumptionAudit.length));
  report.push('');
  report.push('Bottom-up stress scenarios:');
  report.push('');
  report.push(mdTable(marketStressTest, [
    { key: 'scenario_family', label: 'Scenario' },
    { key: 'intersection_discount', label: 'Intersection Discount', align: 'right' },
    { key: 'reachable_users', label: 'Reachable Users', align: 'right' },
    { key: 'paid_conversion', label: 'Paid Conversion', align: 'right' },
    { key: 'arppu_year', label: 'ARPPU', align: 'right' },
    { key: 'annual_revenue', label: 'Annual Revenue', align: 'right' },
    { key: 'stress_read', label: 'Read' }
  ], marketStressTest.length));
  report.push('');
}
if (monetizationProxy.length) {
  report.push('### Monetization Proxy Matrix');
  report.push('');
  report.push('Market reports show top-down demand, but H2 also needs bottom-up evidence that adjacent users encounter paid surfaces. This matrix summarizes observed App Store IAP, Google Play IAP, and public web paywall signals from the current competitor evidence.');
  report.push('');
  report.push(mdTable(monetizationProxy, [
    { key: 'market', label: 'Market' },
    { key: 'monetization_proxy_band', label: 'Proxy Band' },
    { key: 'app_store_iap_apps', label: 'App Store IAP Apps', align: 'right' },
    { key: 'app_store_subscription_like_apps', label: 'Subscription-like', align: 'right' },
    { key: 'google_play_iap_apps', label: 'Google Play IAP', align: 'right' },
    { key: 'web_medium_high_paywall_domains', label: 'Web Paywall Domains', align: 'right' },
    { key: 'max_observed_price_usd', label: 'Max Observed Price', align: 'right' },
    { key: 'interpretation', label: 'Interpretation' }
  ], monetizationProxy.length));
  report.push('');
  report.push('Highest-signal monetization examples:');
  report.push('');
  report.push(mdTable(monetizationExamples.slice(0, 12), [
    { key: 'source_layer', label: 'Layer' },
    { key: 'market', label: 'Market' },
    { key: 'app_name', label: 'App' },
    { key: 'observed_price_signal', label: 'Price Signal' },
    { key: 'evidence_quality', label: 'Evidence' },
    { key: 'interpretation', label: 'Interpretation' }
  ], 12));
  report.push('');
}
if (competitorRevenueProxy.length) {
  report.push('### Competitor Revenue Proxy Review');
  report.push('');
  report.push(`A bottom-up competitor revenue proxy layer reviews ${competitorRevenueProxy.length} primary competitors using public App Store IAP, review depth, Google Play pricing/install context, top-100 scorecard fields, and web-paywall signals. It does not estimate actual revenue; it identifies visible paid behavior and demand-depth proxies for TAM/SAM/SOM sanity checks.`);
  report.push('');
  report.push('Revenue proxy bands:');
  report.push('');
  report.push(bulletCounts(countBy(competitorRevenueProxy, 'revenue_proxy_band')));
  report.push('');
  report.push('Market-level bottom-up read:');
  report.push('');
  report.push(mdTable(competitorRevenueProxySummary, [
    { key: 'market', label: 'Market' },
    { key: 'reviewed_competitors', label: 'Reviewed', align: 'right' },
    { key: 'strong_proxy_competitors', label: 'Strong', align: 'right' },
    { key: 'medium_or_stronger_proxy_competitors', label: 'Medium+', align: 'right' },
    { key: 'observed_iap_competitors', label: 'IAP Apps', align: 'right' },
    { key: 'max_observed_price_usd', label: 'Max Price', align: 'right' },
    { key: 'market_money_read', label: 'Read' }
  ], competitorRevenueProxySummary.length));
  report.push('');
  report.push('Highest bottom-up money proxies:');
  report.push('');
  report.push(mdTable(competitorRevenueProxy.slice(0, 15), [
    { key: 'app_name', label: 'App' },
    { key: 'market', label: 'Market' },
    { key: 'competitive_verdict', label: 'Verdict' },
    { key: 'review_count', label: 'Reviews', align: 'right' },
    { key: 'observed_iap_count', label: 'IAP', align: 'right' },
    { key: 'observed_max_price_usd', label: 'Max Price', align: 'right' },
    { key: 'revenue_proxy_score', label: 'Score', align: 'right' },
    { key: 'revenue_proxy_band', label: 'Band' }
  ], 15));
  report.push('');
}
report.push('### SOM Sensitivity');
report.push('');
report.push(mdTable(som, [
  { key: 'scenario', label: 'Scenario' },
  { key: 'reachableUsers', label: 'Reachable Users', align: 'right' },
  { key: 'activationRate', label: 'Activation', align: 'right' },
  { key: 'paidConversion', label: 'Paid Conversion', align: 'right' },
  { key: 'arppuYear', label: 'ARPPU/year', align: 'right' },
  { key: 'annualRevenue', label: 'Annual Revenue', align: 'right' }
]));
report.push('');
report.push('## 5. Competitive Landscape');
report.push('');
report.push('### Top-100 Archetype Mix');
report.push('');
report.push(bulletCounts(countBy(prefill, 'archetype')));
report.push('');
report.push('### Pricing Signals');
report.push('');
const pricingTags = {};
for (const row of pricing) for (const tag of String(row.pricing_tags || '').split('|').filter(Boolean)) pricingTags[tag] = (pricingTags[tag] || 0) + 1;
report.push(bulletCounts(pricingTags));
report.push('');
if (iapRaw.length) {
  report.push('### Observed App Store IAP Pricing');
  report.push('');
  report.push(`Public App Store pages exposed ${iapRaw.length} in-app purchase rows across ${appsWithIap} top-candidate apps. This is observed webpage pricing, not guaranteed complete backend IAP catalog data.`);
  report.push('');
  report.push('Observed price bands:');
  report.push('');
  report.push(bulletCounts(countBy(iapRaw, 'price_band')));
  report.push('');
  const iapTagCounts = {};
  for (const row of iapRaw) for (const tag of String(row.product_tags || '').split('|').filter(Boolean)) iapTagCounts[tag] = (iapTagCounts[tag] || 0) + 1;
  report.push('Observed IAP product tags:');
  report.push('');
  report.push(bulletCounts(iapTagCounts));
  report.push('');
  report.push('Highest observed IAP ceilings:');
  report.push('');
  report.push(mdTable([...iapSummary]
    .filter(r => Number(r.iap_count) > 0)
    .sort((a, b) => Number(b.max_price_usd) - Number(a.max_price_usd))
    .slice(0, 8), [
      { key: 'app_name', label: 'App' },
      { key: 'iap_count', label: 'IAP Rows', align: 'right' },
      { key: 'min_price_usd', label: 'Min', align: 'right' },
      { key: 'max_price_usd', label: 'Max', align: 'right' },
      { key: 'product_tags', label: 'Product Tags' }
    ], 8));
  report.push('');
}
if (googlePlayPricing.length) {
  report.push('### Google Play Pricing Validation');
  report.push('');
  report.push(`Google Play metadata was collected for ${googlePlayPricing.length} Android package rows across the five market pillars. Successful lookups: ${googlePlayOk.length}. Apps offering IAP: ${googlePlayOk.filter(r => r.offers_iap === 'yes').length}; ad-supported apps: ${googlePlayOk.filter(r => r.ad_supported === 'yes').length}; paid download apps: ${googlePlayOk.filter(r => r.free === 'no').length}.`);
  report.push('');
  report.push('Android pricing model counts:');
  report.push('');
  report.push(bulletCounts(countBy(googlePlayOk, 'pricing_model')));
  report.push('');
  report.push('Android pricing summary by market:');
  report.push('');
  report.push(mdTable(googlePlayPricingSummary, [
    { key: 'niche', label: 'Market' },
    { key: 'successful_rows', label: 'OK', align: 'right' },
    { key: 'free_download_apps', label: 'Free', align: 'right' },
    { key: 'paid_download_apps', label: 'Paid', align: 'right' },
    { key: 'offers_iap_apps', label: 'IAP', align: 'right' },
    { key: 'ad_supported_apps', label: 'Ads', align: 'right' },
    { key: 'apps_with_developer_website', label: 'Dev Website', align: 'right' }
  ], googlePlayPricingSummary.length));
  report.push('');
}
if (webPaywallSignals.length) {
  report.push('### Developer Website Paywall Discovery');
  report.push('');
  report.push(`A first web-paywall discovery pass fetched ${webPaywallRaw.length} public URL rows from developer websites in Google Play metadata and aggregated them into ${webPaywallSignals.length} app/domain rows. This layer detects visible pricing, subscription, trial, checkout, premium, and upgrade language. It is a prioritization queue, not a substitute for screenshots or in-app paywall testing.`);
  report.push('');
  report.push('Website paywall signal strength:');
  report.push('');
  report.push(bulletCounts(countBy(webPaywallSignals, 'strongest_signal')));
  report.push('');
  report.push(`Screenshot validation queue: ${webPaywallScreenshotQueue.length} domains with medium/high public pricing or paywall language.`);
  report.push('');
  report.push(mdTable(webPaywallScreenshotQueue.slice(0, 12), [
    { key: 'app_name', label: 'App' },
    { key: 'niche', label: 'Market' },
    { key: 'strongest_signal', label: 'Signal' },
    { key: 'best_url', label: 'Best URL' },
    { key: 'detected_price_points', label: 'Detected Prices' }
  ], 12));
  report.push('');
}
if (webPaywallScreenshots.length) {
  report.push('### Web Paywall Screenshot Evidence');
  report.push('');
  report.push(`Headless Chrome captured ${webPaywallCapturedScreenshots.length}/${webPaywallScreenshots.length} screenshots from the web-paywall queue. These PNGs are visual evidence for manual interpretation; a captured page may confirm, weaken, or reject the original paywall signal.`);
  report.push('');
  report.push('Screenshot capture status:');
  report.push('');
  report.push(bulletCounts(countBy(webPaywallScreenshots, 'screenshot_status')));
  report.push('');
  report.push('Captured screenshots by market:');
  report.push('');
  report.push(bulletCounts(countBy(webPaywallCapturedScreenshots, 'niche')));
  report.push('');
  report.push('Highest-priority screenshot evidence:');
  report.push('');
  report.push(mdTable(webPaywallScreenshots.slice(0, 12), [
    { key: 'capture_rank', label: 'Rank', align: 'right' },
    { key: 'app_name', label: 'App' },
    { key: 'niche', label: 'Market' },
    { key: 'strongest_signal', label: 'Signal' },
    { key: 'screenshot_status', label: 'Status' },
    { key: 'screenshot_path', label: 'Screenshot' }
  ], 12));
  report.push('');
}
if (webPaywallScreenshotInterpretation.length) {
  report.push('### Web Paywall Screenshot OCR Interpretation');
  report.push('');
  report.push(`OCR interpretation was run for ${webPaywallScreenshotInterpretation.length} captured screenshots. This conservative layer separates visible public pricing from ambiguous pages, login gates, and not-found pages; it still requires human review before final claims.`);
  report.push('');
  report.push('Screenshot interpretation verdicts:');
  report.push('');
  report.push(bulletCounts(countBy(webPaywallScreenshotInterpretation, 'screenshot_interpretation_verdict')));
  report.push('');
  report.push('Strongest confirmed/weakening examples:');
  report.push('');
  report.push(mdTable(webPaywallScreenshotInterpretation
    .filter(r => ['confirms_public_pricing_signal', 'weakens_signal_not_found', 'needs_manual_review_high_signal_no_visible_price'].includes(r.screenshot_interpretation_verdict))
    .slice(0, 12), [
      { key: 'capture_rank', label: 'Rank', align: 'right' },
      { key: 'app_name', label: 'App' },
      { key: 'strongest_signal', label: 'Original Signal' },
      { key: 'screenshot_interpretation_verdict', label: 'OCR Verdict' },
      { key: 'ocr_detected_prices', label: 'OCR Prices' },
      { key: 'screenshot_path', label: 'Screenshot' }
  ], 12));
  report.push('');
}
if (webPaywallVisualAdjudication.length) {
  report.push('### Web Paywall Visual Adjudication');
  report.push('');
  report.push(`The visual adjudication layer classifies ${webPaywallVisualAdjudication.length} captured public website screenshots into conservative evidence buckets. It is not human sign-off and it does not inspect in-app paywalls; it decides what the public screenshot/OCR evidence can support today.`);
  report.push('');
  report.push('Visual adjudication mix:');
  report.push('');
  report.push(bulletCounts(countBy(webPaywallVisualAdjudication, 'visual_adjudication')));
  report.push('');
  report.push('Market-level adjudication read:');
  report.push('');
  report.push(mdTable(webPaywallVisualAdjudicationSummary, [
    { key: 'niche', label: 'Market' },
    { key: 'screenshots_reviewed', label: 'Screenshots', align: 'right' },
    { key: 'confirmed_visible_pricing', label: 'Confirmed', align: 'right' },
    { key: 'partial_paid_surface', label: 'Partial', align: 'right' },
    { key: 'weakened_or_rejected', label: 'Weakened', align: 'right' },
    { key: 'manual_or_login_gate', label: 'Manual/Login', align: 'right' },
    { key: 'market_read', label: 'Read' }
  ], webPaywallVisualAdjudicationSummary.length));
  report.push('');
  report.push('Confirmed and partial public paid-surface examples:');
  report.push('');
  report.push(mdTable(confirmedVisualPricing.concat(partialVisualPaidSurface), [
    { key: 'capture_rank', label: 'Rank', align: 'right' },
    { key: 'app_name', label: 'App' },
    { key: 'niche', label: 'Market' },
    { key: 'visual_adjudication', label: 'Adjudication' },
    { key: 'price_evidence', label: 'Price Evidence' },
    { key: 'screenshot_path', label: 'Screenshot' }
  ], 15));
  report.push('');
}
report.push('### Retention Signals');
report.push('');
const retentionTags = {};
for (const row of pricing) for (const tag of String(row.retention_tags || '').split('|').filter(Boolean)) retentionTags[tag] = (retentionTags[tag] || 0) + 1;
report.push(bulletCounts(retentionTags));
report.push('');
if (top100Review.length) {
  report.push('### AI-Assisted Top-100 Competitor Review');
  report.push('');
  report.push(`The top-100 candidate set now has an AI-assisted scorecard that combines App Store metadata, product-core scoring, pricing/retention tags, review-language signals, and JTBD/pain clusters. This is a strong triage layer but still needs human product validation before final claims.`);
  report.push('');
  report.push(`Coverage: ${top100Review.length} rows, ${primaryCompetitors.length} unique primary apps, ${top100Review.length - primaryCompetitors.length} duplicate app entries, ${primaryCompetitors.filter(r => Number(r.review_signal_rows) > 0).length} unique apps with public review signals.`);
  report.push('');
  report.push('Competitor verdict counts:');
  report.push('');
  report.push(bulletCounts(countBy(top100Review, 'competitive_verdict')));
  report.push('');
  report.push('Highest-threat primary competitors:');
  report.push('');
  report.push(mdTable([...primaryCompetitors]
    .sort((a, b) => Number(b.competitive_threat_score) - Number(a.competitive_threat_score))
    .slice(0, 10), [
      { key: 'review_rank', label: 'Rank', align: 'right' },
      { key: 'app_name', label: 'App' },
      { key: 'competitive_threat_score', label: 'Threat', align: 'right' },
      { key: 'competitive_verdict', label: 'Verdict' },
      { key: 'alina_core_score', label: 'Core', align: 'right' },
      { key: 'behavior_tied_progression', label: 'Behavior Progression' }
    ], 10));
  report.push('');
  report.push('Competitive interpretation: the field is full of close substitutes, but only one direct reference competitor currently shows strict behavior-tied avatar/identity progression. That keeps the whitespace narrow but real.');
  report.push('');
}
if (humanValidationQueue.length) {
  report.push('### Human Validation Queue');
  report.push('');
  report.push(`The AI-assisted top-100 review now has a ranked human validation queue covering ${humanValidationQueue.length} primary app entries. P0/P1 apps should be manually checked before external-facing claims are treated as confirmed.`);
  report.push('');
  report.push('Validation priority bands:');
  report.push('');
  report.push(bulletCounts(countBy(humanValidationQueue, 'priority_band')));
  report.push('');
  report.push('P0 validation targets:');
  report.push('');
  report.push(mdTable(p0HumanValidation.slice(0, 12), [
    { key: 'validation_rank', label: 'Rank', align: 'right' },
    { key: 'app_name', label: 'App' },
    { key: 'competitive_verdict', label: 'Verdict' },
    { key: 'validation_priority_score', label: 'Priority', align: 'right' },
    { key: 'behavior_tied_progression_claim', label: 'Behavior Claim' },
    { key: 'manual_checks', label: 'Manual Checks' }
  ], 12));
  report.push('');
}
if (manualInspectionPacket.length) {
  report.push('### Manual Competitor Inspection Packet');
  report.push('');
  report.push(`The broad human validation queue now has a first-wave inspection packet: ${manualInspectionPacket.length} P0 apps, ${manualInspectionRubric.length} rubric dimensions, ${manualInspectionStrongMoney.length} strong-money targets, and ${manualInspectionBehaviorPrefill.length} prefilled behavior-tied progression claim. This is execution scaffolding, not completed human review.`);
  report.push('');
  report.push('First-wave inspection targets:');
  report.push('');
  report.push(mdTable(manualInspectionPacket, [
    { key: 'inspection_rank', label: 'Rank', align: 'right' },
    { key: 'app_name', label: 'App' },
    { key: 'competitive_verdict_prefill', label: 'Prefill Verdict' },
    { key: 'revenue_proxy_band', label: 'Money Proxy' },
    { key: 'behavior_tied_progression_prefill', label: 'Behavior-Tied?' },
    { key: 'priority_reason', label: 'Why Inspect' }
  ], 12));
  report.push('');
  report.push('Inspection rubric dimensions:');
  report.push('');
  report.push(mdTable(manualInspectionRubric, [
    { key: 'inspection_dimension', label: 'Dimension' },
    { key: 'pass_definition', label: 'Pass Definition' },
    { key: 'downgrade_trigger', label: 'Downgrade Trigger' },
    { key: 'effect_on_claims', label: 'Claim Effect' }
  ], manualInspectionRubric.length));
  report.push('');
}
if (publicListingInspection.length) {
  report.push('### P0 Public Listing Inspection');
  report.push('');
  report.push(`The first inspection execution layer now reviews the public App Store listing excerpts for ${publicListingInspection.length} P0 competitors without broad search-engine expansion. This is not a completed app walkthrough: onboarding, first action, progress/avatar feedback, and paywall screenshots remain open.`);
  report.push('');
  report.push(`Public listing read: ${publicListingVisibleCausality.length} visible action-to-avatar causality case and ${publicListingHighCloneRisk.length} high public hidden-clone risk case. The correct interpretation is targeted walkthrough priority, not final whitespace proof.`);
  report.push('');
  report.push(mdTable(publicListingInspection, [
    { key: 'inspection_rank', label: 'Rank', align: 'right' },
    { key: 'app_name', label: 'App' },
    { key: 'public_listing_verdict', label: 'Public Verdict' },
    { key: 'action_to_avatar_causality_public_read', label: 'Causality Read' },
    { key: 'hidden_clone_risk_public_read', label: 'Clone Risk' },
    { key: 'implication_for_h3_whitespace', label: 'H3 Implication' }
  ], 12));
  report.push('');
}
report.push('## 6. Whitespace Analysis');
report.push('');
report.push('Broad whitespace is weak: the market already has many products that combine meaning, habits, AI, mindfulness, and identity language. Narrow whitespace is stronger: top-100 metadata shows only one strict signal of behavior-tied avatar progression.');
report.push('');
if (crossSourceSaturation.length) {
  report.push('Cross-source saturation read: no primary market is upgraded to high opportunity from metadata alone. Gaming/progression remains a mechanic benchmark, while mindfulness, avatar/identity, coaching, and astrology/esoterics remain crowded or unclear until manual app walkthroughs and prototype sessions resolve directness.');
  report.push('');
  report.push(mdTable(crossSourceSaturation, [
    { key: 'niche', label: 'Market' },
    { key: 'directness_weighted_rows', label: 'Directness-Weighted Rows', align: 'right' },
    { key: 'full_loop_rate_pct', label: 'Full-Loop %', align: 'right' },
    { key: 'opportunity_band', label: 'Opportunity' },
    { key: 'next_validation_move', label: 'Next Validation Move' }
  ], crossSourceSaturation.length));
  report.push('');
}
report.push('### Product Core Signals in Top-100');
report.push('');
const coreSignals = [
  { element: 'Personal meaning', count: core.filter(r => r.personal_meaning === 'yes').length },
  { element: 'One daily action', count: core.filter(r => r.one_daily_action === 'yes').length },
  { element: 'Short reset', count: core.filter(r => r.short_reset === 'yes').length },
  { element: 'Avatar or identity', count: core.filter(r => r.avatar_or_identity === 'yes').length },
  { element: 'Behavior-tied progression', count: behaviorTied },
  { element: 'Next-day hook', count: core.filter(r => r.next_day_hook === 'yes').length }
];
report.push(mdTable(coreSignals.map(r => ({ ...r, denominator: '100' })), [
  { key: 'element', label: 'Core Element' },
  { key: 'count', label: 'Detected', align: 'right' },
  { key: 'denominator', label: 'Out Of', align: 'right' }
]));
report.push('');
report.push('## 7. Audience Segmentation');
report.push('');
report.push('The strongest shared-audience hypothesis is not "people who use all five app categories." It is people who already use digital rituals to regulate identity and emotion.');
report.push('');
report.push('Audience signal counts:');
report.push('');
report.push(bulletCounts(countBy(audience, 'audience_tag')));
report.push('');
if (icpSegments.length) {
  report.push('### ICP Segment Matrix');
  report.push('');
  report.push('The ICP layer converts audience-signal rows, review JTBD/pain clusters, forum quote coding, coded Reddit mention signals, and monetization proxies into testable segment hypotheses. It is directional evidence, not a final persona decision.');
  report.push('');
  report.push(mdTable(icpSegments, [
    { key: 'segment_name', label: 'Segment' },
    { key: 'evidence_band', label: 'Evidence Band' },
    { key: 'audience_signal_rows', label: 'Audience Rows', align: 'right' },
    { key: 'review_cluster_rows', label: 'Review Rows', align: 'right' },
    { key: 'forum_quote_rows', label: 'Forum Rows', align: 'right' },
    { key: 'core_job', label: 'Core Job' },
    { key: 'positioning_angle', label: 'Positioning Angle' },
    { key: 'validation_gate', label: 'Validation Gate' }
  ], icpSegments.length));
  report.push('');
  report.push(`Current ICP read: "${strongestIcpSegment.segment_name || 'n/a'}" is the strongest directional starting segment, but the decision should remain open until interviews/prototype tests compare at least the top two segments.`);
  report.push('');
}
if (redditMentionSignals.length) {
  report.push('### Reddit Signals for ICP and Audience');
  report.push('');
  report.push(`Coded Reddit rows add ${redditMentionSignals.length} thread-level signals, including ${redditMentionMediumPlusSignals.length} medium-or-stronger qualitative rows. The manual-read queue converts them into ${redditManualReadingQueue.length} unique thread reads, ${redditManualPromptBank.length} prompt lanes, and ${redditManualCaptureSheet.length} P0/P1 capture rows for recruiting copy, screener language, prototype objections, and whitespace review; they do not replace interviews or representative survey data.`);
  report.push('');
  report.push('Linked ICP segments from Reddit coding:');
  report.push('');
  const icpLinkCounts = {};
  for (const row of redditMentionSignals) {
    for (const segment of String(row.linked_icp_segments || '').split('|').filter(Boolean)) {
      icpLinkCounts[segment] = (icpLinkCounts[segment] || 0) + 1;
    }
  }
  report.push(bulletCounts(icpLinkCounts));
  report.push('');
}
if (icpValidationPlan.length) {
  report.push('### ICP Validation Packet');
  report.push('');
  report.push(`The ICP validation packet adds ${icpValidationPlan.length} concrete tests across screener, problem interview, prototype loop, positioning, willingness-to-pay, and disconfirmation checks. This is the immediate P0 path for choosing a primary ICP without adding broad source collection.`);
  report.push('');
  report.push('Validation test types:');
  report.push('');
  report.push(bulletCounts(countBy(icpValidationPlan, 'validation_type')));
  report.push('');
}
if (prototypeStimulusFlow.length) {
  report.push('### Prototype Validation Stimulus');
  report.push('');
  report.push(`A concrete two-minute loop stimulus now exists for the top ICP comparison: ${prototypeScreens.size} screens across ${prototypeSegments.size} segments, with ${prototypeScorecard.length} success/kill metrics. This closes the prototype-design gap but not the user-validation gap.`);
  report.push('');
  report.push('Prototype screens:');
  report.push('');
  report.push(mdTable([...new Map(prototypeStimulusFlow.map(row => [row.screen_id, row])).values()], [
    { key: 'step', label: 'Step', align: 'right' },
    { key: 'screen_name', label: 'Screen' },
    { key: 'user_goal', label: 'User Goal' },
    { key: 'expected_signal', label: 'Expected Signal' },
    { key: 'failure_signal', label: 'Failure Signal' }
  ], 10));
  report.push('');
  report.push('Success/kill gates:');
  report.push('');
  report.push(mdTable(prototypeScorecard, [
    { key: 'gate', label: 'Gate' },
    { key: 'success_threshold', label: 'Success Threshold' },
    { key: 'kill_threshold', label: 'Kill Threshold' }
  ], prototypeScorecard.length));
  report.push('');
}
report.push('### App Store Review Language');
report.push('');
report.push(`Recent public App Store reviews were collected for top intersection candidates. Coverage is ${rawReviews.length} deduplicated reviews across ${reviewApps} apps, converted into keyword-based signal rows. This is not final sentiment modeling, but it is useful evidence for user language, delight, objections, and churn risk.`);
report.push('');
report.push('Review rating mix:');
report.push('');
report.push(bulletCounts(ratingMix));
report.push('');
report.push('Review signal counts:');
report.push('');
report.push(bulletCounts(reviewSignalCounts));
report.push('');
report.push('Interpretation: users respond strongly to daily ritual loops, emotional support, and visible progress/identity mechanics; recurring objections cluster around content depth, subscription value, bugs, trust/accuracy, and safety/privacy.');
report.push('');
report.push('### JTBD and Pain Clusters from Reviews');
report.push('');
report.push(mdTable(reviewClusters.slice(0, 8), [
  { key: 'cluster_label', label: 'Cluster' },
  { key: 'cluster_type', label: 'Type' },
  { key: 'review_rows', label: 'Rows', align: 'right' },
  { key: 'app_count', label: 'Apps', align: 'right' },
  { key: 'avg_rating', label: 'Avg Rating', align: 'right' },
  { key: 'product_implication', label: 'Product Implication' }
], 8));
report.push('');
report.push('The strongest product read: Alina should start as one daily ritual that turns personal meaning into one concrete action, then makes the effort visible through progress/avatar feedback. The strongest risk read: subscription gates, broken streak/reward mechanics, vague content, and unsafe overclaiming can destroy trust quickly.');
report.push('');
if (communityReferralSummary.length) {
  report.push('### Community and Referral Signals');
  report.push('');
  report.push(`A local-only community/referral matrix adds ${communityReferralRows.length} signal rows from App Store review text and coded forum quotes. This is audience/channel evidence, not attribution or market-share proof.`);
  report.push('');
  report.push(mdTable(communityReferralSummary, [
    { key: 'signal_kind', label: 'Signal' },
    { key: 'row_count', label: 'Rows', align: 'right' },
    { key: 'review_rows', label: 'Review Rows', align: 'right' },
    { key: 'forum_rows', label: 'Forum Rows', align: 'right' },
    { key: 'unique_apps_or_sources', label: 'Apps/Sources', align: 'right' },
    { key: 'implication', label: 'Implication' }
  ], 8));
  report.push('');
}
report.push('### Forum and External Discussion Signals');
report.push('');
report.push(`A first public forum/source map adds ${forumSignals.length} qualitative rows. These sources are not representative survey data, but they help triangulate language and objections outside app-store reviews.`);
report.push('');
report.push('Forum signals by market:');
report.push('');
report.push(bulletCounts(countBy(forumSignals, 'market')));
report.push('');
report.push('Forum signals by type:');
report.push('');
report.push(bulletCounts(countBy(forumSignals, 'signal_type')));
report.push('');
if (forumQuoteCoding.length) {
  report.push('Forum quote coding tags:');
  report.push('');
  const forumQuoteTagCounts = {};
  for (const row of forumQuoteCoding) {
    for (const tag of String(row.coding_tags || '').split('|').filter(Boolean)) {
      forumQuoteTagCounts[tag] = (forumQuoteTagCounts[tag] || 0) + 1;
    }
  }
  report.push(bulletCounts(forumQuoteTagCounts));
  report.push('');
}
report.push('Cross-source read: daily anchors and visible progress are attractive, but users push back against generic guidance, hard paywalls, strict streak punishment, noisy gamification, and spiritual/AI overclaiming.');
report.push('');
report.push('## 8. Product Core');
report.push('');
report.push('Target loop: personal meaning -> one daily action -> short reset -> avatar/identity feedback -> visible progression -> next-day hook.');
report.push('');
report.push('MVP testable claim: users should understand and complete the full daily loop in under two minutes, then report that the avatar/progress cue makes the action feel more personally meaningful.');
report.push('');
if (prototypeStimulusFlow.length) {
  report.push('Prototype validation readiness: stimulus pack is ready, but no participant results have been recorded. The next evidence upgrade is observed comprehension, completion time, meaning lift, differentiation, return intent, trust objections, and paid-depth interest.');
  report.push('');
}
report.push('## 9. Risk Register');
report.push('');
report.push(mdTable([
  { risk: 'Fragmentation', severity: 'high', mitigation: 'Force one daily flow; avoid separate feature tabs as MVP core.' },
  { risk: 'Avatar novelty churn', severity: 'high', mitigation: 'Tie avatar changes to completed actions and progress, not one-off image generation.' },
  { risk: 'Astrology trust/overclaiming', severity: 'high', mitigation: 'Use soft framing, confidence labels, and avoid deterministic claims.' },
  { risk: 'AI hallucination in guidance', severity: 'high', mitigation: 'Constrain advice to low-stakes coaching prompts and clear disclaimers.' },
  { risk: 'Subscription fatigue', severity: 'medium', mitigation: 'Keep daily loop free; monetize depth/personal analysis/advanced progress.' },
  { risk: 'Crowded adjacent markets', severity: 'medium', mitigation: 'Position around integrated transformation loop, not generic astrology/mindfulness/avatar.' }
], [
  { key: 'risk', label: 'Risk' },
  { key: 'severity', label: 'Severity' },
  { key: 'mitigation', label: 'Mitigation' }
]));
report.push('');
report.push('## 10. Go/No-Go Status');
report.push('');
report.push('Current status: conditional go for continued validation, not yet go for full product build.');
report.push('');
report.push('Go signals present:');
report.push('');
report.push('- Adjacent markets have meaningful revenue pools.');
report.push('- Users are already trained on daily loops, streaks, reflection, and spiritual/personalized guidance.');
report.push('- Top-100 evidence suggests avatar/identity is common but behavior-tied avatar progression is rare.');
report.push('- AI-assisted competitor review found many close substitutes but only one direct reference competitor under the strict behavior-tied progression criterion.');
report.push('- Review language confirms user pull toward daily support, emotional regulation, progress cues, and personal meaning.');
report.push('');
report.push('Remaining proof required:');
report.push('');
report.push('- Manual validation of the top-100 candidates.');
report.push('- Human validation of AI-assisted battlecards and scorecard verdicts.');
report.push('- Completion of P0/P1 human validation queue and status updates in `data_processed/top100_human_validation_queue.csv`.');
report.push('- Forum evidence and deeper manual clustering of reviews for user pain language and subscription objections.');
report.push('- Human validation of forum/source quote coding before external-facing use.');
report.push('- Web/paywall screenshots and trial-term validation where accessible.');
report.push('- Prototype test of the two-minute daily loop.');
report.push('');
report.push('## 11. Source and Claim Layer');
report.push('');
report.push(`Market claims currently normalized: ${claims.length}.`);
if (evidenceAudit.length) report.push(`Claim audit rows currently normalized: ${evidenceAudit.length}.`);
report.push('');
report.push(mdTable(claims.slice(0, 12), [
  { key: 'claim_id', label: 'Claim ID' },
  { key: 'market', label: 'Market' },
  { key: 'value', label: 'Value', align: 'right' },
  { key: 'period', label: 'Period' },
  { key: 'confidence', label: 'Confidence' },
  { key: 'source_id', label: 'Source' }
], 12));
report.push('');
report.push('## 12. Appendices / File Map');
report.push('');
report.push('- `docs/research-expansion-master-plan.md`');
report.push('- `docs/market/tam-sam-som-model-v1.md`');
report.push('- `docs/market/market-source-confidence-review-v1.md`');
report.push('- `docs/market/monetization-proxy-matrix-v1.md`');
report.push('- `docs/intersections/whitespace-map-v2.md`');
report.push('- `docs/audience/audience-segmentation-v1.md`');
report.push('- `docs/audience/icp-segment-matrix-v1.md`');
report.push('- `docs/audience/icp-validation-packet-v1.md`');
report.push('- `docs/audience/review-language-synthesis-v1.md`');
report.push('- `docs/audience/review-jtbd-clusters-v1.md`');
report.push('- `docs/audience/community-referral-evidence-v1.md`');
report.push('- `docs/audience/forum-evidence-synthesis-v1.md`');
report.push('- `docs/audience/forum-quote-coding-v1.md`');
report.push('- `docs/visuals/chart-index-v1.md`');
report.push('- `docs/competitive/top-intersection-review-synthesis-v1.md`');
report.push('- `docs/competitive/top100-competitor-review-v1.md`');
report.push('- `docs/competitive/top100-competitor-battlecards-v1.md`');
report.push('- `docs/competitive/human-validation-guide-v1.md`');
report.push('- `docs/competitive/app-store-iap-pricing-v1.md`');
report.push('- `docs/competitive/google-play-pricing-v1.md`');
report.push('- `docs/competitive/web-paywall-validation-v1.md`');
report.push('- `docs/competitive/web-paywall-screenshot-validation-v1.md`');
report.push('- `docs/competitive/web-paywall-screenshot-interpretation-v1.md`');
report.push('- `docs/competitive/source-expansion-backlog-v1.md`');
report.push('- `docs/competitive/p0-external-source-collection-v1.md`');
report.push('- `docs/competitive/itch-source-expansion-v1.md`');
report.push('- `docs/competitive/steam-tag-expansion-v1.md`');
report.push('- `docs/competitive/desktop-store-expansion-v1.md`');
report.push('- `docs/competitive/cross-source-universe-v1.md`');
report.push('- `docs/competitive/cross-source-coverage-matrix-v1.md`');
report.push('- `docs/intersections/cross-source-saturation-whitespace-v1.md`');
report.push('- `docs/competitive/chrome-extension-detail-enrichment-v1.md`');
report.push('- `docs/competitive/chrome-extension-mechanic-battlecards-v1.md`');
report.push('- `docs/decision/evidence-audit-v1.md`');
report.push('- `docs/decision/evidence-package-manifest-v1.md`');
report.push('- `docs/decision/research-completion-audit-v1.md`');
report.push('- `docs/decision/hypothesis-decision-matrix-v1.md`');
report.push('- `docs/decision/p0-validation-command-center-v1.md`');
report.push('- `docs/decision/p0-validation-field-guide-v1.md`');
report.push('- `docs/decision/validation-evidence-workspace-v1.md`');
report.push('- `docs/decision/validation-batch-01-v1.md`');
report.push('- `docs/decision/validation-batch-02-v1.md`');
report.push('- `docs/decision/validation-batch-03-v1.md`');
report.push('- `docs/decision/validation-evidence-rollup-v1.md`');
report.push('- `docs/decision/validation-gap-roadmap-v1.md`');
report.push('- `docs/decision/validation-execution-dashboard-v1.md`');
report.push('- `docs/product/product-core-evidence-v1.md`');
report.push('- `data_processed/tam_sam_som_model.csv`');
report.push('- `data_processed/market_source_confidence_review.csv`');
report.push('- `data_processed/market_confidence_summary.csv`');
report.push('- `data_processed/market_monetization_proxy_matrix.csv`');
report.push('- `data_processed/monetization_proxy_examples.csv`');
report.push('- `data_processed/evidence_claim_register.csv`');
report.push('- `data_processed/evidence_artifact_manifest.csv`');
report.push('- `data_processed/research_completion_audit.csv`');
report.push('- `data_processed/hypothesis_decision_matrix.csv`');
report.push('- `data_processed/p0_validation_command_center.csv`');
report.push('- `data_processed/p0_validation_field_guide.csv`');
report.push('- `data_processed/validation_evidence_workspace_index.csv`');
report.push('- `data_processed/validation_batch_01_index.csv`');
report.push('- `data_processed/validation_batch_02_index.csv`');
report.push('- `data_processed/validation_batch_03_index.csv`');
report.push('- `data_processed/validation_evidence_rollup.csv`');
report.push('- `data_processed/source_expansion_backlog.csv`');
report.push('- `data_processed/p0_external_source_summary.csv`');
report.push('- `data_processed/itch_source_summary.csv`');
report.push('- `data_processed/steam_tag_source_summary.csv`');
report.push('- `data_processed/desktop_store_source_summary.csv`');
report.push('- `data_processed/cross_source_universe_raw_index.csv`');
report.push('- `data_processed/cross_source_universe_raw_parts/part_*.csv`');
report.push('- `data_processed/cross_source_universe_dedup.csv`');
report.push('- `data_processed/cross_source_universe_summary.csv`');
report.push('- `data_processed/cross_source_coverage_matrix.csv`');
report.push('- `data_processed/cross_source_market_saturation_matrix.csv`');
report.push('- `data_processed/chrome_extension_fit_matrix.csv`');
report.push('- `data_processed/chrome_extension_mechanic_battlecards.csv`');
report.push('- `data_processed/validation_gap_roadmap.csv`');
report.push('- `data_processed/validation_execution_dashboard.csv`');
report.push('- `data_processed/competitor_feature_matrix.csv`');
report.push('- `data_processed/audience_signal_matrix.csv`');
report.push('- `data_processed/icp_segment_matrix.csv`');
report.push('- `data_processed/icp_validation_test_plan.csv`');
report.push('- `data_processed/whitespace_signal_matrix.csv`');
report.push('- `data_processed/top_intersection_review_prefill.csv`');
report.push('- `data_processed/top100_competitor_review_scorecard.csv`');
report.push('- `data_processed/top100_human_validation_queue.csv`');
report.push('- `data_processed/app_store_iap_pricing_summary.csv`');
report.push('- `data_processed/google_play_pricing_summary.csv`');
report.push('- `data_processed/web_paywall_signal_matrix.csv`');
report.push('- `data_processed/web_paywall_screenshot_validation.csv`');
report.push('- `data_processed/web_paywall_screenshot_interpretation.csv`');
report.push('- `data_processed/pricing_retention_matrix.csv`');
report.push('- `data_processed/product_core_evidence_matrix.csv`');
report.push('- `data_processed/review_signal_matrix.csv`');
report.push('- `data_processed/review_jtbd_cluster_summary.csv`');
report.push('- `data_processed/review_jtbd_cluster_rows.csv`');
report.push('- `data_processed/community_referral_signal_rows.csv`');
report.push('- `data_processed/community_referral_summary.csv`');
report.push('- `data_processed/icp_recruiting_bridge.csv`');
report.push('- `data_processed/icp_recruiting_message_bank.csv`');
report.push('- `data_processed/validation_gate_calculator.csv`');
report.push('- `data_processed/validation_gate_status_summary.csv`');
report.push('- `data_processed/market_money_triangulation.csv`');
report.push('- `data_processed/market_money_triangulation_summary.csv`');
report.push('- `data_raw/app_store_top_candidate_reviews.csv`');
report.push('- `data_raw/app_store_iap_pricing_raw.csv`');
report.push('- `data_raw/google_play_pricing_raw.csv`');
report.push('- `data_raw/web_paywall_discovery_raw.csv`');
report.push('- `data_raw/forum_evidence_signals.csv`');
report.push('- `data_raw/forum_quote_evidence_raw.csv`');
report.push('- `data_raw/expanded/p0_external_sources_raw.csv`');
report.push('- `data_raw/expanded_itch_raw.csv`');
report.push('- `data_raw/expanded_steam_tags_raw.csv`');
report.push('- `data_raw/expanded_desktop_store_raw.csv`');
report.push('- `data_raw/expanded_chrome_extensions_raw.csv`');
report.push('- `data_raw/expanded_reddit_competitor_mentions_raw.csv`');
report.push('- `data_processed/reddit_competitor_mentions_summary.csv`');
report.push('- `data_raw/chrome_extension_detail_raw.csv`');
report.push('- `data_processed/forum_quote_coding_matrix.csv`');
report.push('- `output/charts/whitespace-bands.svg`');
report.push('- `output/charts/review-jtbd-clusters.svg`');
report.push('- `output/charts/sam-base-by-pillar.svg`');
report.push('- `output/charts/som-scenarios.svg`');
report.push('- `output/charts/forum-signals-by-market.svg`');
report.push('- `output/charts/forum-quote-coding-tags.svg`');
report.push('- `output/charts/icp-segment-evidence-scores.svg`');
report.push('- `output/charts/top100-competitor-verdicts.svg`');
report.push('- `output/charts/top100-threat-scores.svg`');
report.push('- `output/charts/iap-price-bands.svg`');
report.push('- `output/charts/google-play-pricing-models.svg`');
report.push('- `output/charts/google-play-iap-by-market.svg`');
report.push('- `output/charts/web-paywall-signal-strength.svg`');
report.push('- `output/charts/web-paywall-screenshot-queue-by-market.svg`');
report.push('- `output/paywall_screenshots/*.png`');
report.push('- `output/pdf/alina-evidence-first-report-draft.pdf`');
report.push('- `output/pdf/alina-evidence-visual-report-v1.pdf`');
report.push('');
report.push('## 13. Next Work');
report.push('');
report.push('1. Human-validate the P0/P1 queue from `data_processed/top100_human_validation_queue.csv` and update validation statuses.');
report.push('2. Manually validate the highest-signal review clusters and extract exact user language for positioning.');
report.push('3. Screenshot-validate the website paywall queue and verify trial terms / first meaningful paywall location.');
report.push('4. Polish final designed PDF and add web/paywall screenshots where useful.');
report.push('5. Human-validate retrieval-assisted Reddit/forum/website quote coding.');
report.push('6. Update go/no-go decision after manual review and user validation.');

fs.writeFileSync(OUT, `${report.join('\n')}\n`);

const status = [];
status.push('# Evidence Status');
status.push('');
status.push(`Generated: ${new Date().toISOString()}`);
status.push('');
status.push(mdTable([
  { requirement: 'Large plan/backlog', evidence: 'docs/research-expansion-master-plan.md', status: 'done' },
  { requirement: 'Competitor/source expansion', evidence: 'data_raw/expanded/all_expanded_raw.csv; data_raw/research_source_discovery.csv', status: 'partial but substantial' },
  { requirement: 'Next source expansion backlog', evidence: 'data_processed/source_expansion_backlog.csv; docs/competitive/source-expansion-backlog-v1.md', status: 'done v1; prioritized sources, target outputs, expected row ranges, and risks captured' },
  { requirement: 'Controlled P0 external-source smoke pass', evidence: 'data_raw/expanded/p0_external_sources_raw.csv; data_processed/p0_external_source_summary.csv; docs/competitive/p0-external-source-collection-v1.md', status: 'done v1; small by design; Chrome Web Store yielded usable candidates, Product Hunt/AlternativeTo attempts retained as empty-source evidence' },
  { requirement: 'Source-native itch.io expansion', evidence: 'data_raw/expanded_itch_raw.csv; data_processed/itch_source_summary.csv; docs/competitive/itch-source-expansion-v1.md', status: 'done v1; adds web-game/mechanic discovery rows for gaming, mindfulness, and avatar/identity without broad search-engine crawling' },
  { requirement: 'Source-native Steam tag expansion', evidence: 'data_raw/expanded_steam_tags_raw.csv; data_processed/steam_tag_source_summary.csv; docs/competitive/steam-tag-expansion-v1.md', status: 'done v1; adds PC progression/cozy/avatar mechanic benchmarks without broad search-engine crawling' },
  { requirement: 'Source-native desktop store expansion', evidence: 'data_raw/expanded_desktop_store_raw.csv; data_processed/desktop_store_source_summary.csv; docs/competitive/desktop-store-expansion-v1.md', status: 'done v1; adds Mac App Store desktop wellness/productivity/avatar/game references through a source-native API, not broad search crawling' },
  { requirement: 'Cross-source universe normalization', evidence: 'data_processed/cross_source_universe_raw_index.csv;data_processed/cross_source_universe_raw_parts/part_*.csv; data_processed/cross_source_universe_dedup.csv; data_processed/cross_source_universe_summary.csv; docs/competitive/cross-source-universe-v1.md', status: 'done v1; normalizes core app-store, Google Play fallback, itch.io, Steam, desktop store, and Chrome rows into one provenance-preserving universe' },
  { requirement: 'Cross-source coverage matrix', evidence: 'data_processed/cross_source_coverage_matrix.csv; docs/competitive/cross-source-coverage-matrix-v1.md', status: 'done v1; grades source-by-market cells into strong, medium, thin, and context-only coverage for safer interpretation' },
  { requirement: 'Cross-source saturation/whitespace read', evidence: 'data_processed/cross_source_market_saturation_matrix.csv; docs/intersections/cross-source-saturation-whitespace-v1.md', status: 'done v1; scores market saturation and keeps gaming/progression benchmark-only rather than overclaiming primary-market whitespace' },
  { requirement: 'Chrome extension detail enrichment', evidence: 'data_raw/chrome_extension_detail_raw.csv; data_processed/chrome_extension_fit_matrix.csv; docs/competitive/chrome-extension-detail-enrichment-v1.md', status: 'done v1; detail pages parsed for known Chrome candidates only, producing fit bands and mechanic tags without broad search expansion' },
  { requirement: 'Chrome extension mechanic battlecards', evidence: 'data_processed/chrome_extension_mechanic_battlecards.csv; docs/competitive/chrome-extension-mechanic-battlecards-v1.md', status: 'done v1; converts enriched Chrome candidates into mechanic lessons, whitespace implications, and validation tasks' },
  { requirement: 'Validation gap roadmap', evidence: 'data_processed/validation_gap_roadmap.csv; docs/decision/validation-gap-roadmap-v1.md', status: 'done v1; maps five markets and H1-H6 gaps into P0/P1 success gates' },
  { requirement: 'Validation execution dashboard', evidence: 'data_processed/validation_execution_dashboard.csv; docs/decision/validation-execution-dashboard-v1.md', status: 'done v1; converts open gates into ranked execution tasks, exact evidence requirements, success gates, and downgrade gates' },
  { requirement: 'H1-H6 hypothesis decision matrix', evidence: 'data_processed/hypothesis_decision_matrix.csv; docs/decision/hypothesis-decision-matrix-v1.md', status: `done v1; ${holdHypothesisDecisions.length} hold/validate rows keep open gates explicit before final go/no-go` },
  { requirement: 'P0 validation command center', evidence: 'data_processed/p0_validation_command_center.csv; docs/decision/p0-validation-command-center-v1.md', status: `done v1; ${p0CommandCenter.length} operator rows turn open gates into exact evidence capture commands` },
  { requirement: 'P0 validation field guide', evidence: 'data_processed/p0_validation_field_guide.csv; docs/decision/p0-validation-field-guide-v1.md', status: `done v1; ${p0FieldGuide.length} scripts/protocol sections make P0 execution repeatable` },
  { requirement: 'Russian validation fieldbook', evidence: 'data_processed/russian_validation_fieldbook.csv; docs/decision/russian-validation-fieldbook-v1.md', status: `done v1; ${russianValidationFieldbook.length} Russian narrative phases turn P0 validation into an executable field protocol` },
  { requirement: 'Validation evidence workspace', evidence: 'data_processed/validation_evidence_workspace_index.csv; docs/decision/validation-evidence-workspace-v1.md; output/validation/README.md; output/validation/templates/*.md', status: `done v1; ${validationWorkspace.length} lane workspaces and note templates created for observed evidence intake` },
  { requirement: 'Validation Batch 01', evidence: 'data_processed/validation_batch_01_index.csv; docs/decision/validation-batch-01-v1.md; output/validation/2026-05-31/*/batch01_*.md', status: `done v1; ${validationBatch01.length} blocker notes prefilled for first validation tranche` },
  { requirement: 'Validation Batch 02', evidence: 'data_processed/validation_batch_02_index.csv; docs/decision/validation-batch-02-v1.md; output/validation/2026-05-31/*/batch02_*.md', status: `done v1; ${validationBatch02.length} P0-breadth notes prefilled for non-blocker validation commands` },
  { requirement: 'Validation Batch 03', evidence: 'data_processed/validation_batch_03_index.csv; docs/decision/validation-batch-03-v1.md; output/validation/2026-05-31/*/batch03_*.md', status: `done v1; ${validationBatch03.length} P1-context paid-flow notes prefilled for conservative monetization checks` },
  { requirement: 'Validation evidence rollup', evidence: 'data_processed/validation_evidence_rollup.csv; docs/decision/validation-evidence-rollup-v1.md', status: `done v1; ${validationEvidenceRollup.length} command rows audit note existence and local artifact links` },
  { requirement: 'Validation tranche planner', evidence: 'data_processed/validation_tranche_planner.csv; docs/decision/validation-tranche-planner-v1.md', status: `done v1; ${validationTranchePlanner.length} execution tranches prioritize blocker spikes, pilot reads, and rebuild gates` },
  { requirement: 'Validation gate calculator', evidence: 'data_processed/validation_gate_calculator.csv; data_processed/validation_gate_status_summary.csv; docs/decision/validation-gate-calculator-v1.md', status: `done v1; ${validationGateCalculator.length} H1-H6 gate rows convert capture sheets into pass/hold/downgrade readiness` },
  { requirement: '5-market TAM/SAM/SOM method', evidence: 'docs/market/market-sizing-methodology.md; docs/market/market-source-confidence-review-v1.md; docs/market/monetization-proxy-matrix-v1.md; docs/market/competitor-revenue-proxy-review-v1.md; data_processed/tam_sam_som_model.csv; data_processed/market_source_confidence_review.csv; data_processed/market_confidence_summary.csv; data_processed/market_monetization_proxy_matrix.csv; data_processed/competitor_revenue_proxy_review.csv; data_processed/competitor_revenue_proxy_market_summary.csv', status: 'done v1; source confidence, market monetization proxy, and bottom-up competitor revenue proxy layers added; model remains range-based and not final forecast' },
  { requirement: 'Market-money triangulation', evidence: 'data_processed/market_money_triangulation.csv; data_processed/market_money_triangulation_summary.csv; docs/market/market-money-triangulation-v1.md', status: `done v1; ${marketMoneyTriangulation.length} market rows triangulate TAM/SAM/SOM, monetization proxy, competitor revenue proxy, paywall screenshots, and H2 gate status` },
  { requirement: 'Whitespace matrices', evidence: 'data_processed/whitespace_signal_matrix.csv; docs/intersections/whitespace-map-v2.md', status: 'done v1' },
  { requirement: 'Audience matrices', evidence: 'data_processed/audience_signal_matrix.csv; docs/audience/audience-segmentation-v1.md', status: 'done v1' },
  { requirement: 'ICP / audience segment matrix', evidence: 'data_processed/icp_segment_matrix.csv; docs/audience/icp-segment-matrix-v1.md', status: 'done v1; maps audience/review/forum/monetization evidence into testable ICP hypotheses' },
  { requirement: 'ICP validation packet', evidence: 'data_processed/icp_validation_test_plan.csv; docs/audience/icp-validation-packet-v1.md', status: 'done v1; interview/prototype/WTP/disconfirmation protocol created for top ICP selection' },
  { requirement: 'ICP recruiting bridge', evidence: 'data_processed/icp_recruiting_bridge.csv; data_processed/icp_recruiting_message_bank.csv; docs/audience/icp-recruiting-bridge-v1.md', status: `done v1; ${icpRecruitingBridge.length} segment-channel rows and ${icpRecruitingMessages.length} opt-in message rows connect evidence to recruiting and validation capture` },
  { requirement: 'Prototype validation stimulus', evidence: 'data_processed/prototype_validation_stimulus_flow.csv; data_processed/prototype_validation_scorecard.csv; docs/product/prototype-validation-stimulus-v1.md', status: 'done v1; two-minute loop stimulus, top-ICP comparison flow, and success/kill metrics ready; participant results pending' },
  { requirement: 'Versioned on GitHub', evidence: 'git log through current commit after push', status: 'active' },
  { requirement: 'Final PDF', evidence: 'output/pdf/alina-evidence-first-report-draft.pdf; output/pdf/alina-evidence-visual-report-v1.pdf', status: 'draft evidence PDF and visual PDF companion done' },
  { requirement: 'Russian narrative document', evidence: 'reports/alina-russian-narrative-report-v1.md; output/pdf/alina-russian-narrative-report-v1.pdf; data_processed/russian_narrative_evidence_map.csv; docs/decision/russian-narrative-evidence-map-v1.md', status: 'done v1; sequential Russian-language narrative report and argument map generated from evidence warehouse' },
  { requirement: 'Visual charts', evidence: 'docs/visuals/chart-index-v1.md; output/charts/*.svg; output/pdf/alina-evidence-visual-report-v1.pdf', status: 'draft chart pack and embedded visual PDF done' },
  { requirement: 'Evidence audit / claim register', evidence: 'data_processed/evidence_claim_register.csv; docs/decision/evidence-audit-v1.md', status: 'done v1; proof status, confidence, gaps, and next actions explicit' },
  { requirement: 'Evidence package manifest', evidence: 'data_processed/evidence_artifact_manifest.csv; docs/decision/evidence-package-manifest-v1.md', status: 'done v1; tracks key artifacts with row counts, source-reference coverage, sizes, and short hashes' },
  { requirement: 'Completion/readiness audit', evidence: 'data_processed/research_completion_audit.csv; docs/decision/research-completion-audit-v1.md', status: 'done v1; maps original objective to proved, partial, draft, and validation-ready requirements' },
  { requirement: 'Manual review of top 100', evidence: 'data_processed/top100_competitor_review_scorecard.csv; data_processed/top100_human_validation_queue.csv; data_processed/manual_competitor_inspection_packet.csv; data_processed/manual_competitor_inspection_rubric.csv; docs/competitive/top100-competitor-review-v1.md; docs/competitive/top100-competitor-battlecards-v1.md; docs/competitive/human-validation-guide-v1.md; docs/competitive/manual-competitor-inspection-packet-v1.md', status: 'AI-assisted review, ranked human validation queue, and first-wave manual inspection packet done v1; human execution pending' },
  { requirement: 'Detailed pricing/IAP extraction', evidence: 'data_raw/app_store_iap_pricing_raw.csv; data_processed/app_store_iap_pricing_summary.csv; docs/competitive/app-store-iap-pricing-v1.md; data_raw/google_play_pricing_raw.csv; data_processed/google_play_pricing_summary.csv; docs/competitive/google-play-pricing-v1.md; data_raw/web_paywall_discovery_raw.csv; data_processed/web_paywall_signal_matrix.csv; docs/competitive/web-paywall-validation-v1.md; data_processed/web_paywall_screenshot_validation.csv; data_processed/web_paywall_screenshot_interpretation.csv; data_processed/web_paywall_visual_adjudication.csv; data_processed/web_paywall_visual_adjudication_summary.csv; docs/competitive/web-paywall-screenshot-validation-v1.md; docs/competitive/web-paywall-screenshot-interpretation-v1.md; docs/competitive/web-paywall-visual-adjudication-v1.md; output/paywall_screenshots/*.png', status: 'App Store web IAP extraction, Google Play pricing validation, developer website paywall discovery, screenshot capture, OCR interpretation, and conservative visual adjudication done v1; human paywall sign-off pending' },
  { requirement: 'Review/forum evidence', evidence: 'data_raw/app_store_top_candidate_reviews.csv; data_raw/forum_evidence_signals.csv; data_raw/forum_quote_evidence_raw.csv; data_raw/expanded_reddit_competitor_mentions_raw.csv; data_processed/review_signal_matrix.csv; data_processed/review_jtbd_cluster_summary.csv; data_processed/community_referral_signal_rows.csv; data_processed/forum_quote_coding_matrix.csv; data_processed/reddit_competitor_mentions_summary.csv; data_processed/reddit_mention_signal_matrix.csv; data_processed/reddit_mention_app_summary.csv; data_processed/reddit_manual_reading_queue.csv; data_processed/reddit_manual_reading_prompt_bank.csv; data_processed/reddit_manual_reading_capture_sheet.csv; docs/audience/review-language-synthesis-v1.md; docs/audience/community-referral-evidence-v1.md; docs/audience/forum-evidence-synthesis-v1.md; docs/audience/forum-quote-coding-v1.md; docs/audience/reddit-competitor-mentions-v1.md; docs/audience/reddit-mention-signal-matrix-v1.md; docs/audience/reddit-manual-reading-queue-v1.md; docs/audience/reddit-manual-reading-capture-sheet-v1.md', status: `App Store review extraction, JTBD clustering, community/referral mining, forum source map, retrieval-assisted quote coding, source-native Reddit mention expansion, Reddit signal coding, ${redditManualReadingQueue.length} Reddit manual-read queue rows, and ${redditManualCaptureSheet.length} focused capture rows done v1; human validation pending` }
], [
  { key: 'requirement', label: 'Requirement' },
  { key: 'evidence', label: 'Evidence' },
  { key: 'status', label: 'Status' }
]));
fs.writeFileSync(STATUS_OUT, `${status.join('\n')}\n`);

console.log(`report=${OUT}`);
console.log(`status=${STATUS_OUT}`);
console.log(`expanded_rows=${expanded.length}`);
console.log(`audience_rows=${audience.length}`);
console.log(`icp_segments=${icpSegments.length}`);
console.log(`icp_validation_tests=${icpValidationPlan.length}`);
console.log(`prototype_stimulus_rows=${prototypeStimulusFlow.length}`);
console.log(`prototype_scorecard_metrics=${prototypeScorecard.length}`);
console.log(`market_claims=${claims.length}`);
console.log(`competitor_revenue_proxy_rows=${competitorRevenueProxy.length}`);
console.log(`competitor_revenue_proxy_strong=${strongRevenueProxyCompetitors.length}`);
console.log(`competitor_revenue_proxy_medium_plus=${mediumPlusRevenueProxyCompetitors.length}`);
console.log(`review_rows=${rawReviews.length}`);
console.log(`review_signal_rows=${reviewSignals.length}`);
console.log(`review_clusters=${reviewClusters.length}`);
console.log(`community_referral_rows=${communityReferralRows.length}`);
console.log(`forum_signal_rows=${forumSignals.length}`);
console.log(`forum_quote_rows=${forumQuoteCoding.length}`);
console.log(`iap_rows=${iapRaw.length}`);
console.log(`google_play_pricing_rows=${googlePlayPricing.length}`);
console.log(`web_paywall_rows=${webPaywallRaw.length}`);
console.log(`web_paywall_domains=${webPaywallSignals.length}`);
console.log(`web_paywall_screenshots=${webPaywallCapturedScreenshots.length}/${webPaywallScreenshots.length}`);
console.log(`web_paywall_screenshot_interpretations=${webPaywallScreenshotInterpretation.length}`);
console.log(`web_paywall_visual_adjudications=${webPaywallVisualAdjudication.length}`);
console.log(`web_paywall_visual_confirmed=${confirmedVisualPricing.length}`);
console.log(`web_paywall_visual_partial=${partialVisualPaidSurface.length}`);
console.log(`human_validation_queue_rows=${humanValidationQueue.length}`);
console.log(`manual_inspection_targets=${manualInspectionPacket.length}`);
console.log(`manual_inspection_rubric=${manualInspectionRubric.length}`);
console.log(`public_listing_inspection_rows=${publicListingInspection.length}`);
console.log(`public_listing_visible_causality=${publicListingVisibleCausality.length}`);
console.log(`evidence_audit_rows=${evidenceAudit.length}`);
console.log(`evidence_manifest_rows=${evidenceManifest.length}`);
console.log(`completion_audit_rows=${completionAudit.length}`);
console.log(`hypothesis_decision_rows=${hypothesisDecisions.length}`);
console.log(`p0_command_rows=${p0CommandCenter.length}`);
console.log(`p0_field_guide_sections=${p0FieldGuide.length}`);
console.log(`russian_validation_fieldbook_rows=${russianValidationFieldbook.length}`);
console.log(`validation_workspace_lanes=${validationWorkspace.length}`);
console.log(`validation_batch01_rows=${validationBatch01.length}`);
console.log(`validation_batch02_rows=${validationBatch02.length}`);
console.log(`validation_batch03_rows=${validationBatch03.length}`);
console.log(`validation_batch_local_artifact_links=${validationBatchPrefilledLocalArtifacts}`);
console.log(`validation_evidence_rollup_rows=${validationEvidenceRollup.length}`);
console.log(`validation_tranche_planner_rows=${validationTranchePlanner.length}`);
console.log(`source_expansion_backlog_rows=${sourceExpansionBacklog.length}`);
console.log(`p0_external_rows=${p0ExternalSources.length}`);
console.log(`p0_external_usable=${p0ExternalUsable.length}`);
console.log(`itch_rows=${itchRows.length}`);
console.log(`itch_ok=${itchOk.length}`);
console.log(`steam_tag_rows=${steamTagRows.length}`);
console.log(`steam_tag_ok=${steamTagOk.length}`);
console.log(`desktop_store_rows=${desktopStoreRows.length}`);
console.log(`desktop_store_ok=${desktopStoreOk.length}`);
console.log(`reddit_mention_rows=${redditMentionRows.length}`);
console.log(`reddit_mention_ok=${redditMentionOk.length}`);
console.log(`reddit_mention_signal_rows=${redditMentionSignals.length}`);
console.log(`reddit_mention_app_summary_rows=${redditMentionAppSummary.length}`);
console.log(`reddit_manual_read_queue_rows=${redditManualReadingQueue.length}`);
console.log(`reddit_manual_read_p0=${redditManualP0.length}`);
console.log(`reddit_manual_capture_rows=${redditManualCaptureSheet.length}`);
console.log(`cross_source_raw_rows=${crossSourceRaw.length}`);
console.log(`cross_source_dedup_rows=${crossSourceDedup.length}`);
console.log(`cross_source_coverage_cells=${crossSourceCoverage.length}`);
console.log(`cross_source_saturation_markets=${crossSourceSaturation.length}`);
console.log(`chrome_extension_detail_rows=${chromeExtensionFit.length}`);
console.log(`chrome_extension_strong=${chromeExtensionStrong.length}`);
console.log(`chrome_extension_battlecards=${chromeExtensionBattlecards.length}`);
console.log(`chrome_extension_priority=${chromeMechanicPriority.length}`);
console.log(`validation_gap_rows=${validationGapRoadmap.length}`);
console.log(`validation_execution_tasks=${validationExecutionDashboard.length}`);
