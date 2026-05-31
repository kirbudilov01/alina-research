from __future__ import annotations

import os
import re
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
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
SOURCE = ROOT / "reports" / "alina-evidence-first-report-draft.md"
OUTPUT_DIR = ROOT / "output" / "pdf"
OUTPUT = OUTPUT_DIR / "alina-evidence-first-report-draft.pdf"


def escape(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def inline_markdown(text: str) -> str:
    text = escape(text.strip())
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"`([^`]+)`", r"<font name='Courier'>\1</font>", text)
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
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#666666"))
    canvas.drawString(doc.leftMargin, 0.35 * inch, "Alina Evidence-First Research Draft")
    canvas.drawRightString(
        doc.pagesize[0] - doc.rightMargin,
        0.35 * inch,
        f"Page {doc.page}",
    )
    canvas.restoreState()


def table_widths(column_count: int, available_width: float) -> list[float]:
    if column_count <= 3:
        return [available_width / column_count] * column_count
    if column_count == 4:
        return [0.8 * inch, 1.65 * inch, 1.15 * inch, available_width - 3.6 * inch]
    return [available_width / column_count] * column_count


def build_story(markdown: str):
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="TitleCustom",
            parent=styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=24,
            leading=30,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#1f2933"),
            spaceAfter=18,
        )
    )
    styles.add(
        ParagraphStyle(
            name="H1Custom",
            parent=styles["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=20,
            textColor=colors.HexColor("#1f2933"),
            spaceBefore=16,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="H2Custom",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=12.5,
            leading=16,
            textColor=colors.HexColor("#334155"),
            spaceBefore=10,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BodyCustom",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=9.3,
            leading=13,
            alignment=TA_LEFT,
            spaceAfter=7,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SmallCustom",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=7.2,
            leading=9,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BulletCustom",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
        )
    )

    story = []
    lines = markdown.splitlines()
    i = 0
    bullet_buffer = []

    def flush_bullets():
        nonlocal bullet_buffer
        if not bullet_buffer:
            return
        items = [
            ListItem(Paragraph(inline_markdown(item), styles["BulletCustom"]), leftIndent=8)
            for item in bullet_buffer
        ]
        story.append(ListFlowable(items, bulletType="bullet", leftIndent=16, bulletFontSize=7))
        story.append(Spacer(1, 4))
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
            data = [
                [Paragraph(inline_markdown(cell), styles["SmallCustom"]) for cell in row]
                for row in normalized
            ]
            table = Table(
                data,
                colWidths=table_widths(col_count, 7.0 * inch),
                repeatRows=1,
                splitByRow=1,
                hAlign="LEFT",
            )
            table.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e8eef7")),
                        ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#1f2933")),
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
            story.append(table)
            story.append(Spacer(1, 8))
            continue

        if line.startswith("- "):
            bullet_buffer.append(line[2:].strip())
            i += 1
            continue

        flush_bullets()

        if line.startswith("# "):
            story.append(Paragraph(inline_markdown(line[2:]), styles["TitleCustom"]))
            story.append(Spacer(1, 8))
        elif line.startswith("## "):
            if story and line.startswith("## ") and re.match(r"## \d+\. ", line):
                story.append(Spacer(1, 4))
            story.append(Paragraph(inline_markdown(line[3:]), styles["H1Custom"]))
        elif line.startswith("### "):
            story.append(Paragraph(inline_markdown(line[4:]), styles["H2Custom"]))
        else:
            story.append(Paragraph(inline_markdown(line), styles["BodyCustom"]))
        i += 1

    flush_bullets()
    return story


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    markdown = SOURCE.read_text(encoding="utf-8")
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=letter,
        rightMargin=0.65 * inch,
        leftMargin=0.65 * inch,
        topMargin=0.65 * inch,
        bottomMargin=0.65 * inch,
        title="Alina Evidence-First Research Report Draft",
        author="Alina Research OS",
    )
    story = build_story(markdown)
    doc.build(story, onFirstPage=page_number, onLaterPages=page_number)
    print(OUTPUT)


if __name__ == "__main__":
    main()
