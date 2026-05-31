import fs from 'fs';

const OUT = 'data_processed/research_completion_audit.csv';
const OUT_DOC = 'docs/decision/research-completion-audit-v1.md';

for (const dir of ['data_processed', 'docs/decision']) fs.mkdirSync(dir, { recursive: true });

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
  if (!headers) return [];
  return body.filter(r => r.some(Boolean)).map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])));
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

function writeCsv(file, rows, headers) {
  fs.writeFileSync(file, [headers.join(','), ...rows.map(row => headers.map(h => csvEscape(row[h])).join(','))].join('\n'));
}

function mdTable(rows, columns) {
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = rows.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function fileExistsList(files) {
  return files.filter(file => fs.existsSync(file)).length;
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

const expanded = csv('data_raw/expanded/all_expanded_dedup.csv');
const expandedRaw = csv('data_raw/expanded/all_expanded_raw.csv');
const itchRows = csv('data_raw/expanded_itch_raw.csv');
const steamTagRows = csv('data_raw/expanded_steam_tags_raw.csv');
const desktopStoreRows = csv('data_raw/expanded_desktop_store_raw.csv');
const chromeExtensionRows = csv('data_raw/expanded_chrome_extensions_raw.csv');
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
const feature = csv('data_processed/competitor_feature_matrix.csv');
const audience = csv('data_processed/audience_signal_matrix.csv');
const whitespace = csv('data_processed/whitespace_signal_matrix.csv');
const tam = csv('data_processed/tam_sam_som_model.csv');
const marketConfidence = csv('data_processed/market_source_confidence_review.csv');
const marketAssumptionAudit = csv('data_processed/market_sizing_assumption_audit.csv');
const marketStressTest = csv('data_processed/market_sizing_stress_test.csv');
const monetizationProxy = csv('data_processed/market_monetization_proxy_matrix.csv');
const marketMoneyTriangulation = csv('data_processed/market_money_triangulation.csv');
const marketMoneyTriangulationSummary = csv('data_processed/market_money_triangulation_summary.csv');
const competitorRevenueProxy = csv('data_processed/competitor_revenue_proxy_review.csv');
const competitorRevenueProxySummary = csv('data_processed/competitor_revenue_proxy_market_summary.csv');
const webPaywallVisualAdjudication = csv('data_processed/web_paywall_visual_adjudication.csv');
const evidence = csv('data_processed/evidence_claim_register.csv');
const roadmap = csv('data_processed/validation_gap_roadmap.csv');
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
const manifest = csv('data_processed/evidence_artifact_manifest.csv');
const top100 = csv('data_processed/top100_competitor_review_scorecard.csv');
const validationQueue = csv('data_processed/top100_human_validation_queue.csv');
const manualInspectionPacket = csv('data_processed/manual_competitor_inspection_packet.csv');
const manualInspectionRubric = csv('data_processed/manual_competitor_inspection_rubric.csv');
const publicListingInspection = csv('data_processed/public_listing_inspection_results.csv');
const publicListingSummary = csv('data_processed/public_listing_inspection_summary.csv');
const icpSegments = csv('data_processed/icp_segment_matrix.csv');
const icpValidation = csv('data_processed/icp_validation_test_plan.csv');
const icpRecruitingBridge = csv('data_processed/icp_recruiting_bridge.csv');
const icpRecruitingMessages = csv('data_processed/icp_recruiting_message_bank.csv');
const communityReferralRows = csv('data_processed/community_referral_signal_rows.csv');
const communityReferralSummary = csv('data_processed/community_referral_summary.csv');
const prototypeStimulusFlow = csv('data_processed/prototype_validation_stimulus_flow.csv');
const prototypeScorecard = csv('data_processed/prototype_validation_scorecard.csv');
const manualWalkthroughCapture = csv('data_processed/manual_walkthrough_capture_sheet.csv');
const paidFlowCapture = csv('data_processed/paid_flow_capture_sheet.csv');
const icpInterviewCapture = csv('data_processed/icp_interview_capture_sheet.csv');
const prototypeSessionCapture = csv('data_processed/prototype_session_capture_sheet.csv');
const hypothesisDecisions = csv('data_processed/hypothesis_decision_matrix.csv');

const p0Roadmap = roadmap.filter(row => row.priority === 'P0');
const p1Roadmap = roadmap.filter(row => row.priority === 'P1');
const p0ExecutionTasks = validationExecutionDashboard.filter(row => row.priority === 'P0');
const p1ExecutionTasks = validationExecutionDashboard.filter(row => row.priority === 'P1');
const p0CommandRows = p0CommandCenter.filter(row => row.priority === 'P0');
const p0CommandBlockers = p0CommandCenter.filter(row => row.priority === 'P0_blocker');
const validationCaptureRows = manualWalkthroughCapture.length + paidFlowCapture.length + icpInterviewCapture.length + prototypeSessionCapture.length + redditManualCaptureSheet.length;
const validationGatesPassed = validationGateCalculator.filter(row => row.gate_status === 'pass_ready_for_review').length;
const validationGatesNotStarted = validationGateCalculator.filter(row => row.gate_status === 'not_started').length;
const holdHypothesisDecisions = hypothesisDecisions.filter(row => row.current_decision === 'hold_validate').length;
const goHypothesisDecisions = hypothesisDecisions.filter(row => row.current_decision === 'go_for_next_phase').length;
const stopHypothesisDecisions = hypothesisDecisions.filter(row => row.current_decision === 'stop_or_pivot').length;
const humanConfirmed = validationQueue.filter(row => !['', 'not_started'].includes(row.validation_status)).length;
const manualInspectionDone = manualInspectionPacket.filter(row => !['', 'not_started'].includes(row.inspection_status)).length;
const publicListingInspected = publicListingInspection.filter(row => row.public_listing_inspection_status === 'public_listing_inspected').length;
const publicListingVisibleCausality = publicListingInspection.filter(row => row.action_to_avatar_causality_public_read === 'visible_in_public_copy').length;
const publicListingHighCloneRisk = publicListingInspection.filter(row => row.hidden_clone_risk_public_read === 'high_hidden_clone_risk_requires_app_walkthrough').length;
const manifestMissing = manifest.filter(row => row.exists !== 'yes').length;
const polishedPdfExists = fs.existsSync('output/pdf/alina-polished-evidence-pack-v1.pdf');
const polishedPdfDocExists = fs.existsSync('docs/decision/polished-evidence-pack-v1.md');
const russianNarrativeReportExists = fs.existsSync('reports/alina-russian-narrative-report-v1.md');
const russianNarrativePdfExists = fs.existsSync('output/pdf/alina-russian-narrative-report-v1.pdf');
const russianNarrativeMapExists = fs.existsSync('data_processed/russian_narrative_evidence_map.csv') && fs.existsSync('docs/decision/russian-narrative-evidence-map-v1.md');
const primaryApps = top100.filter(row => row.duplicate_flag === 'primary_app_entry').length;
const prototypeScreens = new Set(prototypeStimulusFlow.map(row => row.screen_id).filter(Boolean)).size;
const prototypeSegments = new Set(prototypeStimulusFlow.map(row => row.segment_id).filter(Boolean)).size;
const strongMoneyMarkets = monetizationProxy.filter(row => row.monetization_proxy_band === 'strong_paid_behavior_proxy').length;
const strongTriangulatedMoneyMarkets = marketMoneyTriangulation.filter(row => row.money_triangulation_verdict === 'strong_directional_money_case').length;
const mediumTriangulatedMoneyMarkets = marketMoneyTriangulation.filter(row => row.money_triangulation_verdict === 'medium_directional_money_case').length;
const strongRevenueProxyCompetitors = competitorRevenueProxy.filter(row => row.revenue_proxy_band === 'strong_bottom_up_money_proxy').length;
const mediumPlusRevenueProxyCompetitors = competitorRevenueProxy.filter(row => ['strong_bottom_up_money_proxy', 'medium_bottom_up_money_proxy'].includes(row.revenue_proxy_band)).length;
const confirmedWebPaywallVisuals = webPaywallVisualAdjudication.filter(row => row.visual_adjudication === 'confirmed_visible_public_pricing').length;
const partialWebPaywallVisuals = webPaywallVisualAdjudication.filter(row => ['confirmed_paid_surface_no_clean_price', 'partial_paid_surface_language', 'visible_price_context_uncertain'].includes(row.visual_adjudication)).length;
const itchOk = itchRows.filter(row => row.collection_status === 'ok');
const steamTagOk = steamTagRows.filter(row => row.collection_status === 'ok');
const desktopStoreOk = desktopStoreRows.filter(row => row.collection_status === 'ok');
const chromeExtensionOk = chromeExtensionRows.filter(row => row.collection_status === 'ok');
const redditMentionOk = redditMentionRows.filter(row => row.collection_status === 'ok');
const redditMentionKnownSignalRows = redditMentionSignals.filter(row => clean(row.app_name) && row.collection_status === 'ok');
const redditMediumPlusSignals = redditMentionSignals.filter(row => ['medium_high_qualitative', 'medium_qualitative'].includes(row.competitor_signal_strength));
const redditManualP0 = redditManualReadingQueue.filter(row => row.priority_band === 'P0_read_first');
const redditManualP1 = redditManualReadingQueue.filter(row => row.priority_band === 'P1_read_next');
const redditManualCaptureP0 = redditManualCaptureSheet.filter(row => row.priority_band === 'P0_read_first');
const redditManualCaptureCompleted = redditManualCaptureSheet.filter(row => !['', 'not_started'].includes(row.capture_status));
const chromeExtensionDetailOk = chromeExtensionFit.filter(row => row.detail_status === 'ok');
const chromeExtensionStrong = chromeExtensionFit.filter(row => row.alina_fit_band === 'strong_adjacent');
const chromeMechanicPriority = chromeExtensionBattlecards.filter(row => ['mechanic_threat_high', 'mechanic_threat_medium', 'mechanic_reference_high'].includes(row.threat_band));
const expandedRawWithKnownExternal = expandedRaw.length + itchRows.length + steamTagRows.length + desktopStoreRows.length + chromeExtensionRows.length + redditMentionRows.length;
const crossSourceScaleStatus = crossSourceRaw.length >= 30000 && crossSourceDedup.length >= 30000
  ? 'proved_30k_plus_cross_source_dedup'
  : (crossSourceRaw.length >= 30000 && crossSourceDedup.length >= 20000 ? 'proved_scale_target_cross_source_normalized' : (expandedRawWithKnownExternal >= 30000 ? 'proved_scale_target' : 'partial_substantial_not_30k_50k'));
const crossSourceScaleGap = crossSourceDedup.length >= 30000
  ? 'The 30k lower-bound dedup target is now met; the remaining expansion gap is the upper 50k aspiration plus Product Hunt/AlternativeTo, B2B directories, Reddit mentions, and additional source-native coverage.'
  : 'Cross-source dedup is substantial but still below the aspirational 30k-50k dedup target; Product Hunt/AlternativeTo, B2B directories, Reddit mentions, and deeper source-native expansion remain backlog.';

const requirements = [
  {
    requirement_id: 'REQ_01_MASTER_PLAN',
    requirement: 'Large plan and phased backlog are documented.',
    objective_source: 'User requested a large plan and autonomous execution path.',
    status: fs.existsSync('docs/research-expansion-master-plan.md') && roadmap.length ? 'proved_v1' : 'missing',
    evidence_strength: 'strong',
    proof: `master_plan=${fs.existsSync('docs/research-expansion-master-plan.md')}; roadmap_rows=${roadmap.length}; execution_dashboard_rows=${validationExecutionDashboard.length}; hypothesis_decision_rows=${hypothesisDecisions.length}; p0_command_rows=${p0CommandCenter.length}; p0_field_guide_sections=${p0FieldGuide.length}; validation_workspace_lanes=${validationWorkspace.length}; validation_batch01_rows=${validationBatch01.length}; validation_batch02_rows=${validationBatch02.length}; validation_batch03_rows=${validationBatch03.length}; validation_batch_local_artifact_links=${validationBatchPrefilledLocalArtifacts}; validation_rollup_rows=${validationEvidenceRollup.length}`,
    evidence_files: 'docs/research-expansion-master-plan.md;data_processed/validation_gap_roadmap.csv;data_processed/validation_execution_dashboard.csv;data_processed/hypothesis_decision_matrix.csv;data_processed/p0_validation_command_center.csv;data_processed/p0_validation_field_guide.csv;data_processed/validation_evidence_workspace_index.csv;data_processed/validation_batch_01_index.csv;data_processed/validation_batch_02_index.csv;data_processed/validation_batch_03_index.csv;data_processed/validation_evidence_rollup.csv;docs/decision/validation-gap-roadmap-v1.md;docs/decision/validation-execution-dashboard-v1.md;docs/decision/hypothesis-decision-matrix-v1.md;docs/decision/p0-validation-command-center-v1.md;docs/decision/p0-validation-field-guide-v1.md;docs/decision/validation-evidence-workspace-v1.md;docs/decision/validation-batch-01-v1.md;docs/decision/validation-batch-02-v1.md;docs/decision/validation-batch-03-v1.md;docs/decision/validation-evidence-rollup-v1.md',
    remaining_gap: 'Keep refreshing as validation results change.',
    next_action: 'Update after any manual validation/prototype result.'
  },
  {
    requirement_id: 'REQ_02_COMPETITOR_UNIVERSE',
    requirement: 'Competitor/source universe is expanded across five markets toward the aspirational 30k-50k app/source target.',
    objective_source: 'User requested 30k-50k applications/sources across app stores, forums, web apps, desktop apps, websites.',
    status: crossSourceScaleStatus,
    evidence_strength: expanded.length >= 10000 ? 'medium_high' : 'medium',
    proof: `dedup=${expanded.length}; cross_source_raw=${crossSourceRaw.length}; cross_source_dedup=${crossSourceDedup.length}; cross_source_summary_rows=${crossSourceSummary.length}; coverage_cells=${crossSourceCoverage.length}; coverage_strong=${crossSourceCoverage.filter(row => row.coverage_band === 'strong_coverage').length}; coverage_medium=${crossSourceCoverage.filter(row => row.coverage_band === 'medium_coverage').length}; raw_core=${expandedRaw.length}; itch_rows=${itchRows.length}; steam_tag_rows=${steamTagRows.length}; desktop_store_rows=${desktopStoreRows.length}; chrome_extension_rows=${chromeExtensionRows.length}; reddit_mention_rows=${redditMentionRows.length}; reddit_mention_ok=${redditMentionOk.length}; reddit_mention_summary_rows=${redditMentionSummary.length}; reddit_signal_rows=${redditMentionSignals.length}; reddit_signal_groups=${Object.keys(countBy(redditMentionSignals, 'signal_group')).length}; reddit_known_signal_rows=${redditMentionKnownSignalRows.length}; reddit_app_summary_rows=${redditMentionAppSummary.length}; reddit_manual_queue_rows=${redditManualReadingQueue.length}; reddit_manual_p0=${redditManualP0.length}; reddit_manual_p1=${redditManualP1.length}; reddit_manual_capture_rows=${redditManualCaptureSheet.length}; reddit_manual_capture_p0=${redditManualCaptureP0.length}; known_raw_total=${expandedRawWithKnownExternal}; itch_ok=${itchOk.length}; steam_tag_ok=${steamTagOk.length}; desktop_store_ok=${desktopStoreOk.length}; chrome_extension_ok=${chromeExtensionOk.length}; chrome_detail_ok=${chromeExtensionDetailOk.length}; chrome_strong_adjacent=${chromeExtensionStrong.length}; chrome_priority_mechanics=${chromeMechanicPriority.length}; niches=${Object.keys(countBy(expanded, 'niche')).length}; source_kinds=${Object.keys(countBy(expanded, 'source_kind')).length}`,
    evidence_files: 'data_raw/expanded/all_expanded_raw.csv;data_raw/expanded/all_expanded_dedup.csv;data_raw/expanded_itch_raw.csv;data_raw/expanded_steam_tags_raw.csv;data_raw/expanded_desktop_store_raw.csv;data_raw/expanded_chrome_extensions_raw.csv;data_raw/expanded_reddit_competitor_mentions_raw.csv;data_raw/chrome_extension_detail_raw.csv;data_processed/cross_source_universe_raw_index.csv;data_processed/cross_source_universe_raw_parts/part_*.csv;data_processed/cross_source_universe_dedup.csv;data_processed/cross_source_universe_summary.csv;data_processed/cross_source_coverage_matrix.csv;data_processed/desktop_store_source_summary.csv;data_processed/reddit_competitor_mentions_summary.csv;data_processed/reddit_mention_signal_matrix.csv;data_processed/reddit_mention_app_summary.csv;data_processed/reddit_manual_reading_queue.csv;data_processed/reddit_manual_reading_prompt_bank.csv;data_processed/reddit_manual_reading_capture_sheet.csv;data_processed/chrome_extension_fit_matrix.csv;data_processed/chrome_extension_mechanic_battlecards.csv;data_processed/competitor_feature_matrix.csv;docs/competitive/cross-source-universe-v1.md;docs/competitive/cross-source-coverage-matrix-v1.md;docs/competitive/expanded-source-map.md;docs/competitive/source-expansion-backlog-v1.md;docs/competitive/itch-source-expansion-v1.md;docs/competitive/steam-tag-expansion-v1.md;docs/competitive/desktop-store-expansion-v1.md;docs/competitive/chrome-webstore-source-expansion-v1.md;docs/audience/reddit-competitor-mentions-v1.md;docs/audience/reddit-mention-signal-matrix-v1.md;docs/audience/reddit-manual-reading-queue-v1.md;docs/audience/reddit-manual-reading-capture-sheet-v1.md;docs/competitive/chrome-extension-detail-enrichment-v1.md;docs/competitive/chrome-extension-mechanic-battlecards-v1.md',
    remaining_gap: crossSourceScaleGap,
    next_action: 'Run next non-search-heavy collectors from source expansion backlog, prioritizing sources that return public HTML without Cloudflare/search-engine dependency.'
  },
  {
    requirement_id: 'REQ_03_FIVE_MARKET_COVERAGE',
    requirement: 'Research covers five core markets: coaching, mindfulness, avatar/identity, astrology/esoterics, gaming/progression benchmark.',
    objective_source: 'User framed five key directions / markets.',
    status: Object.keys(countBy(expanded, 'niche')).length >= 5 && tam.length >= 5 ? 'proved_v1' : 'incomplete',
    evidence_strength: 'strong',
    proof: `expanded_markets=${Object.keys(countBy(expanded, 'niche')).length}; tam_rows=${tam.length}; audience_rows=${audience.length}`,
    evidence_files: 'data_raw/expanded/all_expanded_dedup.csv;data_processed/tam_sam_som_model.csv;data_processed/audience_signal_matrix.csv',
    remaining_gap: 'Gaming should remain benchmark-only unless direct consumer overlap is validated.',
    next_action: 'Keep market-specific validation gates explicit.'
  },
  {
    requirement_id: 'REQ_04_MARKET_MONEY',
    requirement: 'TAM/SAM/SOM methodology and market-money evidence are prepared.',
    objective_source: 'User asked for complex market evaluation formulas and open research source gathering.',
    status: tam.length && marketConfidence.length && marketAssumptionAudit.length && marketStressTest.length && monetizationProxy.length && competitorRevenueProxy.length && marketMoneyTriangulation.length ? 'supported_with_triangulated_proxy_not_final' : (tam.length && marketConfidence.length && marketAssumptionAudit.length && marketStressTest.length && monetizationProxy.length && competitorRevenueProxy.length ? 'supported_with_stress_test_and_bottom_up_proxy_not_final' : (tam.length && marketConfidence.length && monetizationProxy.length && competitorRevenueProxy.length ? 'supported_with_bottom_up_proxy_not_final' : 'missing')),
    evidence_strength: competitorRevenueProxy.length ? 'medium_high' : 'medium',
    proof: `tam_rows=${tam.length}; source_confidence_rows=${marketConfidence.length}; assumption_audit_rows=${marketAssumptionAudit.length}; stress_scenarios=${marketStressTest.length}; strong_paid_proxy_markets=${strongMoneyMarkets}/5; market_money_triangulation_rows=${marketMoneyTriangulation.length}; market_money_triangulation_verdicts=${marketMoneyTriangulationSummary.length}; strong_triangulated_markets=${strongTriangulatedMoneyMarkets}; medium_triangulated_markets=${mediumTriangulatedMoneyMarkets}; competitor_revenue_proxy_rows=${competitorRevenueProxy.length}; competitor_revenue_proxy_markets=${competitorRevenueProxySummary.length}; strong_competitor_money_proxy=${strongRevenueProxyCompetitors}; medium_plus_competitor_money_proxy=${mediumPlusRevenueProxyCompetitors}; web_paywall_visual_rows=${webPaywallVisualAdjudication.length}; web_paywall_visual_confirmed=${confirmedWebPaywallVisuals}; web_paywall_visual_partial=${partialWebPaywallVisuals}`,
    evidence_files: 'docs/market/market-sizing-methodology.md;data_processed/tam_sam_som_model.csv;data_processed/som_sensitivity_scenarios.csv;data_processed/market_source_confidence_review.csv;data_processed/market_sizing_assumption_audit.csv;data_processed/market_sizing_stress_test.csv;data_processed/market_monetization_proxy_matrix.csv;data_processed/market_money_triangulation.csv;data_processed/market_money_triangulation_summary.csv;data_processed/competitor_revenue_proxy_review.csv;data_processed/competitor_revenue_proxy_market_summary.csv;data_processed/web_paywall_visual_adjudication.csv;docs/market/tam-sam-som-model-v1.md;docs/market/market-sizing-stress-test-v1.md;docs/market/market-money-triangulation-v1.md;docs/market/competitor-revenue-proxy-review-v1.md;docs/competitive/web-paywall-visual-adjudication-v1.md',
    remaining_gap: 'Market sizing is stress-tested and triangulated, but actual competitor revenue estimates, paid intelligence, and manual in-app paywall/WTP validation are still needed for final investor-grade claims.',
    next_action: 'Use stress-test risk rows to prioritize manual paid-flow inspection and willingness-to-pay prototype questions.'
  },
  {
    requirement_id: 'REQ_05_WHITESPACE',
    requirement: 'Whitespace/competitor gap analysis exists and identifies whether a narrow opening is plausible.',
    objective_source: 'User asked to prove a white spot among markets/apps and absence or weakness of existing solutions.',
    status: whitespace.length && manualInspectionPacket.length && publicListingInspection.length ? 'narrow_supported_public_listing_inspected_walkthrough_open' : (whitespace.length && manualInspectionPacket.length ? 'narrow_supported_inspection_ready_not_final' : 'missing'),
    evidence_strength: 'medium',
    proof: `whitespace_rows=${whitespace.length}; high_ws=${whitespace.filter(row => row.whitespace_band === 'high').length}; cross_source_saturation_markets=${crossSourceSaturation.length}; cross_source_primary_high_opportunity=${crossSourceSaturation.filter(row => row.opportunity_band === 'high_opportunity_validate_now').length}; cross_source_benchmark_markets=${crossSourceSaturation.filter(row => row.opportunity_band === 'mechanic_benchmark_not_primary_market').length}; top100=${top100.length}; behavior_tied=${top100.filter(row => row.behavior_tied_progression === 'yes').length}; manual_inspection_targets=${manualInspectionPacket.length}; manual_inspection_rubric=${manualInspectionRubric.length}; public_listing_inspected=${publicListingInspected}; public_listing_visible_causality=${publicListingVisibleCausality}; public_listing_high_clone_risk=${publicListingHighCloneRisk}; manual_walkthrough_capture_rows=${manualWalkthroughCapture.length}; manual_app_walkthrough_done=${manualInspectionDone}`,
    evidence_files: 'data_processed/whitespace_signal_matrix.csv;data_processed/cross_source_market_saturation_matrix.csv;data_processed/top100_competitor_review_scorecard.csv;data_processed/manual_competitor_inspection_packet.csv;data_processed/manual_competitor_inspection_rubric.csv;data_processed/manual_walkthrough_capture_sheet.csv;data_processed/public_listing_inspection_results.csv;data_processed/public_listing_inspection_summary.csv;docs/intersections/whitespace-map-v2.md;docs/intersections/cross-source-saturation-whitespace-v1.md;docs/competitive/top100-competitor-review-v1.md;docs/competitive/manual-competitor-inspection-packet-v1.md;docs/competitive/public-listing-inspection-v1.md;docs/decision/validation-capture-sheets-v1.md',
    remaining_gap: 'Cross-source saturation now keeps gaming/progression as benchmark-only and finds no primary market opportunity strong enough to upgrade without manual walkthrough; app/onboarding screenshots are still required.',
    next_action: 'Use the public-listing risk reads to prioritize walkthrough screenshots for onboarding, first action, progress/avatar feedback, and paywall boundary.'
  },
  {
    requirement_id: 'REQ_06_AUDIENCE_ICP',
    requirement: 'Audience, ICP, JTBD, pain, and shared segment hypotheses are prepared.',
    objective_source: 'User asked for common audience, segments, customer profile, detailed matrices.',
    status: audience.length && icpSegments.length && icpValidation.length && icpRecruitingBridge.length ? 'directionally_supported_recruiting_ready' : (audience.length && icpSegments.length && icpValidation.length ? 'directionally_supported_validation_ready' : 'missing'),
    evidence_strength: 'medium',
    proof: `audience_rows=${audience.length}; community_referral_rows=${communityReferralRows.length}; community_referral_signals=${communityReferralSummary.length}; reddit_signal_rows=${redditMentionSignals.length}; reddit_signal_groups=${Object.keys(countBy(redditMentionSignals, 'signal_group')).length}; reddit_medium_plus_signals=${redditMediumPlusSignals.length}; reddit_app_summary_rows=${redditMentionAppSummary.length}; reddit_manual_queue_rows=${redditManualReadingQueue.length}; reddit_manual_p0=${redditManualP0.length}; reddit_manual_p1=${redditManualP1.length}; reddit_prompt_rows=${redditManualPromptBank.length}; reddit_manual_capture_rows=${redditManualCaptureSheet.length}; reddit_manual_capture_p0=${redditManualCaptureP0.length}; reddit_manual_capture_completed=${redditManualCaptureCompleted.length}; icp_segments=${icpSegments.length}; icp_validation_tests=${icpValidation.length}; icp_recruiting_bridge_rows=${icpRecruitingBridge.length}; icp_recruiting_message_rows=${icpRecruitingMessages.length}; icp_capture_rows=${icpInterviewCapture.length}`,
    evidence_files: 'data_processed/audience_signal_matrix.csv;data_processed/community_referral_signal_rows.csv;data_processed/community_referral_summary.csv;data_processed/reddit_mention_signal_matrix.csv;data_processed/reddit_mention_app_summary.csv;data_processed/reddit_manual_reading_queue.csv;data_processed/reddit_manual_reading_prompt_bank.csv;data_processed/reddit_manual_reading_capture_sheet.csv;data_processed/icp_segment_matrix.csv;data_processed/icp_validation_test_plan.csv;data_processed/icp_recruiting_bridge.csv;data_processed/icp_recruiting_message_bank.csv;data_processed/icp_interview_capture_sheet.csv;docs/audience/community-referral-evidence-v1.md;docs/audience/reddit-mention-signal-matrix-v1.md;docs/audience/reddit-manual-reading-queue-v1.md;docs/audience/reddit-manual-reading-capture-sheet-v1.md;docs/audience/icp-segment-matrix-v1.md;docs/audience/icp-validation-packet-v1.md;docs/audience/icp-recruiting-bridge-v1.md;docs/decision/validation-capture-sheets-v1.md',
    remaining_gap: 'Segments and recruiting assets are directional and need actual interviews/prototype/WTP validation.',
    next_action: 'Use the ICP recruiting bridge to recruit the top two segments, then run the validation packet and update capture sheets.'
  },
  {
    requirement_id: 'REQ_07_COMPETITIVE_ADVANTAGE',
    requirement: 'Competitive advantage and product-core hypotheses are made explicit.',
    objective_source: 'User asked to prove competitive advantage and move toward product ядро.',
    status: feature.length && prototypeStimulusFlow.length && prototypeScorecard.length ? 'prototype_stimulus_ready_not_validated' : 'missing',
    evidence_strength: 'medium',
    proof: `feature_rows=${feature.length}; primary_top100_apps=${primaryApps}; evidence_claims=${evidence.length}; prototype_segments=${prototypeSegments}; prototype_screens=${prototypeScreens}; prototype_flow_rows=${prototypeStimulusFlow.length}; prototype_scorecard_metrics=${prototypeScorecard.length}; prototype_capture_rows=${prototypeSessionCapture.length}`,
    evidence_files: 'data_processed/product_core_evidence_matrix.csv;data_processed/prototype_validation_stimulus_flow.csv;data_processed/prototype_validation_scorecard.csv;data_processed/prototype_session_capture_sheet.csv;docs/product/product-core-evidence-v1.md;docs/product/prototype-validation-stimulus-v1.md;docs/strategy/value-proposition-v1.md;data_processed/evidence_claim_register.csv;docs/decision/validation-capture-sheets-v1.md',
    remaining_gap: 'No completed user/prototype sessions prove the loop is understood/preferred.',
    next_action: 'Run prototype sessions with the top two ICP segments and record comprehension, meaning lift, differentiation, return intent, and paid-depth signals.'
  },
  {
    requirement_id: 'REQ_08_REPORT_PDF',
    requirement: 'A large PDF/report artifact exists.',
    objective_source: 'User ultimately wanted a huge PDF report.',
    status: polishedPdfExists && russianNarrativePdfExists && russianNarrativeMapExists ? 'polished_and_russian_narrative_argument_map_done_not_validated_final' : (polishedPdfExists && russianNarrativePdfExists ? 'polished_and_russian_narrative_drafts_done_not_validated_final' : (polishedPdfExists ? 'polished_evidence_draft_done_not_validated_final' : (fs.existsSync('output/pdf/alina-evidence-first-report-draft.pdf') ? 'draft_done_not_polished_final' : 'missing'))),
    evidence_strength: 'medium_high',
    proof: `report_md=${fs.existsSync('reports/alina-evidence-first-report-draft.md')}; evidence_pdf=${fs.existsSync('output/pdf/alina-evidence-first-report-draft.pdf')}; visual_pdf=${fs.existsSync('output/pdf/alina-evidence-visual-report-v1.pdf')}; polished_evidence_pack_pdf=${polishedPdfExists}; polished_evidence_pack_doc=${polishedPdfDocExists}; russian_narrative_report=${russianNarrativeReportExists}; russian_narrative_pdf=${russianNarrativePdfExists}; russian_narrative_map=${russianNarrativeMapExists}`,
    evidence_files: 'reports/alina-evidence-first-report-draft.md;reports/alina-russian-narrative-report-v1.md;data_processed/russian_narrative_evidence_map.csv;docs/decision/russian-narrative-evidence-map-v1.md;output/pdf/alina-evidence-first-report-draft.pdf;output/pdf/alina-evidence-visual-report-v1.pdf;output/pdf/alina-polished-evidence-pack-v1.pdf;output/pdf/alina-russian-narrative-report-v1.pdf;docs/decision/polished-evidence-pack-v1.md',
    remaining_gap: 'Polished evidence PDF, Russian narrative PDF, and Russian argument map exist as publication-ready drafts, but they are not final validated investor/user-facing proof because manual competitor inspection and prototype/user validation remain open.',
    next_action: 'After manual inspection and prototype sessions, update the pack with validated screenshots, scorecards, and final claim statuses.'
  },
  {
    requirement_id: 'REQ_09_VERSIONING_PROVENANCE',
    requirement: 'Research is saved locally, traceable, committed, and pushed to GitHub.',
    objective_source: 'User asked to save data locally, commit, and push so work is not lost.',
    status: manifest.length && manifestMissing === 0 ? 'proved_active' : 'partial',
    evidence_strength: 'high',
    proof: `manifest_rows=${manifest.length}; missing_manifest=${manifestMissing}; git_versioned=active`,
    evidence_files: 'data_processed/evidence_artifact_manifest.csv;docs/decision/evidence-package-manifest-v1.md;git log',
    remaining_gap: 'Manifest must be regenerated after future evidence changes.',
    next_action: 'Regenerate manifest and commit after each major layer.'
  },
  {
    requirement_id: 'REQ_10_VALIDATION_GATES',
    requirement: 'Remaining validation gates are explicit and prioritized.',
    objective_source: 'User wanted critical thinking and continued work when information is missing.',
    status: roadmap.length && validationExecutionDashboard.length && validationCaptureRows ? 'proved_v1_open_gates_capture_ready' : (roadmap.length && validationExecutionDashboard.length ? 'proved_v1_open_gates_execution_dashboard_ready' : (roadmap.length ? 'proved_v1_open_gates' : 'missing')),
    evidence_strength: 'strong',
    proof: `roadmap_rows=${roadmap.length}; p0=${p0Roadmap.length}; p1=${p1Roadmap.length}; execution_tasks=${validationExecutionDashboard.length}; execution_p0=${p0ExecutionTasks.length}; execution_p1=${p1ExecutionTasks.length}; p0_command_rows=${p0CommandCenter.length}; p0_command_blockers=${p0CommandBlockers.length}; p0_command_p0=${p0CommandRows.length}; p0_field_guide_sections=${p0FieldGuide.length}; validation_workspace_lanes=${validationWorkspace.length}; validation_batch01_rows=${validationBatch01.length}; validation_batch02_rows=${validationBatch02.length}; validation_batch03_rows=${validationBatch03.length}; validation_rollup_rows=${validationEvidenceRollup.length}; validation_rollup_missing=${validationEvidenceRollup.filter(row => row.evidence_state === 'missing_batch_note').length}; validation_gate_rows=${validationGateCalculator.length}; validation_gate_status_rows=${validationGateStatusSummary.length}; validation_gates_passed=${validationGatesPassed}; validation_gates_not_started=${validationGatesNotStarted}; validation_batch_local_artifact_links=${validationBatchPrefilledLocalArtifacts}; hypothesis_decision_rows=${hypothesisDecisions.length}; hypothesis_hold=${holdHypothesisDecisions}; hypothesis_go=${goHypothesisDecisions}; hypothesis_stop=${stopHypothesisDecisions}; capture_rows=${validationCaptureRows}; manual_capture_rows=${manualWalkthroughCapture.length}; paid_capture_rows=${paidFlowCapture.length}; icp_capture_rows=${icpInterviewCapture.length}; prototype_capture_rows=${prototypeSessionCapture.length}; reddit_manual_capture_rows=${redditManualCaptureSheet.length}; human_confirmed=${humanConfirmed}; manual_inspection_targets=${manualInspectionPacket.length}; public_listing_inspected=${publicListingInspected}; manual_app_walkthrough_done=${manualInspectionDone}`,
    evidence_files: 'data_processed/validation_gap_roadmap.csv;data_processed/validation_execution_dashboard.csv;data_processed/hypothesis_decision_matrix.csv;data_processed/p0_validation_command_center.csv;data_processed/p0_validation_field_guide.csv;data_processed/validation_evidence_workspace_index.csv;data_processed/validation_batch_01_index.csv;data_processed/validation_batch_02_index.csv;data_processed/validation_batch_03_index.csv;data_processed/validation_evidence_rollup.csv;data_processed/validation_gate_calculator.csv;data_processed/validation_gate_status_summary.csv;data_processed/manual_walkthrough_capture_sheet.csv;data_processed/paid_flow_capture_sheet.csv;data_processed/icp_interview_capture_sheet.csv;data_processed/prototype_session_capture_sheet.csv;data_processed/reddit_manual_reading_capture_sheet.csv;docs/decision/validation-gap-roadmap-v1.md;docs/decision/validation-execution-dashboard-v1.md;docs/decision/hypothesis-decision-matrix-v1.md;docs/decision/p0-validation-command-center-v1.md;docs/decision/p0-validation-field-guide-v1.md;docs/decision/validation-evidence-workspace-v1.md;docs/decision/validation-batch-01-v1.md;docs/decision/validation-batch-02-v1.md;docs/decision/validation-batch-03-v1.md;docs/decision/validation-evidence-rollup-v1.md;docs/decision/validation-gate-calculator-v1.md;docs/decision/validation-capture-sheets-v1.md;docs/audience/reddit-manual-reading-capture-sheet-v1.md;data_processed/top100_human_validation_queue.csv;data_processed/manual_competitor_inspection_packet.csv;data_processed/public_listing_inspection_results.csv;docs/competitive/manual-competitor-inspection-packet-v1.md;docs/competitive/public-listing-inspection-v1.md',
    remaining_gap: 'Open P0 gates remain: app/onboarding walkthrough screenshots, paywall human sign-off, whitespace validation, competitive advantage prototype sessions, ICP validation.',
    next_action: 'Execute P0 rows in the validation execution dashboard, then update source CSVs and final verdicts.'
  }
];

writeCsv(OUT, requirements, [
  'requirement_id', 'requirement', 'objective_source', 'status', 'evidence_strength',
  'proof', 'evidence_files', 'remaining_gap', 'next_action'
]);

const lines = [];
lines.push('# Research Completion Audit V1');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Purpose');
lines.push('');
lines.push('This audit maps the original user objective to current evidence. It prevents the project from declaring victory just because many artifacts exist: each requirement is marked as proved, partial, directional, draft, or still requiring validation.');
lines.push('');
lines.push('## Status Mix');
lines.push('');
lines.push(bulletCounts(countBy(requirements, 'status')));
lines.push('');
lines.push('## Evidence Strength Mix');
lines.push('');
lines.push(bulletCounts(countBy(requirements, 'evidence_strength')));
lines.push('');
lines.push('## Completion Matrix');
lines.push('');
lines.push(mdTable(requirements, [
  { key: 'requirement_id', label: 'Requirement' },
  { key: 'status', label: 'Status' },
  { key: 'evidence_strength', label: 'Strength' },
  { key: 'proof', label: 'Proof' },
  { key: 'remaining_gap', label: 'Remaining Gap' },
  { key: 'next_action', label: 'Next Action' }
]));
lines.push('');
lines.push('## Decision Read');
lines.push('');
lines.push('- The research OS and evidence package are now strong enough for continued structured validation.');
lines.push('- The goal is not complete because human/manual competitor validation, in-app paywall validation, and user/prototype validation are still not fully proven.');
lines.push('- The next highest-value work is to close P0 validation gates rather than add more unvalidated claims.');
lines.push('');
lines.push('## Files');
lines.push('');
lines.push(`- \`${OUT}\``);

fs.writeFileSync(OUT_DOC, `${lines.join('\n')}\n`);

console.log(`audit=${OUT}`);
console.log(`doc=${OUT_DOC}`);
console.log(`requirements=${requirements.length}`);
console.log(`p0_open=${p0Roadmap.length}`);
console.log(`execution_tasks=${validationExecutionDashboard.length}`);
