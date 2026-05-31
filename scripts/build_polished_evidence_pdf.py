from __future__ import annotations

import csv
import re
from collections import Counter
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    Flowable,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "alina-polished-evidence-pack-v1.pdf"
OUT_DOC = ROOT / "docs" / "decision" / "polished-evidence-pack-v1.md"


def clean(value: object) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def read_csv(path: str) -> list[dict[str, str]]:
    file = ROOT / path
    if not file.exists():
        return []
    with file.open(newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def count_by(rows: list[dict[str, str]], key: str) -> Counter:
    return Counter(clean(row.get(key)) or "unknown" for row in rows)


def number(value: object) -> str:
    try:
        return f"{float(value):,.0f}"
    except Exception:
        return clean(value) or "n/a"


def short(value: object, limit: int = 96) -> str:
    text = clean(value)
    if len(text) <= limit:
        return text
    return text[: limit - 1].rstrip() + "..."


def para(text: str, style_name: str = "Body") -> Paragraph:
    return Paragraph(clean(text), STYLES[style_name])


def table(rows: list[list[object]], col_widths: list[float] | None = None, small: bool = True) -> Table:
    style = STYLES["Tiny"] if small else STYLES["Small"]
    data = [[Paragraph(clean(cell), style) for cell in row] for row in rows]
    t = Table(data, colWidths=col_widths, repeatRows=1, hAlign="LEFT")
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#16324f")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#c9d4df")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f6f8fb")]),
            ]
        )
    )
    return t


class CoverBlock(Flowable):
    def __init__(self, width: float = 7.1 * inch, height: float = 2.25 * inch):
        super().__init__()
        self.width = width
        self.height = height

    def wrap(self, avail_width, avail_height):
        return min(self.width, avail_width), self.height

    def draw(self):
        c = self.canv
        c.setFillColor(colors.HexColor("#102235"))
        c.roundRect(0, 0, self.width, self.height, 8, stroke=0, fill=1)
        c.setFillColor(colors.HexColor("#e7f0f8"))
        c.rect(0.25 * inch, 0.22 * inch, 0.08 * inch, self.height - 0.44 * inch, stroke=0, fill=1)
        c.setFont("Helvetica-Bold", 26)
        c.setFillColor(colors.white)
        c.drawString(0.52 * inch, 1.48 * inch, "Alina Evidence Pack V1")
        c.setFont("Helvetica", 10.5)
        c.setFillColor(colors.HexColor("#cfe2f3"))
        c.drawString(0.53 * inch, 1.08 * inch, "Publication-ready evidence draft with explicit validation caveats")
        c.setFont("Helvetica-Bold", 8)
        c.setFillColor(colors.HexColor("#ffd166"))
        c.drawString(0.53 * inch, 0.56 * inch, "STATUS: NOT FINAL VALIDATED INVESTOR PROOF")


class MetricStrip(Flowable):
    def __init__(self, metrics: list[tuple[str, str]], width: float = 7.1 * inch):
        super().__init__()
        self.metrics = metrics
        self.width = width
        self.height = 1.1 * inch

    def wrap(self, avail_width, avail_height):
        return min(self.width, avail_width), self.height

    def draw(self):
        c = self.canv
        gap = 0.08 * inch
        box_w = (self.width - gap * (len(self.metrics) - 1)) / len(self.metrics)
        palette = ["#e8f3ee", "#eef1f7", "#fff1df", "#f4eef8", "#edf7f9"]
        for i, (label, value) in enumerate(self.metrics):
            x = i * (box_w + gap)
            c.setFillColor(colors.HexColor(palette[i % len(palette)]))
            c.roundRect(x, 0, box_w, self.height, 5, stroke=0, fill=1)
            c.setFillColor(colors.HexColor("#122033"))
            c.setFont("Helvetica-Bold", 18)
            c.drawCentredString(x + box_w / 2, 0.58 * inch, value)
            c.setFont("Helvetica", 6.9)
            c.drawCentredString(x + box_w / 2, 0.25 * inch, label[:30])


class BarChart(Flowable):
    def __init__(self, title: str, rows: list[tuple[str, float]], width: float = 7.1 * inch):
        super().__init__()
        self.title = title
        self.rows = rows[:12]
        self.width = width
        self.height = 0.42 * inch + max(1, len(self.rows)) * 0.32 * inch

    def wrap(self, avail_width, avail_height):
        return min(self.width, avail_width), self.height

    def draw(self):
        c = self.canv
        c.setFont("Helvetica-Bold", 10.5)
        c.setFillColor(colors.HexColor("#122033"))
        c.drawString(0, self.height - 0.18 * inch, self.title)
        max_value = max([value for _, value in self.rows] or [1])
        label_w = 2.85 * inch
        bar_w = self.width - label_w - 0.75 * inch
        y = self.height - 0.42 * inch
        for i, (label, value) in enumerate(self.rows):
            y -= 0.32 * inch
            c.setFont("Helvetica", 7.2)
            c.setFillColor(colors.HexColor("#122033"))
            c.drawString(0, y + 0.08 * inch, short(label, 44))
            c.setFillColor(colors.HexColor("#e6edf4"))
            c.roundRect(label_w, y + 0.08 * inch, bar_w, 0.12 * inch, 2, stroke=0, fill=1)
            c.setFillColor(colors.HexColor("#2c7a7b" if i % 2 else "#315f8d"))
            c.roundRect(label_w, y + 0.08 * inch, max(1, bar_w * (value / max_value)), 0.12 * inch, 2, stroke=0, fill=1)
            c.setFont("Helvetica-Bold", 7)
            c.setFillColor(colors.HexColor("#122033"))
            c.drawRightString(self.width, y + 0.075 * inch, number(value))


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#64748b"))
    canvas.drawString(doc.leftMargin, 0.35 * inch, "Alina Evidence Pack V1 - evidence draft, not final validation")
    canvas.drawRightString(doc.pagesize[0] - doc.rightMargin, 0.35 * inch, f"Page {doc.page}")
    canvas.restoreState()


styles = getSampleStyleSheet()
STYLES = {
    "Title": ParagraphStyle(
        "PackTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=27,
        textColor=colors.HexColor("#122033"),
        spaceAfter=10,
    ),
    "H1": ParagraphStyle(
        "PackH1",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=15,
        leading=18,
        textColor=colors.HexColor("#122033"),
        spaceBefore=12,
        spaceAfter=6,
    ),
    "H2": ParagraphStyle(
        "PackH2",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=13.5,
        textColor=colors.HexColor("#315f8d"),
        spaceBefore=8,
        spaceAfter=4,
    ),
    "Body": ParagraphStyle(
        "PackBody",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.1,
        leading=12.4,
        alignment=TA_LEFT,
        textColor=colors.HexColor("#1f2933"),
        spaceAfter=6,
    ),
    "Callout": ParagraphStyle(
        "PackCallout",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=9.2,
        leading=12.5,
        textColor=colors.HexColor("#6b3f00"),
        backColor=colors.HexColor("#fff3d9"),
        borderColor=colors.HexColor("#f0c36a"),
        borderWidth=0.6,
        borderPadding=6,
        spaceAfter=8,
    ),
    "Small": ParagraphStyle(
        "PackSmall",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=7.2,
        leading=9,
    ),
    "Tiny": ParagraphStyle(
        "PackTiny",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=6.4,
        leading=8,
    ),
}


def build_doc_note(metrics: dict[str, str]) -> None:
    OUT_DOC.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        "# Polished Evidence Pack V1",
        "",
        "This document registers the publication-style PDF layer.",
        "",
        "## Artifact",
        "",
        f"- PDF: `{OUT.relative_to(ROOT)}`",
        "- Status: publication-ready evidence draft, not final validated investor proof.",
        "",
        "## Snapshot",
        "",
    ]
    for key, value in metrics.items():
        lines.append(f"- {key}: {value}")
    lines.extend(
        [
            "",
            "## Caveat",
            "",
            "The pack is designed for reading and review. It does not close manual competitor inspection, in-app paywall validation, prototype sessions, or ICP/user validation gates.",
        ]
    )
    OUT_DOC.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)

    expanded = read_csv("data_raw/expanded/all_expanded_dedup.csv")
    expanded_raw = read_csv("data_raw/expanded/all_expanded_raw.csv")
    itch = read_csv("data_raw/expanded_itch_raw.csv")
    steam = read_csv("data_raw/expanded_steam_tags_raw.csv")
    desktop = read_csv("data_raw/expanded_desktop_store_raw.csv")
    chrome_raw = read_csv("data_raw/expanded_chrome_extensions_raw.csv")
    cross_source_raw = read_csv("data_processed/cross_source_universe_raw.csv")
    cross_source_dedup = read_csv("data_processed/cross_source_universe_dedup.csv")
    chrome_fit = read_csv("data_processed/chrome_extension_fit_matrix.csv")
    chrome_battlecards = read_csv("data_processed/chrome_extension_mechanic_battlecards.csv")
    market_assumptions = read_csv("data_processed/market_sizing_assumption_audit.csv")
    market_stress = read_csv("data_processed/market_sizing_stress_test.csv")
    evidence = read_csv("data_processed/evidence_claim_register.csv")
    completion = read_csv("data_processed/research_completion_audit.csv")
    manifest = read_csv("data_processed/evidence_artifact_manifest.csv")
    revenue = read_csv("data_processed/competitor_revenue_proxy_review.csv")
    revenue_summary = read_csv("data_processed/competitor_revenue_proxy_market_summary.csv")
    manual = read_csv("data_processed/manual_competitor_inspection_packet.csv")
    manual_rubric = read_csv("data_processed/manual_competitor_inspection_rubric.csv")
    public_listing = read_csv("data_processed/public_listing_inspection_results.csv")
    paywall = read_csv("data_processed/web_paywall_visual_adjudication.csv")
    prototype = read_csv("data_processed/prototype_validation_stimulus_flow.csv")
    prototype_scorecard = read_csv("data_processed/prototype_validation_scorecard.csv")
    icp = read_csv("data_processed/icp_segment_matrix.csv")
    tam = read_csv("data_processed/tam_sam_som_model.csv")
    whitespace = read_csv("data_processed/whitespace_signal_matrix.csv")
    top100 = read_csv("data_processed/top100_competitor_review_scorecard.csv")
    roadmap = read_csv("data_processed/validation_gap_roadmap.csv")
    execution_dashboard = read_csv("data_processed/validation_execution_dashboard.csv")
    manual_capture = read_csv("data_processed/manual_walkthrough_capture_sheet.csv")
    paid_capture = read_csv("data_processed/paid_flow_capture_sheet.csv")
    icp_capture = read_csv("data_processed/icp_interview_capture_sheet.csv")
    prototype_capture = read_csv("data_processed/prototype_session_capture_sheet.csv")

    known_raw_total = len(expanded_raw) + len(itch) + len(steam) + len(desktop) + len(chrome_raw)
    csv_rows = sum(int(row.get("row_count") or 0) for row in manifest if row.get("file_path", "").endswith(".csv"))
    source_refs = sum(int(row.get("source_ref_rows") or 0) for row in manifest if row.get("file_path", "").endswith(".csv"))
    strong_revenue = [row for row in revenue if row.get("revenue_proxy_band") == "strong_bottom_up_money_proxy"]
    medium_plus_revenue = [
        row
        for row in revenue
        if row.get("revenue_proxy_band") in {"strong_bottom_up_money_proxy", "medium_bottom_up_money_proxy"}
    ]
    confirmed_paywall = [row for row in paywall if row.get("visual_adjudication") == "confirmed_visible_public_pricing"]
    partial_paywall = [
        row
        for row in paywall
        if row.get("visual_adjudication")
        in {"confirmed_paid_surface_no_clean_price", "partial_paid_surface_language", "visible_price_context_uncertain"}
    ]
    prototype_screens = {row.get("screen_id") for row in prototype if row.get("screen_id")}
    prototype_segments = {row.get("segment_id") for row in prototype if row.get("segment_id")}
    primary_top100 = [row for row in top100 if row.get("duplicate_flag") == "primary_app_entry"]
    behavior_tied = [row for row in top100 if row.get("behavior_tied_progression") == "yes"]
    public_listing_inspected = [
        row for row in public_listing if row.get("public_listing_inspection_status") == "public_listing_inspected"
    ]
    public_listing_visible_causality = [
        row for row in public_listing if row.get("action_to_avatar_causality_public_read") == "visible_in_public_copy"
    ]
    public_listing_high_clone_risk = [
        row for row in public_listing if row.get("hidden_clone_risk_public_read") == "high_hidden_clone_risk_requires_app_walkthrough"
    ]
    p0_roadmap = [row for row in roadmap if row.get("priority") == "P0"]
    p1_roadmap = [row for row in roadmap if row.get("priority") == "P1"]
    p0_execution = [row for row in execution_dashboard if row.get("priority") == "P0"]
    p1_execution = [row for row in execution_dashboard if row.get("priority") == "P1"]
    capture_rows = len(manual_capture) + len(paid_capture) + len(icp_capture) + len(prototype_capture)

    metrics = {
        "Known raw source/app rows": number(known_raw_total),
        "Cross-source dedup rows": number(len(cross_source_dedup)),
        "Deduplicated universe rows": number(len(expanded)),
        "Tracked manifest artifacts": number(len(manifest)),
        "Tracked CSV rows": number(csv_rows),
        "Competitor revenue proxy rows": number(len(revenue)),
        "Manual P0 inspection targets": number(len(manual)),
        "Validation capture rows": number(capture_rows),
    }
    build_doc_note(metrics)

    story = [
        CoverBlock(),
        Spacer(1, 0.18 * inch),
        MetricStrip(
            [
                ("known raw rows", number(known_raw_total)),
                ("cross-source dedup", number(len(cross_source_dedup))),
                ("dedup universe", number(len(expanded))),
                ("manifest artifacts", number(len(manifest))),
                ("tracked CSV rows", number(csv_rows)),
                ("capture rows", number(capture_rows)),
            ]
        ),
        Spacer(1, 0.14 * inch),
        para(
            "This pack is the designed reading layer on top of the evidence-first research OS. It summarizes what is currently supported, what is merely directional, and what still needs validation before any final market or product claim.",
            "Body",
        ),
        para(
            "Publication-ready evidence draft. It is not final validated investor proof: manual competitor inspection, in-app paywall validation, ICP interviews, and prototype/user sessions remain open gates.",
            "Callout",
        ),
        para("Executive Read", "H1"),
        table(
            [
                ["Area", "Current read", "Proof level"],
                [
                    "Product shape",
                    "Adjacent primitives exist; strict action-to-avatar causality is queued for manual inspection.",
                    "Medium, inspection-ready",
                ],
                [
                    "Market money",
                    "Paid behavior is visible through IAP, Google Play, web/paywall, and competitor revenue proxies.",
                    "Medium-high proxy, not revenue proof",
                ],
                [
                    "Whitespace",
                    "Narrow opening remains behavior-tied identity/avatar progression after a completed daily action.",
                    "Medium, hidden clone risk open",
                ],
                [
                    "Audience",
                    "ICP hypotheses point to ritual/self-improvement/spirituality/calm/cozy-progress users.",
                    "Directional, validation-ready",
                ],
                [
                    "Product core",
                    "Prototype stimulus translates the thesis into an 8-screen two-minute validation loop.",
                    "Ready, unvalidated",
                ],
            ],
            [1.35 * inch, 4.25 * inch, 1.5 * inch],
            small=False,
        ),
        PageBreak(),
        para("Evidence Dashboard", "H1"),
        MetricStrip(
            [
                ("competitors reviewed", number(len(revenue))),
                ("strong money proxies", number(len(strong_revenue))),
                ("medium+ money proxies", number(len(medium_plus_revenue))),
                ("market stress cases", number(len(market_stress))),
                ("paywall screenshots", number(len(paywall))),
            ]
        ),
        Spacer(1, 0.12 * inch),
        table(
            [
                ["Evidence layer", "Count", "Interpretation"],
                ["Five-market coverage", len(count_by(expanded, "niche")), "Core markets represented in the normalized universe."],
                ["Known raw universe", known_raw_total, "Core + itch.io + Steam tag + desktop store + Chrome rows exceed the 30k lower-bound target."],
                ["Cross-source normalized raw", len(cross_source_raw), "Unified provenance rows across core app stores, Google Play fallback, Steam, itch.io, desktop, and Chrome."],
                ["Cross-source dedup", len(cross_source_dedup), "Deduped normalization layer that protects against repeated query/country/tag rows."],
                ["Deduped source universe", len(expanded), "Normalized rows for matrices and scoring."],
                ["Chrome Web Store raw rows", len(chrome_raw), "Source-native browser-extension expansion across five markets."],
                ["Desktop store raw rows", len(desktop), "Source-native Mac App Store desktop/wellness/productivity/game expansion."],
                ["Chrome detail pages parsed", len([row for row in chrome_fit if row.get("detail_status") == "ok"]), "Fit bands, users, tags, and mechanic evidence."],
                ["Chrome mechanic battlecards", len(chrome_battlecards), "Browser-extension mechanics translated into whitespace lessons."],
                ["Market assumption audit", len(market_assumptions), "TAM/SAM/SOM risk rows by market and intersection."],
                ["Market stress scenarios", len(market_stress), "Bottom-up sensitivity cases for reachable users, conversion, and ARPPU."],
                ["Manifest source-like refs", source_refs, "Rows with URLs, package IDs, domains, source IDs, or comparable identifiers."],
                ["Top-100 primary apps", len(primary_top100), "Human-facing competitor review layer."],
                ["Behavior-tied progression signals", len(behavior_tied), "Strict signal is rare in metadata, hence manual inspection is critical."],
                ["P0 public listings inspected", len(public_listing_inspected), "No-broad-search inspection of existing App Store listing excerpts."],
                ["Visible public causality cases", len(public_listing_visible_causality), "Highest-priority walkthrough target; not final clone proof."],
                ["Manual rubric dimensions", len(manual_rubric), "Dimensions for causality, hidden clone risk, paywall, and final verdict."],
                ["ICP segments", len(icp), "Segment hypotheses to test before product commitment."],
                ["Prototype scorecard metrics", len(prototype_scorecard), "Success/kill metrics for the two-minute loop."],
            ],
            [2.05 * inch, 0.78 * inch, 4.25 * inch],
        ),
        Spacer(1, 0.15 * inch),
        BarChart(
            "Evidence status mix",
            [(k, v) for k, v in count_by(evidence, "evidence_status").most_common()],
        ),
        PageBreak(),
        para("Requirement Status Matrix", "H1"),
        para(
            "The completion audit keeps the project honest: the evidence package is substantial, but several requirements remain draft, directional, or validation-ready instead of final.",
            "Body",
        ),
        table(
            [["Requirement", "Status", "Strength", "Remaining gap"]]
            + [
                [
                    row.get("requirement_id"),
                    row.get("status"),
                    row.get("evidence_strength"),
                    short(row.get("remaining_gap"), 150),
                ]
                for row in completion
            ],
            [1.05 * inch, 1.8 * inch, 0.9 * inch, 3.35 * inch],
        ),
        Spacer(1, 0.14 * inch),
        BarChart("Completion audit status mix", [(k, v) for k, v in count_by(completion, "status").most_common()]),
        PageBreak(),
        para("Market-Money Proxy Read", "H1"),
        para(
            "The strongest current claim is not exact revenue. It is that adjacent markets contain visible paid behavior and credible monetization surfaces worth validating more deeply.",
            "Body",
        ),
        table(
            [["Market", "Reviewed", "Strong", "Medium+", "Observed IAP", "Market money read"]]
            + [
                [
                    row.get("market"),
                    row.get("reviewed_competitors"),
                    row.get("strong_proxy_competitors"),
                    row.get("medium_or_stronger_proxy_competitors"),
                    row.get("observed_iap_competitors"),
                    row.get("market_money_read"),
                ]
                for row in revenue_summary
            ],
            [1.35 * inch, 0.78 * inch, 0.65 * inch, 0.72 * inch, 0.78 * inch, 2.82 * inch],
        ),
        Spacer(1, 0.12 * inch),
        table(
            [
                ["Paywall visual layer", "Count", "Read"],
                ["Confirmed visible public pricing", len(confirmed_paywall), "Narrow, concrete public price evidence."],
                ["Partial paid-surface examples", len(partial_paywall), "Useful signal, needs human or in-app sign-off."],
                ["Total adjudicated screenshots", len(paywall), "Evidence quality layer over raw web pages and OCR."],
            ],
            [2.3 * inch, 0.8 * inch, 4.0 * inch],
            small=False,
        ),
        PageBreak(),
        para("Whitespace And Competitor Inspection", "H1"),
        para(
            "The current whitespace thesis is intentionally narrow: not 'no competitors', but 'few visible solutions make identity/avatar progression causally respond to a completed daily action across meaning, action, reset, and progress'.",
            "Body",
        ),
        table(
            [["Rank", "App", "Prefill verdict", "Money proxy", "Why inspect"]]
            + [
                [
                    row.get("inspection_rank"),
                    row.get("app_name"),
                    row.get("competitive_verdict_prefill"),
                    row.get("revenue_proxy_band"),
                    short(row.get("priority_reason"), 120),
                ]
                for row in manual[:12]
            ],
            [0.42 * inch, 1.55 * inch, 1.45 * inch, 1.42 * inch, 2.26 * inch],
        ),
        Spacer(1, 0.12 * inch),
        table(
            [["Public listing execution", "Count", "Read"]]
            + [
                ["P0 public listings inspected", len(public_listing_inspected), "Public App Store copy/excerpts reviewed without broad search."],
                ["Visible action-to-avatar causality", len(public_listing_visible_causality), "High-risk case for immediate walkthrough."],
                ["High public hidden-clone risk", len(public_listing_high_clone_risk), "Requires onboarding/action/progress screenshots before H3 is upgraded or downgraded."],
            ],
            [2.45 * inch, 0.75 * inch, 3.9 * inch],
            small=False,
        ),
        Spacer(1, 0.12 * inch),
        table(
            [
                ["Inspection gate", "Pass condition", "Fail condition"],
                [
                    "Action -> identity/avatar causality",
                    "Completion visibly changes progress/avatar/identity feedback.",
                    "Metadata claim is decorative, generic, or blocked before first value.",
                ],
                [
                    "Hidden direct clone risk",
                    "Flow confirms a close substitute and updates whitespace risk.",
                    "Flow is unrelated or lacks coherent daily transformation loop.",
                ],
                [
                    "Paywall boundary",
                    "First meaningful value and paywall timing are captured.",
                    "Paid surface remains unknown or login/app-store-only.",
                ],
            ],
            [1.6 * inch, 2.75 * inch, 2.75 * inch],
            small=False,
        ),
        PageBreak(),
        para("Audience And Prototype Validation", "H1"),
        para(
            "The pack now has enough structure to run user validation without improvising the product story: two ICP segments, an 8-screen stimulus, and six success/kill metrics.",
            "Body",
        ),
        table(
            [["Segment", "Evidence band", "Primary job", "Risk to validate"]]
            + [
                [
                    row.get("segment_name"),
                    row.get("evidence_band"),
                    short(row.get("core_job"), 95),
                    short(row.get("main_risk"), 105),
                ]
                for row in icp[:6]
            ],
            [1.55 * inch, 1.05 * inch, 2.1 * inch, 2.4 * inch],
        ),
        Spacer(1, 0.12 * inch),
        table(
            [
                ["Prototype validation asset", "Count"],
                ["ICP segments in prototype flow", len(prototype_segments)],
                ["Prototype screens", len(prototype_screens)],
                ["Prototype flow rows", len(prototype)],
                ["Success/kill scorecard metrics", len(prototype_scorecard)],
                ["P0 validation roadmap rows", len(p0_roadmap)],
                ["P1 validation roadmap rows", len(p1_roadmap)],
                ["P0 execution dashboard tasks", len(p0_execution)],
                ["P1 execution dashboard tasks", len(p1_execution)],
                ["Manual walkthrough capture rows", len(manual_capture)],
                ["Paid-flow capture rows", len(paid_capture)],
                ["ICP interview capture rows", len(icp_capture)],
                ["Prototype session capture rows", len(prototype_capture)],
            ],
            [3.4 * inch, 1.1 * inch],
            small=False,
        ),
        PageBreak(),
        para("Open Gates Before Final Claim", "H1"),
        para(
            "The next work should close validation gates rather than inflate claims. These gates decide whether the report graduates from polished evidence draft to final validated strategy.",
            "Body",
        ),
        table(
            [["Gate", "Why it matters", "Next action"]]
            + [
                [
                    row.get("requirement_id"),
                    short(row.get("remaining_gap"), 155),
                    short(row.get("next_action"), 135),
                ]
                for row in completion
                if not row.get("status", "").startswith("proved")
            ],
            [1.2 * inch, 3.25 * inch, 2.65 * inch],
        ),
        Spacer(1, 0.12 * inch),
        table(
            [["Execution task", "Priority", "Evidence to capture"]]
            + [
                [
                    row.get("workstream"),
                    row.get("priority"),
                    short(row.get("exact_evidence_to_capture"), 160),
                ]
                for row in execution_dashboard[:7]
            ],
            [1.75 * inch, 0.65 * inch, 4.7 * inch],
        ),
        Spacer(1, 0.15 * inch),
        para("Evidence File Map", "H1"),
        table(
            [
                ["Evidence group", "Primary files"],
                ["Universe", "data_raw/expanded/*; data_raw/expanded_itch_raw.csv; data_raw/expanded_steam_tags_raw.csv; data_raw/expanded_desktop_store_raw.csv"],
                ["Cross-source universe", "data_processed/cross_source_universe_raw.csv; data_processed/cross_source_universe_dedup.csv; data_processed/cross_source_universe_summary.csv"],
                ["Market money", "data_processed/tam_sam_som_model.csv; data_processed/competitor_revenue_proxy_review.csv"],
                ["Whitespace", "data_processed/whitespace_signal_matrix.csv; data_processed/manual_competitor_inspection_packet.csv"],
                ["Audience", "data_processed/icp_segment_matrix.csv; data_processed/icp_validation_test_plan.csv"],
                ["Prototype", "data_processed/prototype_validation_stimulus_flow.csv; data_processed/prototype_validation_scorecard.csv"],
                ["Validation capture", "data_processed/manual_walkthrough_capture_sheet.csv; data_processed/paid_flow_capture_sheet.csv; data_processed/icp_interview_capture_sheet.csv; data_processed/prototype_session_capture_sheet.csv"],
                ["Audit/provenance", "data_processed/evidence_claim_register.csv; data_processed/research_completion_audit.csv; data_processed/evidence_artifact_manifest.csv"],
            ],
            [1.7 * inch, 5.4 * inch],
        ),
    ]

    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=letter,
        rightMargin=0.7 * inch,
        leftMargin=0.7 * inch,
        topMargin=0.55 * inch,
        bottomMargin=0.62 * inch,
        title="Alina Evidence Pack V1",
        author="Alina Research OS",
    )
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print(f"Wrote {OUT.relative_to(ROOT)}")
    print(f"Wrote {OUT_DOC.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
