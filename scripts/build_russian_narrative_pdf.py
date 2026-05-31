from __future__ import annotations

import re
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output" / "pdf"
DOCUMENTS = [
    (
        ROOT / "reports" / "alina-russian-narrative-report-v1.md",
        OUTPUT_DIR / "alina-russian-narrative-report-v1.pdf",
        "Alina Research - русский narrative report",
    ),
    (
        ROOT / "reports" / "alina-russian-readable-report-v2.md",
        OUTPUT_DIR / "alina-russian-readable-report-v2.pdf",
        "Alina Research - читаемая русская версия V2",
    ),
    (
        ROOT / "reports" / "alina-global-hypothesis-report-v1.md",
        OUTPUT_DIR / "alina-global-hypothesis-report-v1.pdf",
        "Alina Research - мировой рынок и гипотезы",
    ),
]


FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
]


def register_fonts() -> tuple[str, str]:
    regular = next((Path(p) for p in FONT_CANDIDATES if Path(p).exists() and "Bold" not in p), None)
    bold = next((Path(p) for p in FONT_CANDIDATES if Path(p).exists() and "Bold" in p), None)
    if not regular:
        raise RuntimeError("No Cyrillic-capable font found for Russian PDF generation.")
    pdfmetrics.registerFont(TTFont("RuRegular", str(regular)))
    if bold:
        pdfmetrics.registerFont(TTFont("RuBold", str(bold)))
    else:
        pdfmetrics.registerFont(TTFont("RuBold", str(regular)))
    return "RuRegular", "RuBold"


REGULAR_FONT, BOLD_FONT = register_fonts()


def escape(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def inline_markdown(text: str) -> str:
    text = escape(text.strip())
    text = re.sub(r"\*\*(.+?)\*\*", rf"<font name='{BOLD_FONT}'>\1</font>", text)
    text = re.sub(r"`([^`]+)`", rf"<font name='{REGULAR_FONT}' color='#334155'>\1</font>", text)
    return text


def split_table_row(line: str) -> list[str]:
    line = line.strip()
    if line.startswith("|"):
        line = line[1:]
    if line.endswith("|"):
        line = line[:-1]
    return [cell.strip() for cell in line.split("|")]


def is_separator(line: str) -> bool:
    cells = split_table_row(line)
    return bool(cells) and all(re.fullmatch(r":?-{3,}:?", c.strip()) for c in cells)


def page_number(canvas, doc):
    canvas.saveState()
    canvas.setFont(REGULAR_FONT, 8)
    canvas.setFillColor(colors.HexColor("#667085"))
    canvas.drawString(doc.leftMargin, 0.9 * cm, doc.title or "Alina Research")
    canvas.drawRightString(doc.pagesize[0] - doc.rightMargin, 0.9 * cm, f"Страница {doc.page}")
    canvas.restoreState()


def table_widths(column_count: int, available_width: float) -> list[float]:
    if column_count == 2:
        return [available_width * 0.32, available_width * 0.68]
    if column_count == 3:
        return [available_width * 0.24, available_width * 0.18, available_width * 0.58]
    if column_count == 4:
        return [available_width * 0.18, available_width * 0.22, available_width * 0.14, available_width * 0.46]
    return [available_width / column_count] * column_count


def build_story(markdown: str):
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="RuTitle",
            parent=styles["Title"],
            fontName=BOLD_FONT,
            fontSize=22,
            leading=28,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#111827"),
            spaceAfter=16,
        )
    )
    styles.add(
        ParagraphStyle(
            name="RuH1",
            parent=styles["Heading1"],
            fontName=BOLD_FONT,
            fontSize=15,
            leading=19,
            textColor=colors.HexColor("#1f2937"),
            spaceBefore=14,
            spaceAfter=7,
        )
    )
    styles.add(
        ParagraphStyle(
            name="RuH2",
            parent=styles["Heading2"],
            fontName=BOLD_FONT,
            fontSize=12,
            leading=15,
            textColor=colors.HexColor("#344054"),
            spaceBefore=9,
            spaceAfter=5,
        )
    )
    styles.add(
        ParagraphStyle(
            name="RuBody",
            parent=styles["BodyText"],
            fontName=REGULAR_FONT,
            fontSize=9.7,
            leading=14.2,
            alignment=TA_LEFT,
            spaceAfter=7,
        )
    )
    styles.add(
        ParagraphStyle(
            name="RuSmall",
            parent=styles["BodyText"],
            fontName=REGULAR_FONT,
            fontSize=7.4,
            leading=9.5,
        )
    )
    styles.add(
        ParagraphStyle(
            name="RuBullet",
            parent=styles["BodyText"],
            fontName=REGULAR_FONT,
            fontSize=9,
            leading=12.5,
        )
    )

    story = []
    lines = markdown.splitlines()
    bullet_buffer: list[str] = []
    i = 0

    def flush_bullets():
        nonlocal bullet_buffer
        if not bullet_buffer:
            return
        story.append(
            ListFlowable(
                [ListItem(Paragraph(inline_markdown(item), styles["RuBullet"]), leftIndent=8) for item in bullet_buffer],
                bulletType="bullet",
                leftIndent=16,
                bulletFontName=REGULAR_FONT,
                bulletFontSize=7,
            )
        )
        story.append(Spacer(1, 5))
        bullet_buffer = []

    while i < len(lines):
        line = lines[i].rstrip()
        if not line:
            flush_bullets()
            i += 1
            continue

        if line.startswith("|") and i + 1 < len(lines) and lines[i + 1].startswith("|") and is_separator(lines[i + 1]):
            flush_bullets()
            rows = [split_table_row(line)]
            i += 2
            while i < len(lines) and lines[i].startswith("|"):
                rows.append(split_table_row(lines[i]))
                i += 1
            col_count = max(len(r) for r in rows)
            normalized = [r + [""] * (col_count - len(r)) for r in rows]
            data = [[Paragraph(inline_markdown(cell), styles["RuSmall"]) for cell in row] for row in normalized]
            table = Table(
                data,
                colWidths=table_widths(col_count, 17.2 * cm),
                repeatRows=1,
                splitByRow=1,
                hAlign="LEFT",
            )
            table.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e7eef8")),
                        ("FONTNAME", (0, 0), (-1, 0), BOLD_FONT),
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
            story.append(table)
            story.append(Spacer(1, 8))
            continue

        if line.startswith("- "):
            bullet_buffer.append(line[2:].strip())
            i += 1
            continue

        flush_bullets()

        if line.startswith("# "):
            story.append(Paragraph(inline_markdown(line[2:]), styles["RuTitle"]))
            story.append(Spacer(1, 6))
        elif line.startswith("## "):
            if len(story) > 25 and line.startswith("## 1."):
                story.append(PageBreak())
            story.append(Paragraph(inline_markdown(line[3:]), styles["RuH1"]))
        elif line.startswith("### "):
            story.append(Paragraph(inline_markdown(line[4:]), styles["RuH2"]))
        else:
            story.append(Paragraph(inline_markdown(line), styles["RuBody"]))
        i += 1

    flush_bullets()
    return story


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    built = []
    for source, output, title in DOCUMENTS:
        if not source.exists():
            continue
        markdown = source.read_text(encoding="utf-8")
        doc = SimpleDocTemplate(
            str(output),
            pagesize=A4,
            rightMargin=1.8 * cm,
            leftMargin=1.8 * cm,
            topMargin=1.7 * cm,
            bottomMargin=1.5 * cm,
            title=title,
        )
        doc.build(build_story(markdown), onFirstPage=page_number, onLaterPages=page_number)
        built.append(str(output))
    print("\n".join(built))


if __name__ == "__main__":
    main()
