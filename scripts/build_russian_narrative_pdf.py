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
from reportlab.graphics.shapes import Circle, Drawing, Line, Rect, String
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
        "АУРА Research - мировой рынок и гипотезы",
    ),
    (
        ROOT / "reports" / "alina-global-executive-narrative-v1.md",
        OUTPUT_DIR / "alina-global-executive-narrative-v1.pdf",
        "Alina Research - executive narrative",
    ),
    (
        ROOT / "reports" / "alina-global-reader-report-v1.md",
        OUTPUT_DIR / "alina-global-reader-report-v1.pdf",
        "Alina Research - reader version",
    ),
    (
        ROOT / "reports" / "aura-mvp-spec-v1.md",
        OUTPUT_DIR / "AURA_MVP_SPEC_V1.pdf",
        "AURA MVP Specification v1",
    ),
    (
        ROOT / "reports" / "aura-technical-blueprint-v1.md",
        OUTPUT_DIR / "AURA_TECHNICAL_BLUEPRINT_V1.pdf",
        "AURA Technical Blueprint v1",
    ),
    (
        ROOT / "reports" / "aura-gtm-plan-v1.md",
        OUTPUT_DIR / "AURA_GTM_PLAN_V1.pdf",
        "AURA GTM Plan v1",
    ),
    (
        ROOT / "reports" / "aura-prd-sprint-backlog-v1.md",
        OUTPUT_DIR / "AURA_PRD_SPRINT_BACKLOG_V1.pdf",
        "AURA PRD / Sprint Backlog v1",
    ),
    (
        ROOT / "reports" / "aura-master-book.md",
        OUTPUT_DIR / "AURA_MASTER_BOOK.pdf",
        "AURA",
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


def add_label(drawing: Drawing, x: float, y: float, text: str, size: int = 8, bold: bool = False, color: str = "#111827", anchor: str = "middle") -> None:
    drawing.add(
        String(
            x,
            y,
            text,
            fontName=BOLD_FONT if bold else REGULAR_FONT,
            fontSize=size,
            fillColor=colors.HexColor(color),
            textAnchor=anchor,
        )
    )


def box(drawing: Drawing, x: float, y: float, w: float, h: float, label: str, fill: str = "#f8fafc", stroke: str = "#cbd5e1") -> None:
    drawing.add(Rect(x, y, w, h, rx=8, ry=8, fillColor=colors.HexColor(fill), strokeColor=colors.HexColor(stroke), strokeWidth=1))
    add_label(drawing, x + w / 2, y + h / 2 + 4, label, size=8, bold=True)


def visual_diagram(name: str):
    width = 17.2 * cm
    height = 9.5 * cm
    drawing = Drawing(width, height)

    def title(text: str, sub: str = "") -> None:
        add_label(drawing, width / 2, height - 24, text, size=14, bold=True)
        if sub:
            add_label(drawing, width / 2, height - 42, sub, size=8, color="#475467")

    if name == "core_loop":
        title("Центральная петля AURA", "Не путь по экранам, а причинная система продукта")
        labels = ["Episode", "Action", "Reset", "Reflection", "Life Canvas", "Tomorrow Hook"]
        y = height / 2 - 16
        w = 2.35 * cm
        gap = 0.35 * cm
        x0 = (width - (len(labels) * w + (len(labels) - 1) * gap)) / 2
        for idx, label in enumerate(labels):
            x = x0 + idx * (w + gap)
            box(drawing, x, y, w, 1.15 * cm, label, fill="#eef6ff", stroke="#93c5fd")
            if idx < len(labels) - 1:
                drawing.add(Line(x + w, y + 0.57 * cm, x + w + gap, y + 0.57 * cm, strokeColor=colors.HexColor("#2563eb"), strokeWidth=1.2))
                add_label(drawing, x + w + gap / 2, y + 0.72 * cm, "->", size=8, bold=True, color="#2563eb")
        add_label(drawing, width / 2, 36, "Если пользователь видит связь между действием и образом, AURA жива.", size=9, bold=True, color="#0f172a")

    elif name == "category_intersection":
        title("AURA на пересечении категорий", "Пять существующих спросов сходятся в одном продукте")
        center_x, center_y = width / 2, height / 2 - 4
        categories = [
            ("Mindfulness", -120, 70, "#dbeafe"),
            ("Astrology", 0, 96, "#ede9fe"),
            ("Avatar", 120, 70, "#dcfce7"),
            ("Coaching", -82, -70, "#fef3c7"),
            ("Progression", 82, -70, "#ffe4e6"),
        ]
        for label, dx, dy, fill in categories:
            drawing.add(Circle(center_x + dx, center_y + dy, 56, fillColor=colors.HexColor(fill), strokeColor=colors.HexColor("#94a3b8"), strokeWidth=1))
            add_label(drawing, center_x + dx, center_y + dy + 2, label, size=8, bold=True)
        drawing.add(Circle(center_x, center_y, 66, fillColor=colors.HexColor("#111827"), strokeColor=colors.HexColor("#111827")))
        add_label(drawing, center_x, center_y + 8, "AURA", size=16, bold=True, color="#ffffff")
        add_label(drawing, center_x, center_y - 12, "meaning + action + memory", size=7, color="#e5e7eb")

    elif name == "competitor_matrix":
        title("Карта конкурентного поля", "AURA должна уйти из угла “контент без действия” и “действие без образа”")
        left, bottom = 2.2 * cm, 1.7 * cm
        w, h = 12.8 * cm, 5.7 * cm
        drawing.add(Line(left, bottom, left + w, bottom, strokeColor=colors.HexColor("#64748b"), strokeWidth=1))
        drawing.add(Line(left, bottom, left, bottom + h, strokeColor=colors.HexColor("#64748b"), strokeWidth=1))
        add_label(drawing, left + w / 2, bottom - 20, "От информации к действию", size=8)
        add_label(drawing, left - 38, bottom + h / 2, "От утилитарности к образу", size=8)
        points = [
            ("Calm", 0.25, 0.28),
            ("Finch", 0.55, 0.45),
            ("Replika", 0.38, 0.7),
            ("Nebula", 0.22, 0.55),
            ("Avatar apps", 0.7, 0.78),
            ("AURA", 0.78, 0.68),
        ]
        for label, px, py in points:
            x, y = left + w * px, bottom + h * py
            fill = "#111827" if label == "AURA" else "#e2e8f0"
            drawing.add(Circle(x, y, 14, fillColor=colors.HexColor(fill), strokeColor=colors.HexColor("#475569")))
            add_label(drawing, x, y - 28, label, size=7, bold=label == "AURA")

    elif name == "journey_map":
        title("Путь первого дня", "Дизайн должен вести пользователя к первому причинному моменту")
        steps = [
            ("Welcome", "обещание"),
            ("Consent", "доверие"),
            ("Profile", "контекст"),
            ("Season", "траектория"),
            ("Episode", "смысл"),
            ("Action", "шаг"),
            ("Reset", "мост"),
            ("Reflection", "доказательство"),
            ("Canvas", "след"),
            ("Hook", "завтра"),
        ]
        x0, y = 0.8 * cm, height / 2 - 18
        w = 1.45 * cm
        gap = 0.18 * cm
        for idx, (label, sub) in enumerate(steps):
            x = x0 + idx * (w + gap)
            box(drawing, x, y, w, 1.25 * cm, label, fill="#f8fafc", stroke="#cbd5e1")
            add_label(drawing, x + w / 2, y - 12, sub, size=6, color="#475467")
            if idx < len(steps) - 1:
                drawing.add(Line(x + w, y + 0.62 * cm, x + w + gap, y + 0.62 * cm, strokeColor=colors.HexColor("#475569")))

    elif name == "architecture_stack":
        title("Архитектура как слои продукта", "Каждый слой должен сохранять причинность от действия до образа")
        layers = [
            ("Mobile App", "экраны, состояния, paywall, reminders", "#dbeafe"),
            ("API Backend", "бизнес-логика, state transitions, jobs", "#e0f2fe"),
            ("AI + Image Layer", "episode, action, Life Canvas, cost logs", "#dcfce7"),
            ("Postgres + Storage", "memory, assets, subscriptions, events", "#fef3c7"),
            ("Analytics + Admin", "funnel, cost, prompt control, safety", "#fee2e2"),
        ]
        x, y = 3.0 * cm, height - 70
        for idx, (label, sub, fill) in enumerate(layers):
            yy = y - idx * 38
            drawing.add(Rect(x, yy, 11.2 * cm, 0.9 * cm, rx=10, ry=10, fillColor=colors.HexColor(fill), strokeColor=colors.HexColor("#94a3b8")))
            add_label(drawing, x + 1.7 * cm, yy + 18, label, size=9, bold=True, anchor="middle")
            add_label(drawing, x + 7.0 * cm, yy + 18, sub, size=7, color="#475467", anchor="middle")

    elif name == "unit_economics":
        title("Экономика первого продукта", "Главный контроль: стоимость одного завершенного loop")
        labels = [("AI text", 24), ("Images", 120), ("Storage", 6), ("Analytics", 10), ("Support", 25), ("Infra", 65)]
        x0, y0 = 2.4 * cm, 1.8 * cm
        max_v = max(v for _, v in labels)
        for idx, (label, value) in enumerate(labels):
            x = x0 + idx * 1.9 * cm
            bar_h = 4.2 * cm * (value / max_v)
            drawing.add(Rect(x, y0, 1.05 * cm, bar_h, fillColor=colors.HexColor("#bfdbfe"), strokeColor=colors.HexColor("#2563eb")))
            add_label(drawing, x + 0.52 * cm, y0 + bar_h + 12, f"${value}", size=7, bold=True)
            add_label(drawing, x + 0.52 * cm, y0 - 14, label, size=6)
        add_label(drawing, width / 2, 34, "Именно поэтому бесплатное ежедневное видео не входит в базовую петлю.", size=9, bold=True)

    elif name == "gtm_funnel":
        title("Путь к первым пользователям", "Запуск ищет не трафик, а доказательство петли")
        funnel = [
            ("150 warm contacts", 13.2 * cm, "#dbeafe"),
            ("60 replies", 10.8 * cm, "#bfdbfe"),
            ("20 interviews", 8.4 * cm, "#93c5fd"),
            ("30 concierge users", 6.4 * cm, "#60a5fa"),
            ("100 warm users", 4.8 * cm, "#3b82f6"),
            ("1000 public users", 3.2 * cm, "#1d4ed8"),
        ]
        y = height - 70
        for idx, (label, w, fill) in enumerate(funnel):
            x = (width - w) / 2
            yy = y - idx * 31
            drawing.add(Rect(x, yy, w, 0.65 * cm, rx=8, ry=8, fillColor=colors.HexColor(fill), strokeColor=colors.HexColor("#1e3a8a")))
            add_label(drawing, width / 2, yy + 13, label, size=8, bold=True, color="#0f172a" if idx < 3 else "#ffffff")

    elif name == "sprint_roadmap":
        title("Дорожная карта сборки", "Пять спринтов строят не все приложение, а доказательство петли")
        steps = [
            ("Sprint 1", "foundation"),
            ("Sprint 2", "episode + action"),
            ("Sprint 3", "Life Canvas"),
            ("Sprint 4", "return + paywall"),
            ("Sprint 5", "admin + launch"),
        ]
        x0, y = 1.2 * cm, height / 2 - 18
        w, gap = 2.8 * cm, 0.45 * cm
        for idx, (label, sub) in enumerate(steps):
            x = x0 + idx * (w + gap)
            box(drawing, x, y, w, 1.35 * cm, label, fill="#f8fafc", stroke="#94a3b8")
            add_label(drawing, x + w / 2, y - 12, sub, size=7, color="#475467")
            if idx < len(steps) - 1:
                drawing.add(Line(x + w, y + 0.67 * cm, x + w + gap, y + 0.67 * cm, strokeColor=colors.HexColor("#0f172a"), strokeWidth=1))

    else:
        title("AURA visual framework")
        add_label(drawing, width / 2, height / 2, name, size=12, bold=True)

    return drawing


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

        if line.strip() == "<!-- PAGEBREAK -->":
            flush_bullets()
            story.append(PageBreak())
            i += 1
            continue

        diagram_match = re.fullmatch(r"\[\[DIAGRAM:([a-z0-9_]+)\]\]", line.strip())
        if diagram_match:
            flush_bullets()
            story.append(visual_diagram(diagram_match.group(1)))
            story.append(Spacer(1, 10))
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
