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
  if (!fs.existsSync(file) && file === 'data_processed/cross_source_universe_raw.csv') {
    return csvShards('data_processed/cross_source_universe_raw_index.csv');
  }
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : [];
}

function csvShards(indexFile) {
  if (!fs.existsSync(indexFile)) return [];
  return parseCsv(fs.readFileSync(indexFile, 'utf8'))
    .flatMap(row => fs.existsSync(row.file_path) ? parseCsv(fs.readFileSync(row.file_path, 'utf8')) : []);
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
const marketAssumptionAudit = csv('data_processed/market_sizing_assumption_audit.csv');
const marketStressTest = csv('data_processed/market_sizing_stress_test.csv');
const monetizationProxy = csv('data_processed/market_monetization_proxy_matrix.csv');
const marketMoneyTriangulation = csv('data_processed/market_money_triangulation.csv');
const marketMoneyTriangulationSummary = csv('data_processed/market_money_triangulation_summary.csv');
const competitorRevenueProxy = csv('data_processed/competitor_revenue_proxy_review.csv');
const competitorRevenueProxySummary = csv('data_processed/competitor_revenue_proxy_market_summary.csv');
const top100 = csv('data_processed/top100_competitor_review_scorecard.csv');
const validationQueue = csv('data_processed/top100_human_validation_queue.csv');
const manualInspectionPacket = csv('data_processed/manual_competitor_inspection_packet.csv');
const manualInspectionRubric = csv('data_processed/manual_competitor_inspection_rubric.csv');
const publicListingInspection = csv('data_processed/public_listing_inspection_results.csv');
const publicListingSummary = csv('data_processed/public_listing_inspection_summary.csv');
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
const communityReferralRows = csv('data_processed/community_referral_signal_rows.csv');
const communityReferralSummary = csv('data_processed/community_referral_summary.csv');
const forumSources = csv('data_raw/forum_evidence_signals.csv');
const forumQuotes = csv('data_processed/forum_quote_coding_matrix.csv');
const icpSegments = csv('data_processed/icp_segment_matrix.csv');
const icpValidationPlan = csv('data_processed/icp_validation_test_plan.csv');
const icpRecruitingBridge = csv('data_processed/icp_recruiting_bridge.csv');
const icpRecruitingMessages = csv('data_processed/icp_recruiting_message_bank.csv');
const prototypeStimulusFlow = csv('data_processed/prototype_validation_stimulus_flow.csv');
const prototypeScorecard = csv('data_processed/prototype_validation_scorecard.csv');
const productCore = csv('data_processed/product_core_evidence_matrix.csv');
const p0External = csv('data_raw/expanded/p0_external_sources_raw.csv');
const itchRows = csv('data_raw/expanded_itch_raw.csv');
const steamTagRows = csv('data_raw/expanded_steam_tags_raw.csv');
const desktopStoreRows = csv('data_raw/expanded_desktop_store_raw.csv');
const chromeExtensionRows = csv('data_raw/expanded_chrome_extensions_raw.csv');
const redditMentionRows = csv('data_raw/expanded_reddit_competitor_mentions_raw.csv');
const redditMentionSummary = csv('data_processed/reddit_competitor_mentions_summary.csv');
const redditMentionSignals = csv('data_processed/reddit_mention_signal_matrix.csv');
const redditMentionAppSummary = csv('data_processed/reddit_mention_app_summary.csv');
const chromeExtensionFit = csv('data_processed/chrome_extension_fit_matrix.csv');
const chromeExtensionBattlecards = csv('data_processed/chrome_extension_mechanic_battlecards.csv');
const crossSourceRaw = csv('data_processed/cross_source_universe_raw.csv');
const crossSourceDedup = csv('data_processed/cross_source_universe_dedup.csv');
const crossSourceSummary = csv('data_processed/cross_source_universe_summary.csv');
const crossSourceCoverage = csv('data_processed/cross_source_coverage_matrix.csv');
const crossSourceSaturation = csv('data_processed/cross_source_market_saturation_matrix.csv');
const validationGapRoadmap = csv('data_processed/validation_gap_roadmap.csv');
const validationExecutionDashboard = csv('data_processed/validation_execution_dashboard.csv');
const p0CommandCenter = csv('data_processed/p0_validation_command_center.csv');
const p0FieldGuide = csv('data_processed/p0_validation_field_guide.csv');
const validationWorkspace = csv('data_processed/validation_evidence_workspace_index.csv');
const validationBatch01 = csv('data_processed/validation_batch_01_index.csv');
const validationBatch02 = csv('data_processed/validation_batch_02_index.csv');
const validationBatch03 = csv('data_processed/validation_batch_03_index.csv');
const validationBatchPrefilledLocalArtifacts = [...validationBatch01, ...validationBatch02, ...validationBatch03]
  .filter(row => row.prefill_status === 'existing_local_artifact_linked').length;
const validationEvidenceRollup = csv('data_processed/validation_evidence_rollup.csv');
const validationGateCalculator = csv('data_processed/validation_gate_calculator.csv');
const validationGateStatusSummary = csv('data_processed/validation_gate_status_summary.csv');
const evidenceManifest = csv('data_processed/evidence_artifact_manifest.csv');
const completionAudit = csv('data_processed/research_completion_audit.csv');
const hypothesisDecisions = csv('data_processed/hypothesis_decision_matrix.csv');
const highUseMarketSources = marketSourceConfidence.filter(row => row.confidence_review_band === 'high_use');
const rangeOnlyMarketSources = marketSourceConfidence.filter(row => ['low_use_range_only', 'context_only'].includes(row.confidence_review_band));
const strongMonetizationMarkets = monetizationProxy.filter(row => row.monetization_proxy_band === 'strong_paid_behavior_proxy');
const strongTriangulatedMoneyMarkets = marketMoneyTriangulation.filter(row => row.money_triangulation_verdict === 'strong_directional_money_case');
const mediumTriangulatedMoneyMarkets = marketMoneyTriangulation.filter(row => row.money_triangulation_verdict === 'medium_directional_money_case');
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
const manualInspectionStrongMoney = manualInspectionPacket.filter(row => row.revenue_proxy_band === 'strong_bottom_up_money_proxy');
const manualInspectionBehaviorPrefill = manualInspectionPacket.filter(row => row.behavior_tied_progression_prefill === 'yes');
const publicListingInspected = publicListingInspection.filter(row => row.public_listing_inspection_status === 'public_listing_inspected');
const publicListingVisibleCausality = publicListingInspection.filter(row => row.action_to_avatar_causality_public_read === 'visible_in_public_copy');
const publicListingHighCloneRisk = publicListingInspection.filter(row => row.hidden_clone_risk_public_read === 'high_hidden_clone_risk_requires_app_walkthrough');
const reviewApps = new Set(reviews.map(row => row.app_store_id).filter(Boolean)).size;
const forumSourceCount = new Set(forumQuotes.map(row => row.source_id).filter(Boolean)).size;
const strongIcpSegments = icpSegments.filter(row => row.evidence_band === 'strong_directional_icp');
const prototypeSegments = new Set(prototypeStimulusFlow.map(row => row.segment_id).filter(Boolean));
const prototypeScreens = new Set(prototypeStimulusFlow.map(row => row.screen_id).filter(Boolean));
const intersection = tam.find(row => row.pillar === 'intersection') || {};
const p0ExternalUsable = p0External.filter(row => row.collection_status === 'ok');
const itchOk = itchRows.filter(row => row.collection_status === 'ok');
const steamTagOk = steamTagRows.filter(row => row.collection_status === 'ok');
const desktopStoreOk = desktopStoreRows.filter(row => row.collection_status === 'ok');
const chromeExtensionOk = chromeExtensionRows.filter(row => row.collection_status === 'ok');
const redditMentionOk = redditMentionRows.filter(row => row.collection_status === 'ok');
const redditMentionKnownSignalRows = redditMentionSignals.filter(row => clean(row.app_name) && row.collection_status === 'ok');
const redditMediumPlusSignals = redditMentionSignals.filter(row => ['medium_high_qualitative', 'medium_qualitative'].includes(row.competitor_signal_strength));
const chromeExtensionDetailOk = chromeExtensionFit.filter(row => row.detail_status === 'ok');
const chromeExtensionStrong = chromeExtensionFit.filter(row => row.alina_fit_band === 'strong_adjacent');
const chromeMechanicPriority = chromeExtensionBattlecards.filter(row => ['mechanic_threat_high', 'mechanic_threat_medium', 'mechanic_reference_high'].includes(row.threat_band));
const validationRoadmapP0 = validationGapRoadmap.filter(row => row.priority === 'P0');
const validationExecutionP0 = validationExecutionDashboard.filter(row => row.priority === 'P0');
const p0CommandBlockers = p0CommandCenter.filter(row => row.priority === 'P0_blocker');
const p0CommandRows = p0CommandCenter.filter(row => row.priority === 'P0');
const validationGatesPassed = validationGateCalculator.filter(row => row.gate_status === 'pass_ready_for_review');
const validationGatesNotStarted = validationGateCalculator.filter(row => row.gate_status === 'not_started');
const validationGatesInProgress = validationGateCalculator.filter(row => row.gate_status === 'in_progress_insufficient_evidence');
const validationGatesDowngrade = validationGateCalculator.filter(row => row.gate_status === 'kill_or_downgrade_triggered');
const manifestMissing = evidenceManifest.filter(row => row.exists !== 'yes');
const manifestCsvRows = evidenceManifest.filter(row => row.file_path.endsWith('.csv'));
const manifestTrackedRows = manifestCsvRows.reduce((sum, row) => sum + Number(row.row_count || 0), 0);
const completionOpen = completionAudit.filter(row => !/^proved/.test(row.status));
const holdHypothesisDecisions = hypothesisDecisions.filter(row => row.current_decision === 'hold_validate').length;
const goHypothesisDecisions = hypothesisDecisions.filter(row => row.current_decision === 'go_for_next_phase').length;
const stopHypothesisDecisions = hypothesisDecisions.filter(row => row.current_decision === 'stop_or_pivot').length;
const competitorUniverseStatus = crossSourceDedup.length >= 30000
  ? 'proved_30k_plus_cross_source_dedup_upper_bound_open'
  : 'substantial_v1_not_50k_dedup';
const competitorUniverseGap = crossSourceDedup.length >= 30000
  ? 'The 30k lower-bound dedup target is met; upper-bound 50k expansion and Product Hunt/AlternativeTo, Microsoft Store, B2B directories, Reddit mentions, and additional source-native coverage remain backlog.'
  : 'Cross-source dedup universe is substantial but still below the aspirational 30k-50k app target; Product Hunt/AlternativeTo, Microsoft Store, B2B directories, Reddit mentions, and deeper source-native expansion remain backlog.';

const rows = [
  {
    claim_id: 'REQ_plan',
    claim_type: 'project_requirement',
    claim: 'A large expansion plan/backlog exists and routes the research into phased work.',
    evidence_status: 'proved_v1',
    confidence: 'high',
    primary_metric: `master plan exists; ${validationGapRoadmap.length} validation roadmap rows; ${validationExecutionDashboard.length} execution tasks`,
    quantitative_evidence: `roadmap_rows=${validationGapRoadmap.length}; roadmap_p0=${validationRoadmapP0.length}; execution_tasks=${validationExecutionDashboard.length}; execution_p0=${validationExecutionP0.length}`,
    evidence_files: 'docs/research-expansion-master-plan.md;docs/strategy/research-phases.md;docs/decision/validation-gap-roadmap-v1.md;docs/decision/validation-execution-dashboard-v1.md;data_processed/validation_gap_roadmap.csv;data_processed/validation_execution_dashboard.csv;reports/expanded-research-kickoff-2026-05-31.md',
    strongest_support: 'Research expansion plan, phase docs, validation gap roadmap, and validation execution dashboard exist in repository.',
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
    claim_id: 'REQ_hypothesis_decision_matrix',
    claim_type: 'project_requirement',
    claim: 'H1-H6 are translated into explicit go/hold/kill operating decisions.',
    evidence_status: hypothesisDecisions.length ? 'proved_v1_open_validation_decisions' : 'missing',
    confidence: hypothesisDecisions.length ? 'high' : 'low',
    primary_metric: `${hypothesisDecisions.length} hypothesis decision rows; ${holdHypothesisDecisions} hold/validate; ${goHypothesisDecisions} go; ${stopHypothesisDecisions} stop/pivot`,
    quantitative_evidence: `decision_rows=${hypothesisDecisions.length}; hold_validate=${holdHypothesisDecisions}; go_for_next_phase=${goHypothesisDecisions}; stop_or_pivot=${stopHypothesisDecisions}`,
    evidence_files: 'data_processed/hypothesis_decision_matrix.csv;docs/decision/hypothesis-decision-matrix-v1.md',
    strongest_support: 'Decision matrix links H1-H6 to current evidence status, confidence, go gates, hold gates, kill/pivot gates, next actions, workstreams, and capture rows.',
    key_gap: 'Decision rows remain validation gates, not final proof: competitor walkthroughs, paywall sign-off, ICP interviews, and prototype sessions are still open.',
    next_action: 'Use the hold/validate rows as the next execution order and update decisions only after observed evidence is captured.'
  },
  {
    claim_id: 'REQ_market_money_triangulation',
    claim_type: 'project_requirement',
    claim: 'TAM/SAM/SOM, source confidence, stress tests, monetization proxies, competitor revenue proxies, and paywall evidence are triangulated into market-level money verdicts.',
    evidence_status: marketMoneyTriangulation.length ? 'proved_v1_triangulated_proxy_not_final' : 'missing',
    confidence: marketMoneyTriangulation.length ? 'medium_high' : 'low',
    primary_metric: `${marketMoneyTriangulation.length} market rows; ${strongTriangulatedMoneyMarkets.length} strong and ${mediumTriangulatedMoneyMarkets.length} medium directional money cases`,
    quantitative_evidence: `triangulation_rows=${marketMoneyTriangulation.length}; verdict_rows=${marketMoneyTriangulationSummary.length}; strong_directional=${strongTriangulatedMoneyMarkets.length}; medium_directional=${mediumTriangulatedMoneyMarkets.length}; strong_paid_proxy_markets=${strongMonetizationMarkets.length}; h2_gate=${validationGateCalculator.find(row => row.linked_hypotheses === 'H2')?.gate_status || 'missing'}`,
    evidence_files: 'data_processed/market_money_triangulation.csv;data_processed/market_money_triangulation_summary.csv;docs/market/market-money-triangulation-v1.md;data_processed/tam_sam_som_model.csv;data_processed/market_sizing_assumption_audit.csv;data_processed/market_monetization_proxy_matrix.csv;data_processed/competitor_revenue_proxy_market_summary.csv;data_processed/web_paywall_visual_adjudication_summary.csv;data_processed/validation_gate_calculator.csv',
    strongest_support: 'Triangulation matrix normalizes market names, scores source quality, monetization proxy strength, competitor revenue proxy strength, public paywall visibility, and risk penalties, while keeping H2 gated by paid-flow/WTP validation.',
    key_gap: 'This is public-evidence triangulation, not final revenue proof. H2 still needs paid-flow human signoff, product-match notes, and WTP evidence from prototype/ICP sessions.',
    next_action: 'Use the strong and medium directional markets to prioritize paid-flow capture rows and WTP probes, then rerun H2 gate calculation.'
  },
  {
    claim_id: 'REQ_p0_validation_command_center',
    claim_type: 'project_requirement',
    claim: 'Open P0 validation is converted into an operator-ready command center.',
    evidence_status: p0CommandCenter.length ? 'proved_v1_operator_ready_open_gates' : 'missing',
    confidence: p0CommandCenter.length ? 'high' : 'low',
    primary_metric: `${p0CommandCenter.length} command rows; ${p0CommandBlockers.length} blocker rows; ${p0CommandRows.length} P0 rows`,
    quantitative_evidence: `command_rows=${p0CommandCenter.length}; p0_blockers=${p0CommandBlockers.length}; p0_rows=${p0CommandRows.length}; execution_p0=${validationExecutionP0.length}`,
    evidence_files: 'data_processed/p0_validation_command_center.csv;docs/decision/p0-validation-command-center-v1.md;data_processed/validation_execution_dashboard.csv;docs/decision/validation-execution-dashboard-v1.md',
    strongest_support: 'Command center expands P0 tasks into exact evidence to capture, pass gates, downgrade/kill gates, source files, output files, and notes fields to fill.',
    key_gap: 'The command center is operational scaffolding; it still requires actual screenshots, participant evidence, paywall signoff, and updated verdicts.',
    next_action: 'Execute blocker rows first: direct competitor walkthrough for Shepherd, avatar-change prototype comprehension, differentiation/trust scorecard gates, then paid-flow signoff and ICP interviews.'
  },
  {
    claim_id: 'REQ_p0_validation_field_guide',
    claim_type: 'project_requirement',
    claim: 'P0 validation has executable field scripts and evidence-handling rules.',
    evidence_status: p0FieldGuide.length ? 'proved_v1_execution_scripts_ready_open_gates' : 'missing',
    confidence: p0FieldGuide.length ? 'high' : 'low',
    primary_metric: `${p0FieldGuide.length} field guide sections; ${p0CommandCenter.length} command rows referenced`,
    quantitative_evidence: `field_guide_sections=${p0FieldGuide.length}; command_rows=${p0CommandCenter.length}; p0_blockers=${p0CommandBlockers.length}`,
    evidence_files: 'data_processed/p0_validation_field_guide.csv;docs/decision/p0-validation-field-guide-v1.md;data_processed/p0_validation_command_center.csv;docs/decision/p0-validation-command-center-v1.md',
    strongest_support: 'Field guide provides scripts for competitor walkthrough, paid-flow signoff, ICP interviews, prototype sessions, scorecard calculation, evidence naming, and post-validation rebuild/commit protocol.',
    key_gap: 'Field guide is still an execution artifact, not observed validation evidence.',
    next_action: 'Use the scripts to run the first validation tranche and update capture sheets with screenshots, quotes, observed values, and final verdicts.'
  },
  {
    claim_id: 'REQ_validation_evidence_workspace',
    claim_type: 'project_requirement',
    claim: 'Validation evidence has a local intake workspace with templates and lane-level folders.',
    evidence_status: validationWorkspace.length ? 'proved_v1_intake_workspace_ready_open_gates' : 'missing',
    confidence: validationWorkspace.length ? 'high' : 'low',
    primary_metric: `${validationWorkspace.length} workspace lanes; output/validation README and templates generated`,
    quantitative_evidence: `workspace_lanes=${validationWorkspace.length}; field_guide_sections=${p0FieldGuide.length}; command_rows=${p0CommandCenter.length}`,
    evidence_files: 'data_processed/validation_evidence_workspace_index.csv;docs/decision/validation-evidence-workspace-v1.md;output/validation/README.md;output/validation/templates/generic-validation-note-template.md',
    strongest_support: 'Workspace creates lane folders, lane READMEs, and note templates tied to command_id naming conventions.',
    key_gap: 'Workspace is empty until real screenshots, notes, quotes, and calculations are captured.',
    next_action: 'Store first validation tranche evidence under output/validation/<date>/<lane>/ and link paths into source CSVs.'
  },
  {
    claim_id: 'REQ_validation_batch_01',
    claim_type: 'project_requirement',
    claim: 'The first blocker validation tranche has prefilled local note files.',
    evidence_status: validationBatch01.length ? 'proved_v1_batch_ready_open_gates' : 'missing',
    confidence: validationBatch01.length ? 'high' : 'low',
    primary_metric: `${validationBatch01.length} batch rows; ${validationBatch01.filter(row => row.status === 'not_started').length} not started; ${validationBatch01.filter(row => row.prefill_status === 'existing_local_artifact_linked').length} local artifacts linked`,
    quantitative_evidence: `batch_rows=${validationBatch01.length}; blocker_rows=${p0CommandBlockers.length}; note_files=${validationBatch01.length}; local_artifact_links=${validationBatch01.filter(row => row.prefill_status === 'existing_local_artifact_linked').length}`,
    evidence_files: 'data_processed/validation_batch_01_index.csv;docs/decision/validation-batch-01-v1.md;output/validation/2026-05-31',
    strongest_support: 'Batch 01 creates prefilled notes for every P0 blocker command and links each note to command_id, gate, source files, and output files to update.',
    key_gap: 'Batch files are prefilled intake notes; they still need observed screenshots, quotes, measured values, and final verdicts.',
    next_action: 'Fill Batch 01 notes before upgrading or downgrading H1/H3/H4/H6.'
  },
  {
    claim_id: 'REQ_validation_batch_02',
    claim_type: 'project_requirement',
    claim: 'The full non-blocker P0 validation breadth has prefilled local note files.',
    evidence_status: validationBatch02.length ? 'proved_v1_p0_breadth_batch_ready_open_gates' : 'missing',
    confidence: validationBatch02.length ? 'high' : 'low',
    primary_metric: `${validationBatch02.length} batch rows; ${validationBatch02.filter(row => row.status === 'not_started').length} not started; ${validationBatch02.filter(row => row.prefill_status === 'existing_local_artifact_linked').length} local artifacts linked`,
    quantitative_evidence: `batch_rows=${validationBatch02.length}; p0_rows=${p0CommandRows.length}; note_files=${validationBatch02.length}; local_artifact_links=${validationBatch02.filter(row => row.prefill_status === 'existing_local_artifact_linked').length}`,
    evidence_files: 'data_processed/validation_batch_02_index.csv;docs/decision/validation-batch-02-v1.md;output/validation/2026-05-31',
    strongest_support: 'Batch 02 creates prefilled notes for every non-blocker P0 command across manual walkthrough, paid-flow signoff, ICP interviews, prototype sessions, and scorecard gates.',
    key_gap: 'Batch files are prefilled intake notes; they still need observed screenshots, quotes, measured values, and final verdicts.',
    next_action: 'Work through Batch 02 after blocker notes or in parallel where the evidence lane is independent.'
  },
  {
    claim_id: 'REQ_validation_batch_03',
    claim_type: 'project_requirement',
    claim: 'All P1 context validation commands have prefilled local note files.',
    evidence_status: validationBatch03.length ? 'proved_v1_context_batch_ready_open_gates' : 'missing',
    confidence: validationBatch03.length ? 'high' : 'low',
    primary_metric: `${validationBatch03.length} batch rows; ${validationBatch03.filter(row => row.status === 'not_started').length} not started; ${validationBatch03.filter(row => row.prefill_status === 'existing_local_artifact_linked').length} local artifacts linked`,
    quantitative_evidence: `batch_rows=${validationBatch03.length}; p1_context_rows=${p0CommandCenter.filter(row => row.priority === 'P1_context').length}; note_files=${validationBatch03.length}; local_artifact_links=${validationBatch03.filter(row => row.prefill_status === 'existing_local_artifact_linked').length}`,
    evidence_files: 'data_processed/validation_batch_03_index.csv;docs/decision/validation-batch-03-v1.md;output/validation/2026-05-31',
    strongest_support: 'Batch 03 creates prefilled notes for every P1_context command, currently the paid-flow context checks that should improve monetization confidence without blocking hypothesis gates.',
    key_gap: 'Batch files are prefilled context notes; they still need observed pricing/paywall checks and conservative signoff decisions.',
    next_action: 'Use Batch 03 to confirm, weaken, or reject contextual paid-flow signals after P0 evidence is underway.'
  },
  {
    claim_id: 'REQ_validation_evidence_rollup',
    claim_type: 'project_requirement',
    claim: 'Validation intake has command-level rollup coverage across all batch notes and linked local artifacts.',
    evidence_status: validationEvidenceRollup.length ? 'proved_v1_command_level_rollup_open_gates' : 'missing',
    confidence: validationEvidenceRollup.length ? 'high' : 'low',
    primary_metric: `${validationEvidenceRollup.length} command rows; ${validationEvidenceRollup.filter(row => row.note_exists === 'yes').length} notes present; ${validationEvidenceRollup.filter(row => row.evidence_state === 'local_artifact_linked_not_signed_off').length} local artifacts linked`,
    quantitative_evidence: `rollup_rows=${validationEvidenceRollup.length}; notes_present=${validationEvidenceRollup.filter(row => row.note_exists === 'yes').length}; local_artifact_links=${validationEvidenceRollup.filter(row => row.evidence_state === 'local_artifact_linked_not_signed_off').length}; missing_batch_notes=${validationEvidenceRollup.filter(row => row.evidence_state === 'missing_batch_note').length}`,
    evidence_files: 'data_processed/validation_evidence_rollup.csv;docs/decision/validation-evidence-rollup-v1.md;data_processed/validation_batch_01_index.csv;data_processed/validation_batch_02_index.csv;data_processed/validation_batch_03_index.csv',
    strongest_support: 'Rollup verifies command-to-note coverage, note existence, local artifact links, and conservative evidence states for every command row.',
    key_gap: 'Rollup is an intake audit, not a validation result: most rows still need observed screenshots, quotes, calculations, or human signoff.',
    next_action: 'Use rollup evidence_state to prioritize rows with no local artifact and paid-flow rows awaiting human signoff.'
  },
  {
    claim_id: 'REQ_validation_gate_calculator',
    claim_type: 'project_requirement',
    claim: 'Observed validation capture rows are converted into explicit H1-H6 gate status before any hypothesis is upgraded.',
    evidence_status: validationGateCalculator.length ? 'proved_v1_calculator_ready_open_gates' : 'missing',
    confidence: validationGateCalculator.length ? 'high' : 'low',
    primary_metric: `${validationGateCalculator.length} gate rows; ${validationGatesPassed.length} pass-ready; ${validationGatesInProgress.length} in-progress; ${validationGatesNotStarted.length} not started; ${validationGatesDowngrade.length} downgrade/kill triggered`,
    quantitative_evidence: `gate_rows=${validationGateCalculator.length}; status_summary_rows=${validationGateStatusSummary.length}; pass_ready=${validationGatesPassed.length}; in_progress=${validationGatesInProgress.length}; not_started=${validationGatesNotStarted.length}; downgrade_or_kill=${validationGatesDowngrade.length}`,
    evidence_files: 'data_processed/validation_gate_calculator.csv;data_processed/validation_gate_status_summary.csv;docs/decision/validation-gate-calculator-v1.md;data_processed/manual_walkthrough_capture_sheet.csv;data_processed/paid_flow_capture_sheet.csv;data_processed/icp_interview_capture_sheet.csv;data_processed/prototype_session_capture_sheet.csv',
    strongest_support: 'Gate calculator reads the four capture sheets and maps evidence into H1 product shape, H2 money, H3 whitespace, H4 competitive advantage, H5 audience, and H6 product-core gates with thresholds and decision effects.',
    key_gap: 'The calculator is ready, but current capture rows are still unobserved; it deliberately keeps gates in hold/validate until screenshots, quotes, scores, and human signoff are entered.',
    next_action: 'Fill capture rows for manual walkthrough, paid-flow, ICP interviews, and prototype sessions, then rerun the calculator before updating hypothesis decisions.'
  },
  {
    claim_id: 'REQ_competitor_universe',
    claim_type: 'project_requirement',
    claim: 'Competitor/source universe has been expanded across the five target markets.',
    evidence_status: competitorUniverseStatus,
    confidence: 'medium_high',
    primary_metric: `${crossSourceRaw.length} cross-source raw rows; ${crossSourceDedup.length} cross-source dedup rows; ${crossSourceCoverage.length} coverage cells; ${crossSourceCoverage.filter(row => row.coverage_band === 'strong_coverage').length} strong and ${crossSourceCoverage.filter(row => row.coverage_band === 'medium_coverage').length} medium source/market cells`,
    quantitative_evidence: `niches=${Object.keys(countBy(expanded, 'niche')).length}; source_kinds=${Object.keys(countBy(expanded, 'source_kind')).length}; cross_source_summary_rows=${crossSourceSummary.length}; coverage_cells=${crossSourceCoverage.length}; coverage_strong=${crossSourceCoverage.filter(row => row.coverage_band === 'strong_coverage').length}; coverage_medium=${crossSourceCoverage.filter(row => row.coverage_band === 'medium_coverage').length}; p0_external_rows=${p0External.length}; p0_external_usable=${p0ExternalUsable.length}; itch_rows=${itchRows.length}; itch_ok=${itchOk.length}; steam_tag_rows=${steamTagRows.length}; steam_tag_ok=${steamTagOk.length}; desktop_store_rows=${desktopStoreRows.length}; desktop_store_ok=${desktopStoreOk.length}; chrome_extension_rows=${chromeExtensionRows.length}; chrome_extension_ok=${chromeExtensionOk.length}; reddit_mention_rows=${redditMentionRows.length}; reddit_mention_ok=${redditMentionOk.length}; reddit_mention_summary_rows=${redditMentionSummary.length}; reddit_signal_rows=${redditMentionSignals.length}; reddit_signal_groups=${Object.keys(countBy(redditMentionSignals, 'signal_group')).length}; reddit_known_signal_rows=${redditMentionKnownSignalRows.length}; reddit_app_summary_rows=${redditMentionAppSummary.length}; chrome_detail_ok=${chromeExtensionDetailOk.length}; chrome_strong_adjacent=${chromeExtensionStrong.length}; chrome_priority_mechanics=${chromeMechanicPriority.length}`,
    evidence_files: 'data_raw/expanded/all_expanded_raw.csv;data_raw/expanded/all_expanded_dedup.csv;data_raw/expanded/p0_external_sources_raw.csv;data_raw/expanded_itch_raw.csv;data_raw/expanded_steam_tags_raw.csv;data_raw/expanded_desktop_store_raw.csv;data_raw/expanded_chrome_extensions_raw.csv;data_raw/expanded_reddit_competitor_mentions_raw.csv;data_raw/chrome_extension_detail_raw.csv;data_processed/cross_source_universe_raw_index.csv;data_processed/cross_source_universe_raw_parts/part_*.csv;data_processed/cross_source_universe_dedup.csv;data_processed/cross_source_universe_summary.csv;data_processed/cross_source_coverage_matrix.csv;data_processed/p0_external_source_summary.csv;data_processed/itch_source_summary.csv;data_processed/steam_tag_source_summary.csv;data_processed/desktop_store_source_summary.csv;data_processed/chrome_webstore_source_expansion_summary.csv;data_processed/reddit_competitor_mentions_summary.csv;data_processed/reddit_mention_signal_matrix.csv;data_processed/reddit_mention_app_summary.csv;data_processed/chrome_extension_fit_matrix.csv;data_processed/chrome_extension_mechanic_battlecards.csv;data_processed/competitor_feature_matrix.csv;docs/competitive/cross-source-universe-v1.md;docs/competitive/cross-source-coverage-matrix-v1.md;docs/competitive/expanded-source-map.md;docs/competitive/p0-external-source-collection-v1.md;docs/competitive/itch-source-expansion-v1.md;docs/competitive/steam-tag-expansion-v1.md;docs/competitive/desktop-store-expansion-v1.md;docs/competitive/chrome-webstore-source-expansion-v1.md;docs/audience/reddit-competitor-mentions-v1.md;docs/audience/reddit-mention-signal-matrix-v1.md;docs/competitive/chrome-extension-detail-enrichment-v1.md;docs/competitive/chrome-extension-mechanic-battlecards-v1.md',
    strongest_support: 'Large cross-source universe exists across App Store, Steam, Google Play fallback, source-native itch.io/Steam tags, source-native Mac App Store desktop search, Chrome Web Store expansion with detail-page enrichment, and old.reddit forum mention discovery with coded signal groups.',
    key_gap: competitorUniverseGap,
    next_action: 'Continue source-native expansion through Product Hunt/AlternativeTo, Microsoft Store, B2B directories, Reddit mentions, and deeper itch/Steam tags while keeping evidence quality labels explicit.'
  },
  {
    claim_id: 'H1_product_shape_exists',
    claim_type: 'product_hypothesis',
    claim: 'The proposed product shape exists as an intersection of meaning, daily action, reset, identity/avatar feedback, and progression.',
    evidence_status: publicListingInspection.length ? 'public_listing_inspected_walkthrough_open' : 'manual_inspection_packet_ready',
    confidence: 'medium',
    primary_metric: `${top100.length} top-candidate rows; ${primary.length} primary apps; ${manualInspectionPacket.length} P0 inspection targets; ${publicListingInspected.length} public listings inspected`,
    quantitative_evidence: `primary_apps=${primary.length}; high_threat=${highThreat.length}; direct_reference=${direct.length}; behavior_tied=${behaviorTied.length}; manual_inspection_targets=${manualInspectionPacket.length}; manual_inspection_rubric=${manualInspectionRubric.length}; inspection_strong_money=${manualInspectionStrongMoney.length}; public_listing_rows=${publicListingInspection.length}; public_listing_visible_causality=${publicListingVisibleCausality.length}`,
    evidence_files: 'data_processed/top100_competitor_review_scorecard.csv;data_processed/manual_competitor_inspection_packet.csv;data_processed/manual_competitor_inspection_rubric.csv;data_processed/public_listing_inspection_results.csv;docs/competitive/top100-competitor-review-v1.md;docs/competitive/manual-competitor-inspection-packet-v1.md;docs/competitive/public-listing-inspection-v1.md;docs/product/product-core-evidence-v1.md',
    strongest_support: 'Top-100 scorecard shows adjacent products combining required primitives; the P0 packet defines the inspection workflow; the public-listing layer has now inspected all 12 P0 listing excerpts and found the highest-risk visible causality cases for walkthrough.',
    key_gap: 'Strict full loop is rare and still needs actual app/onboarding screenshots to confirm or downgrade public listing claims.',
    next_action: 'Capture onboarding, first action, progress/avatar feedback, and paywall screenshots for the highest-risk public-listing rows.'
  },
  {
    claim_id: 'H2_markets_have_money',
    claim_type: 'product_hypothesis',
    claim: 'The five adjacent markets contain monetizable demand and paid behavior.',
    evidence_status: marketStressTest.length ? 'supported_with_ranges_stress_test_and_bottom_up_proxy' : 'supported_with_ranges_and_bottom_up_proxy',
    confidence: 'medium',
    primary_metric: `intersection SAM base USD ${intersection.samBase || 'n/a'}; ${marketSourceConfidence.length} market sources confidence-reviewed; ${marketAssumptionAudit.length} assumption rows; ${marketStressTest.length} stress scenarios; ${strongRevenueProxyCompetitors.length} strong competitor money proxies`,
    quantitative_evidence: `market_claims=${claims.length}; SOM scenarios=${som.length}; stress_scenarios=${marketStressTest.length}; assumption_audit_rows=${marketAssumptionAudit.length}; market_source_reviews=${marketSourceConfidence.length}; high_use_sources=${highUseMarketSources.length}; range_only_or_context=${rangeOnlyMarketSources.length}; monetization_proxy_markets=${monetizationProxy.length}; strong_monetization_proxy=${strongMonetizationMarkets.length}; competitor_revenue_proxy_rows=${competitorRevenueProxy.length}; competitor_revenue_proxy_markets=${competitorRevenueProxySummary.length}; strong_competitor_money_proxy=${strongRevenueProxyCompetitors.length}; medium_plus_competitor_money_proxy=${mediumPlusRevenueProxyCompetitors.length}; App Store IAP rows=${iap.length}; Google Play IAP apps=${googleOk.filter(row => row.offers_iap === 'yes').length}`,
    evidence_files: 'data_processed/tam_sam_som_model.csv;data_processed/som_sensitivity_scenarios.csv;data_processed/market_sizing_assumption_audit.csv;data_processed/market_sizing_stress_test.csv;data_processed/market_claims.csv;data_processed/market_source_confidence_review.csv;data_processed/market_confidence_summary.csv;data_processed/market_monetization_proxy_matrix.csv;data_processed/monetization_proxy_examples.csv;data_processed/competitor_revenue_proxy_review.csv;data_processed/competitor_revenue_proxy_market_summary.csv;data_raw/app_store_iap_pricing_raw.csv;data_raw/google_play_pricing_raw.csv;docs/market/tam-sam-som-model-v1.md;docs/market/market-source-confidence-review-v1.md;docs/market/market-sizing-stress-test-v1.md;docs/market/monetization-proxy-matrix-v1.md;docs/market/competitor-revenue-proxy-review-v1.md',
    strongest_support: 'TAM/SAM/SOM model, source confidence review, assumption stress-test, observed IAP metadata, Google Play IAP metadata, web paywall signals, and competitor-level revenue proxy review show paid depth while preserving range and source-quality caveats.',
    key_gap: 'Market sizing still needs actual revenue estimates, paid intelligence, manual in-app paywall validation, and willingness-to-pay prototype evidence for final investor-grade claims.',
    next_action: 'Use stress-test risk rows to prioritize paid-flow inspection and prototype willingness-to-pay questions.'
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
    evidence_status: publicListingInspection.length ? 'narrow_supported_public_listing_inspected_walkthrough_open' : 'narrow_supported_inspection_packet_ready',
    confidence: 'medium',
    primary_metric: `${behaviorTied.length}/100 strict behavior-tied progression signals; ${crossSourceSaturation.length} cross-source saturation markets; ${crossSourceSaturation.filter(row => row.opportunity_band === 'mechanic_benchmark_not_primary_market').length} benchmark-only markets; ${manualInspectionPacket.length} P0 apps queued`,
    quantitative_evidence: `high_whitespace=${highWhitespace.length}; medium_whitespace=${whitespace.filter(row => row.whitespace_band === 'medium').length}; low_whitespace=${whitespace.filter(row => row.whitespace_band === 'low').length}; cross_source_saturation_markets=${crossSourceSaturation.length}; cross_source_primary_high_opportunity=${crossSourceSaturation.filter(row => row.opportunity_band === 'high_opportunity_validate_now').length}; cross_source_benchmark_markets=${crossSourceSaturation.filter(row => row.opportunity_band === 'mechanic_benchmark_not_primary_market').length}; chrome_battlecards=${chromeExtensionBattlecards.length}; chrome_priority_mechanics=${chromeMechanicPriority.length}; manual_inspection_targets=${manualInspectionPacket.length}; inspection_behavior_prefill=${manualInspectionBehaviorPrefill.length}; inspection_rubric_dimensions=${manualInspectionRubric.length}; public_listing_inspected=${publicListingInspected.length}; public_listing_visible_causality=${publicListingVisibleCausality.length}; public_listing_high_clone_risk=${publicListingHighCloneRisk.length}`,
    evidence_files: 'data_processed/whitespace_signal_matrix.csv;data_processed/cross_source_market_saturation_matrix.csv;data_processed/product_core_evidence_matrix.csv;data_processed/chrome_extension_mechanic_battlecards.csv;data_processed/manual_competitor_inspection_packet.csv;data_processed/manual_competitor_inspection_rubric.csv;data_processed/public_listing_inspection_results.csv;docs/intersections/whitespace-map-v2.md;docs/intersections/cross-source-saturation-whitespace-v1.md;docs/product/product-core-evidence-v1.md;docs/competitive/chrome-extension-mechanic-battlecards-v1.md;docs/competitive/manual-competitor-inspection-packet-v1.md;docs/competitive/public-listing-inspection-v1.md',
    strongest_support: 'Broad adjacent market is crowded; strict behavior-tied avatar progression appears rare in metadata; cross-source saturation keeps gaming/progression as benchmark-only and avoids upgrading primary-market whitespace without walkthrough evidence.',
    key_gap: 'Actual app/onboarding inspection results are still missing; public listings and cross-source text rules can overstate or hide in-app loops.',
    next_action: 'Use the public-listing risk read to classify action->avatar causality in walkthrough as visible, inferred, absent, or blocked.'
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
    primary_metric: `${audience.length} audience signal rows; ${communityReferralRows.length} community/referral rows; ${redditMentionSignals.length} coded Reddit mention rows; ${icpSegments.length} ICP segment hypotheses; ${icpValidationPlan.length} ICP validation tests; ${icpRecruitingBridge.length} ICP recruiting bridge rows`,
    quantitative_evidence: `reviews=${reviews.length}; review_apps=${reviewApps}; review_signals=${reviewSignals.length}; review_clusters=${reviewClusters.length}; community_referral_rows=${communityReferralRows.length}; community_referral_signals=${communityReferralSummary.length}; forum_quote_rows=${forumQuotes.length}; reddit_signal_rows=${redditMentionSignals.length}; reddit_signal_groups=${Object.keys(countBy(redditMentionSignals, 'signal_group')).length}; reddit_medium_plus_signals=${redditMediumPlusSignals.length}; reddit_app_summary_rows=${redditMentionAppSummary.length}; icp_segments=${icpSegments.length}; strong_icp=${strongIcpSegments.length}; icp_validation_tests=${icpValidationPlan.length}; icp_recruiting_bridge_rows=${icpRecruitingBridge.length}; icp_recruiting_message_rows=${icpRecruitingMessages.length}`,
    evidence_files: 'data_processed/audience_signal_matrix.csv;data_raw/app_store_top_candidate_reviews.csv;data_processed/review_signal_matrix.csv;data_processed/review_jtbd_cluster_summary.csv;data_processed/community_referral_signal_rows.csv;data_processed/community_referral_summary.csv;data_processed/forum_quote_coding_matrix.csv;data_processed/reddit_mention_signal_matrix.csv;data_processed/reddit_mention_app_summary.csv;data_processed/icp_segment_matrix.csv;data_processed/icp_validation_test_plan.csv;data_processed/icp_recruiting_bridge.csv;data_processed/icp_recruiting_message_bank.csv;docs/audience/review-language-synthesis-v1.md;docs/audience/community-referral-evidence-v1.md;docs/audience/forum-quote-coding-v1.md;docs/audience/reddit-mention-signal-matrix-v1.md;docs/audience/icp-segment-matrix-v1.md;docs/audience/icp-validation-packet-v1.md;docs/audience/icp-recruiting-bridge-v1.md',
    strongest_support: 'Reviews, community/referral mentions, forum snippets, and coded Reddit mention rows converge on daily anchors, visible progress, emotional support, pricing sensitivity, accountability/community language, alternatives requests, and safety boundaries; the ICP segment matrix and recruiting bridge convert those signals into testable segment, channel, screener, prototype, WTP, and evidence-capture rows.',
    key_gap: 'Keyword/OCR/forum coding and directional ICP recruiting assets need human validation, interviews, and prototype tests.',
    next_action: 'Use the ICP recruiting bridge to source top-two segment participants, execute the ICP validation packet, then update segment status and selected primary ICP.'
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
lines.push('- Decision layer: hypothesis decision matrix converts H1-H6 into go/hold/kill gates and keeps open validation burden visible.');
lines.push('- Execution layer: P0 validation command center translates open gates into operator-ready evidence capture rows.');
lines.push('- Field layer: P0 validation field guide provides scripts, evidence naming, and post-validation rebuild protocol.');
lines.push('- Intake layer: validation evidence workspace creates local folders and templates for screenshots, notes, quotes, and scorecard calculations.');
lines.push('- Batch layer: validation Batch 01 pre-creates note files for all P0 blocker commands.');
lines.push('- Breadth layer: validation Batch 02 pre-creates note files for all non-blocker P0 commands.');
lines.push('- Context layer: validation Batch 03 pre-creates note files for all P1 context commands.');
lines.push(`- Existing evidence link layer: ${validationBatchPrefilledLocalArtifacts} batch notes now point at local artifacts, mainly captured paywall screenshots; these links do not equal human signoff.`);
lines.push('- Rollup layer: validation evidence rollup verifies note coverage and local artifact link status at command level.');
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
