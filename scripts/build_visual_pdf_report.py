from __future__ import annotations

import csv
import re
from collections import Counter
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
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
OUT = ROOT / "output" / "pdf" / "alina-evidence-visual-report-v1.pdf"


def read_csv(path: str) -> list[dict[str, str]]:
    with (ROOT / path).open(newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def count_by(rows: list[dict[str, str]], key: str) -> Counter:
    return Counter(row.get(key) or "unknown" for row in rows)


def split_tag_counts(rows: list[dict[str, str]], key: str) -> Counter:
    out: Counter = Counter()
    for row in rows:
        for tag in (row.get(key) or "").split("|"):
            if not tag:
                continue
            name = tag.split(":", 1)[0]
            out[name] += 1
    return out


def money(value: str) -> str:
    try:
        n = float(value)
    except Exception:
        return value or "n/a"
    if abs(n) >= 1_000_000_000:
        return f"${n / 1_000_000_000:.1f}B"
    if abs(n) >= 1_000_000:
        return f"${n / 1_000_000:.1f}M"
    return f"${n:,.0f}"


def number(value: str) -> str:
    try:
        return f"{float(value):,.0f}"
    except Exception:
        return value or "n/a"


def clean(value: object) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


class BarChart(Flowable):
    def __init__(
        self,
        title: str,
        rows: list[tuple[str, float]],
        width: float = 7.1 * inch,
        bar_width: float = 3.6 * inch,
        row_height: float = 0.34 * inch,
        formatter=lambda v: f"{v:,.0f}",
    ):
        super().__init__()
        self.title = title
        self.rows = rows[:10]
        self.width = width
        self.bar_width = bar_width
        self.row_height = row_height
        self.formatter = formatter
        self.height = 0.55 * inch + len(self.rows) * self.row_height + 0.1 * inch

    def wrap(self, avail_width, avail_height):
        return min(self.width, avail_width), self.height

    def draw(self):
        c = self.canv
        palette = [
            colors.HexColor("#2563eb"),
            colors.HexColor("#059669"),
            colors.HexColor("#d97706"),
            colors.HexColor("#7c3aed"),
            colors.HexColor("#dc2626"),
            colors.HexColor("#0891b2"),
        ]
        c.setFont("Helvetica-Bold", 11)
        c.setFillColor(colors.HexColor("#111827"))
        c.drawString(0, self.height - 0.24 * inch, self.title)
        max_value = max([value for _, value in self.rows] or [1])
        label_w = self.width - self.bar_width - 0.8 * inch
        y = self.height - 0.55 * inch
        for i, (label, value) in enumerate(self.rows):
            y -= self.row_height
            c.setFont("Helvetica", 7.4)
            c.setFillColor(colors.HexColor("#111827"))
            c.drawString(0, y + 0.08 * inch, clean(label)[:42])
            c.setFillColor(colors.HexColor("#eef2f7"))
            c.roundRect(label_w, y + 0.04 * inch, self.bar_width, 0.16 * inch, 2, stroke=0, fill=1)
            c.setFillColor(palette[i % len(palette)])
            w = self.bar_width * (float(value) / max_value if max_value else 0)
            c.roundRect(label_w, y + 0.04 * inch, max(1, w), 0.16 * inch, 2, stroke=0, fill=1)
            c.setFillColor(colors.HexColor("#111827"))
            c.setFont("Helvetica-Bold", 7.2)
            c.drawRightString(self.width, y + 0.075 * inch, self.formatter(value))


def page_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#64748b"))
    canvas.drawString(doc.leftMargin, 0.35 * inch, "Alina Evidence-First Visual Report V1")
    canvas.drawRightString(doc.pagesize[0] - doc.rightMargin, 0.35 * inch, f"Page {doc.page}")
    canvas.restoreState()


def para(text: str, style):
    return Paragraph(clean(text), style)


def table(rows: list[list[str]], col_widths: list[float] | None = None):
    data = [[Paragraph(clean(cell), STYLES["Small"]) for cell in row] for row in rows]
    t = Table(data, colWidths=col_widths, repeatRows=1, hAlign="LEFT")
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e8eef7")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#cbd5e1")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
            ]
        )
    )
    return t


styles = getSampleStyleSheet()
STYLES = {
    "Title": ParagraphStyle(
        "TitleV",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=25,
        leading=30,
        textColor=colors.HexColor("#111827"),
        spaceAfter=14,
    ),
    "H1": ParagraphStyle(
        "H1V",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=15,
        leading=18,
        textColor=colors.HexColor("#1f2937"),
        spaceBefore=10,
        spaceAfter=6,
    ),
    "H2": ParagraphStyle(
        "H2V",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=11.5,
        leading=14,
        textColor=colors.HexColor("#334155"),
        spaceBefore=8,
        spaceAfter=5,
    ),
    "Body": ParagraphStyle(
        "BodyV",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9,
        leading=12.5,
        alignment=TA_LEFT,
        spaceAfter=6,
    ),
    "Small": ParagraphStyle(
        "SmallV",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=7.1,
        leading=8.6,
    ),
}


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)

    expanded = read_csv("data_raw/expanded/all_expanded_dedup.csv")
    whitespace = read_csv("data_processed/whitespace_signal_matrix.csv")
    tam = read_csv("data_processed/tam_sam_som_model.csv")
    som = read_csv("data_processed/som_sensitivity_scenarios.csv")
    top100 = read_csv("data_processed/top100_competitor_review_scorecard.csv")
    iap = read_csv("data_raw/app_store_iap_pricing_raw.csv")
    gplay = read_csv("data_raw/google_play_pricing_raw.csv")
    reviews = read_csv("data_processed/review_jtbd_cluster_summary.csv")
    forum = read_csv("data_processed/forum_quote_coding_matrix.csv")

    primary = [r for r in top100 if r.get("duplicate_flag") == "primary_app_entry"]
    direct_ref = [r for r in primary if r.get("competitive_verdict") == "direct_reference_competitor"]
    high_threat = [r for r in primary if float(r.get("competitive_threat_score") or 0) >= 24]
    gplay_ok = [r for r in gplay if r.get("collection_status") == "ok"]

    story = []
    story.append(para("Alina Evidence-First Visual Report V1", STYLES["Title"]))
    story.append(
        para(
            "A visual companion to the evidence draft: competitor universe, market sizing, whitespace, top-100 review, pricing, review language, forum coding, and product-core implications.",
            STYLES["Body"],
        )
    )
    story.append(Spacer(1, 0.1 * inch))
    story.append(
        table(
            [
                ["Metric", "Value"],
                ["Expanded competitor universe", number(str(len(expanded)))],
                ["Top-100 unique primary apps", number(str(len(primary)))],
                ["High-threat unique competitors", number(str(len(high_threat)))],
                ["Direct reference competitors", number(str(len(direct_ref)))],
                ["App Store IAP rows", number(str(len(iap)))],
                ["Google Play successful lookups", number(str(len(gplay_ok)))],
                ["Forum quote-coding rows", number(str(len(forum)))],
            ],
            [2.8 * inch, 2.0 * inch],
        )
    )
    story.append(Spacer(1, 0.15 * inch))
    story.append(
        para(
            "Evidence verdict: conditional go for continued validation. The strongest whitespace remains behavior-tied avatar or identity progression caused by a completed daily action.",
            STYLES["Body"],
        )
    )

    story.append(PageBreak())
    story.append(para("1. Universe And Whitespace", STYLES["H1"]))
    story.append(
        BarChart(
            "Expanded Rows By Niche",
            [(k, float(v)) for k, v in count_by(expanded, "niche").most_common()],
        )
    )
    story.append(Spacer(1, 0.12 * inch))
    story.append(
        BarChart(
            "Whitespace Bands",
            [(k, float(v)) for k, v in count_by(whitespace, "whitespace_band").most_common()],
        )
    )
    story.append(
        para(
            "Broad whitespace is weak because the adjacent markets are crowded. Narrow whitespace is stronger because behavior-tied avatar progression appears rare in the top-100 metadata.",
            STYLES["Body"],
        )
    )

    story.append(PageBreak())
    story.append(para("2. Market Model", STYLES["H1"]))
    story.append(
        BarChart(
            "SAM Base By Pillar",
            [(r["pillar"], float(r.get("samBase") or 0)) for r in tam],
            formatter=lambda v: money(str(v)),
        )
    )
    story.append(Spacer(1, 0.12 * inch))
    story.append(
        BarChart(
            "SOM Annual Revenue Scenarios",
            [(r["scenario"], float(r.get("annualRevenue") or 0)) for r in som],
            formatter=lambda v: money(str(v)),
        )
    )
    story.append(
        para(
            "The model avoids adding five TAMs together. The direct intersection SAM is treated as a discounted overlap across adjacent markets.",
            STYLES["Body"],
        )
    )

    story.append(PageBreak())
    story.append(para("3. Competitive Review", STYLES["H1"]))
    story.append(
        BarChart(
            "Top-100 Competitor Verdicts",
            [(k, float(v)) for k, v in count_by(top100, "competitive_verdict").most_common()],
        )
    )
    story.append(Spacer(1, 0.12 * inch))
    top_threats = sorted(primary, key=lambda r: float(r.get("competitive_threat_score") or 0), reverse=True)[:10]
    story.append(
        table(
            [["Rank", "App", "Threat", "Verdict", "Core", "Behavior Progression"]]
            + [
                [
                    r.get("review_rank", ""),
                    r.get("app_name", ""),
                    r.get("competitive_threat_score", ""),
                    r.get("competitive_verdict", ""),
                    r.get("alina_core_score", ""),
                    r.get("behavior_tied_progression", ""),
                ]
                for r in top_threats
            ]
        )
    )
    story.append(
        para(
            "The scorecard finds many close substitutes but only one direct reference competitor under the strict behavior-tied progression rule.",
            STYLES["Body"],
        )
    )

    story.append(PageBreak())
    story.append(para("4. Pricing Evidence", STYLES["H1"]))
    story.append(
        BarChart(
            "Observed App Store IAP Price Bands",
            [(k, float(v)) for k, v in count_by(iap, "price_band").most_common()],
        )
    )
    story.append(Spacer(1, 0.12 * inch))
    story.append(
        BarChart(
            "Google Play Pricing Models",
            [(k, float(v)) for k, v in count_by(gplay_ok, "pricing_model").most_common()],
        )
    )
    story.append(
        para(
            "Pricing evidence supports free entry with paid depth as the dominant adjacent pattern. App Store exposes richer price ladders; Google Play validates IAP/ad-supported monetization at Android scale.",
            STYLES["Body"],
        )
    )

    story.append(PageBreak())
    story.append(para("5. Audience And Review Language", STYLES["H1"]))
    story.append(
        BarChart(
            "Top Review JTBD And Pain Clusters",
            [(r["cluster_label"], float(r.get("review_rows") or 0)) for r in reviews[:8]],
        )
    )
    story.append(Spacer(1, 0.12 * inch))
    tag_counts = split_tag_counts(forum, "coding_tags")
    story.append(
        BarChart(
            "Forum Quote Coding Tags",
            [(k, float(v)) for k, v in tag_counts.most_common(10)],
        )
    )
    story.append(
        para(
            "Review and forum language converge on a small daily anchor, concrete action, visible progress, subscription sensitivity, safety boundaries, and recovery from missed days.",
            STYLES["Body"],
        )
    )

    story.append(PageBreak())
    story.append(para("6. Product Core And Next Validation", STYLES["H1"]))
    story.append(
        table(
            [
                ["Product Core Element", "Evidence Read"],
                ["Personal meaning", "Common across top-100 metadata and review language."],
                ["One daily action", "Strongly supported by review/JTBD and habit-loop evidence."],
                ["Short reset", "Supported, but must feel gentle and non-clinical."],
                ["Avatar or identity feedback", "Common as a motif; rare when causally behavior-tied."],
                ["Visible progression", "Strong motivation signal, but strict streaks create anxiety."],
                ["Next-day hook", "Common retention pattern; needs forgiveness/recovery mechanics."],
            ],
            [2.2 * inch, 4.7 * inch],
        )
    )
    story.append(Spacer(1, 0.12 * inch))
    story.append(
        table(
            [
                ["Remaining Validation", "Why It Matters"],
                ["Human validation of battlecards", "Avoid overclaiming AI-assisted metadata review."],
                ["Web/paywall screenshot pass", "Confirm actual trial terms and product packaging."],
                ["Prototype test of two-minute loop", "Test whether avatar feedback makes action feel meaningful."],
                ["Safety/compliance framing", "Reduce risk around astrology, AI guidance, and emotional support."],
            ],
            [2.4 * inch, 4.5 * inch],
        )
    )

    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=letter,
        rightMargin=0.55 * inch,
        leftMargin=0.55 * inch,
        topMargin=0.55 * inch,
        bottomMargin=0.55 * inch,
        title="Alina Evidence-First Visual Report V1",
        author="Alina Research OS",
    )
    doc.build(story, onFirstPage=page_footer, onLaterPages=page_footer)
    print(OUT)


if __name__ == "__main__":
    main()
