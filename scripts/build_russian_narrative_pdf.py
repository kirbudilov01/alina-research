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

    elif name == "hypothesis_map":
        title("Карта проверки гипотез", "Каждый шаг снижает один тип неопределенности")
        items = [
            ("1", "форма продукта"),
            ("2", "рынок и деньги"),
            ("3", "белое пятно"),
            ("4", "преимущество"),
            ("5", "аудитория"),
            ("6", "ядро продукта"),
        ]
        x0, y = 1.2 * cm, height / 2 - 18
        w, gap = 2.35 * cm, 0.35 * cm
        for idx, (num, label) in enumerate(items):
            x = x0 + idx * (w + gap)
            drawing.add(Circle(x + w / 2, y + 1.0 * cm, 18, fillColor=colors.HexColor("#111827"), strokeColor=colors.HexColor("#111827")))
            add_label(drawing, x + w / 2, y + 1.0 * cm - 4, num, size=10, bold=True, color="#ffffff")
            box(drawing, x, y, w, 0.8 * cm, label, fill="#f8fafc", stroke="#cbd5e1")
            if idx < len(items) - 1:
                drawing.add(Line(x + w, y + 1.0 * cm, x + w + gap, y + 1.0 * cm, strokeColor=colors.HexColor("#64748b")))

    elif name == "category_layers":
        title("Категория -> слой продукта", "Каждый рынок дает AURA не цифру, а продуктовую функцию")
        rows = [
            ("Mindfulness", "reset", "#dbeafe"),
            ("Astrology", "meaning", "#ede9fe"),
            ("Coaching", "action", "#fef3c7"),
            ("Avatar", "visual self", "#dcfce7"),
            ("Progression", "return", "#ffe4e6"),
        ]
        x0, y0 = 1.5 * cm, height - 82
        for idx, (cat, layer, fill) in enumerate(rows):
            y = y0 - idx * 31
            box(drawing, x0, y, 5.3 * cm, 0.62 * cm, cat, fill=fill)
            box(drawing, x0 + 6.8 * cm, y, 5.3 * cm, 0.62 * cm, layer, fill="#f8fafc")
            drawing.add(Line(x0 + 5.3 * cm, y + 0.31 * cm, x0 + 6.8 * cm, y + 0.31 * cm, strokeColor=colors.HexColor("#2563eb")))

    elif name == "segment_map":
        title("Карта первых сегментов", "Не все аудитории проверяются одновременно")
        segments = [
            ("Spiritual\nself-improvers", 2.1 * cm, 5.1 * cm, "#ede9fe"),
            ("Habit / progress\nusers", 8.2 * cm, 5.1 * cm, "#dbeafe"),
            ("Reset\nusers", 2.1 * cm, 2.4 * cm, "#dcfce7"),
            ("Avatar / future-self\nusers", 8.2 * cm, 2.4 * cm, "#fef3c7"),
        ]
        for label, x, y, fill in segments:
            drawing.add(Rect(x, y, 5.2 * cm, 1.45 * cm, rx=10, ry=10, fillColor=colors.HexColor(fill), strokeColor=colors.HexColor("#94a3b8")))
            for j, part in enumerate(label.split("\n")):
                add_label(drawing, x + 2.6 * cm, y + 0.9 * cm - j * 12, part, size=9, bold=j == 0)
        add_label(drawing, width / 2, 40, "Первые два сегмента дают лучший баланс смысла и действия.", size=9, bold=True)

    elif name == "timeline_30":
        title("Накопление ценности во времени", "AURA должна становиться понятнее на День 2, 7 и 30")
        items = [("Day 1", "первый loop"), ("Day 2", "память"), ("Day 7", "season recap"), ("Day 30", "траектория")]
        x0, y = 2.0 * cm, height / 2 - 12
        span = 13.0 * cm
        drawing.add(Line(x0, y, x0 + span, y, strokeColor=colors.HexColor("#2563eb"), strokeWidth=2))
        for idx, (day, label) in enumerate(items):
            x = x0 + idx * (span / (len(items) - 1))
            drawing.add(Circle(x, y, 16, fillColor=colors.HexColor("#eff6ff"), strokeColor=colors.HexColor("#2563eb"), strokeWidth=1.5))
            add_label(drawing, x, y + 26, day, size=9, bold=True)
            add_label(drawing, x, y - 30, label, size=7)

    elif name == "life_canvas_cause":
        title("Life Canvas: причина -> визуальный след", "Образ должен объяснять действие, а не заменять его")
        items = [("Action", "пользователь сделал шаг"), ("Evidence", "система сохранила факт"), ("Visual trait", "цвет / свет / предмет"), ("Life Canvas", "видимый след")]
        x0, y = 1.5 * cm, height / 2 - 16
        w, gap = 3.35 * cm, 0.55 * cm
        for idx, (label, sub) in enumerate(items):
            x = x0 + idx * (w + gap)
            box(drawing, x, y, w, 1.15 * cm, label, fill="#eef6ff", stroke="#93c5fd")
            add_label(drawing, x + w / 2, y - 13, sub, size=6.5, color="#475467")
            if idx < len(items) - 1:
                drawing.add(Line(x + w, y + 0.57 * cm, x + w + gap, y + 0.57 * cm, strokeColor=colors.HexColor("#2563eb")))
        add_label(drawing, width / 2, 34, "Если связь не читается, Life Canvas превращается в random image.", size=9, bold=True)

    elif name == "service_blueprint":
        title("Service blueprint первого loop", "Что видит человек и что делает система")
        cols = ["User", "Screen", "Backend", "AI/Image", "Analytics"]
        rows = ["Episode", "Action", "Canvas"]
        x0, y0 = 1.0 * cm, 1.6 * cm
        cell_w, cell_h = 3.1 * cm, 0.85 * cm
        for c, label in enumerate(cols):
            box(drawing, x0 + c * cell_w, y0 + len(rows) * cell_h, cell_w, cell_h, label, fill="#e7eef8", stroke="#cbd5e1")
        for r, row in enumerate(rows):
            y = y0 + (len(rows) - 1 - r) * cell_h
            for c in range(len(cols)):
                text = row if c == 0 else ["read", "save", "generate", "track"][min(c - 1, 3)]
                box(drawing, x0 + c * cell_w, y, cell_w, cell_h, text, fill="#ffffff", stroke="#e2e8f0")

    elif name == "data_flow":
        title("Поток данных", "Контекст становится эпизодом, действие становится визуальным следом")
        items = ["Profile", "Season", "Episode", "Action", "Reflection", "AvatarState", "Memory"]
        x0, y = 1.1 * cm, height / 2 - 18
        w, gap = 2.0 * cm, 0.28 * cm
        for idx, label in enumerate(items):
            x = x0 + idx * (w + gap)
            box(drawing, x, y, w, 1.0 * cm, label, fill="#f8fafc", stroke="#94a3b8")
            if idx < len(items) - 1:
                drawing.add(Line(x + w, y + 0.5 * cm, x + w + gap, y + 0.5 * cm, strokeColor=colors.HexColor("#64748b")))

    elif name == "cost_stack":
        title("Cost stack", "Что реально двигает себестоимость")
        items = [("AI text", 18, "#dbeafe"), ("Images", 45, "#93c5fd"), ("Infra", 22, "#bfdbfe"), ("Support", 10, "#e0f2fe"), ("Other", 5, "#f8fafc")]
        x, y = 3.0 * cm, height / 2 - 16
        total_w = 11.0 * cm
        current = x
        for label, pct, fill in items:
            w = total_w * pct / 100
            drawing.add(Rect(current, y, w, 1.2 * cm, fillColor=colors.HexColor(fill), strokeColor=colors.HexColor("#ffffff")))
            add_label(drawing, current + w / 2, y + 0.7 * cm, f"{pct}%", size=8, bold=True)
            add_label(drawing, current + w / 2, y - 12, label, size=6.5)
            current += w
        add_label(drawing, width / 2, 34, "Видео не входит в free loop, потому что ломает stack.", size=9, bold=True)

    elif name == "monetization_ladder":
        title("Лестница монетизации", "Платность появляется после первого value moment")
        items = [("Free", "первый loop"), ("Plus", "season + memory"), ("Premium", "styles + recaps"), ("Tokens", "video moments")]
        x0, y0 = 3.1 * cm, 1.6 * cm
        for idx, (label, sub) in enumerate(items):
            w = 3.0 * cm + idx * 0.6 * cm
            y = y0 + idx * 0.95 * cm
            drawing.add(Rect(x0, y, w, 0.75 * cm, rx=8, ry=8, fillColor=colors.HexColor(["#f8fafc", "#dbeafe", "#93c5fd", "#1d4ed8"][idx]), strokeColor=colors.HexColor("#94a3b8")))
            add_label(drawing, x0 + w / 2, y + 0.43 * cm, label, size=9, bold=True, color="#ffffff" if idx == 3 else "#111827")
            add_label(drawing, x0 + w + 1.8 * cm, y + 0.32 * cm, sub, size=8, anchor="start")

    elif name == "channel_map":
        title("Карта каналов запуска", "Каждый канал выполняет свою работу")
        channels = [("TikTok", "discovery"), ("Reels", "trust"), ("Shorts", "search"), ("Reddit", "critique"), ("Creators", "proof"), ("Referral", "share")]
        center_x, center_y = width / 2, height / 2 - 6
        drawing.add(Circle(center_x, center_y, 38, fillColor=colors.HexColor("#111827"), strokeColor=colors.HexColor("#111827")))
        add_label(drawing, center_x, center_y, "AURA", size=12, bold=True, color="#ffffff")
        positions = [(-150, 65), (0, 92), (150, 65), (-150, -70), (0, -98), (150, -70)]
        for (label, sub), (dx, dy) in zip(channels, positions):
            x, y = center_x + dx, center_y + dy
            box(drawing, x - 1.3 * cm, y - 0.35 * cm, 2.6 * cm, 0.7 * cm, label, fill="#eef6ff", stroke="#93c5fd")
            add_label(drawing, x, y - 26, sub, size=7, color="#475467")
            drawing.add(Line(center_x, center_y, x, y, strokeColor=colors.HexColor("#cbd5e1")))

    elif name == "content_wheel":
        title("Контент-пиллары", "AURA объясняется через несколько повторяемых углов")
        labels = ["Life series", "Future self", "Avatar causality", "Reset", "7-day season", "Build in public", "Objections"]
        center_x, center_y = width / 2, height / 2 - 4
        drawing.add(Circle(center_x, center_y, 34, fillColor=colors.HexColor("#111827"), strokeColor=colors.HexColor("#111827")))
        add_label(drawing, center_x, center_y, "AURA", size=11, bold=True, color="#ffffff")
        import math
        for idx, label in enumerate(labels):
            angle = 2 * math.pi * idx / len(labels)
            x = center_x + 145 * math.cos(angle)
            y = center_y + 90 * math.sin(angle)
            drawing.add(Circle(x, y, 28, fillColor=colors.HexColor("#f8fafc"), strokeColor=colors.HexColor("#94a3b8")))
            add_label(drawing, x, y, label, size=6.5, bold=True)

    elif name == "launch_timeline":
        title("30 дней проверки", "От прототипа к первым платным сигналам")
        weeks = [("Week 1", "interviews"), ("Week 2", "concierge"), ("Week 3", "content"), ("Week 4", "paid signal")]
        x0, y = 2.0 * cm, height / 2 - 12
        for idx, (week, sub) in enumerate(weeks):
            x = x0 + idx * 3.6 * cm
            box(drawing, x, y, 2.7 * cm, 1.1 * cm, week, fill="#dbeafe", stroke="#93c5fd")
            add_label(drawing, x + 1.35 * cm, y - 13, sub, size=7, color="#475467")
            if idx < len(weeks) - 1:
                drawing.add(Line(x + 2.7 * cm, y + 0.55 * cm, x + 3.6 * cm, y + 0.55 * cm, strokeColor=colors.HexColor("#2563eb")))

    elif name == "experiment_board":
        title("Доска экспериментов", "Каждый запуск должен отвечать на конкретную гипотезу")
        cols = ["Гипотеза", "Тест", "Метрика"]
        rows = ["Positioning", "Causality", "Paywall", "Sharing"]
        x0, y0 = 1.5 * cm, 1.6 * cm
        cell_w, cell_h = 4.6 * cm, 0.72 * cm
        for c, label in enumerate(cols):
            box(drawing, x0 + c * cell_w, y0 + len(rows) * cell_h, cell_w, cell_h, label, fill="#e7eef8")
        for r, row in enumerate(rows):
            y = y0 + (len(rows) - 1 - r) * cell_h
            for c in range(len(cols)):
                text = row if c == 0 else ("prototype" if c == 1 else "decision")
                box(drawing, x0 + c * cell_w, y, cell_w, cell_h, text, fill="#ffffff", stroke="#e2e8f0")

    elif name == "dependency_map":
        title("Критический путь разработки", "Что блокирует следующий шаг")
        items = [("Wireframes", "Sprint 1"), ("Prompt", "Episode"), ("Image provider", "Canvas"), ("RevenueCat", "Paywall"), ("Analytics", "Go/No-Go")]
        x0, y = 1.4 * cm, height / 2 - 18
        w, gap = 2.6 * cm, 0.45 * cm
        for idx, (label, sub) in enumerate(items):
            x = x0 + idx * (w + gap)
            box(drawing, x, y, w, 1.05 * cm, label, fill="#fef3c7", stroke="#f59e0b")
            add_label(drawing, x + w / 2, y - 12, sub, size=7)
            if idx < len(items) - 1:
                drawing.add(Line(x + w, y + 0.52 * cm, x + w + gap, y + 0.52 * cm, strokeColor=colors.HexColor("#92400e")))

    elif name == "budget_chart":
        title("Бюджет по спринтам", "Затраты должны следовать доказательству петли")
        vals = [180, 220, 240, 230, 260]
        labels = ["S1", "S2", "S3", "S4", "S5"]
        x0, y0 = 3.0 * cm, 1.7 * cm
        max_v = max(vals)
        for idx, val in enumerate(vals):
            x = x0 + idx * 2.2 * cm
            h = 4.4 * cm * val / max_v
            drawing.add(Rect(x, y0, 1.2 * cm, h, fillColor=colors.HexColor("#bfdbfe"), strokeColor=colors.HexColor("#2563eb")))
            add_label(drawing, x + 0.6 * cm, y0 + h + 12, str(val), size=8, bold=True)
            add_label(drawing, x + 0.6 * cm, y0 - 14, labels[idx], size=8)

    elif name == "go_no_go":
        title("Go / No-Go dashboard", "Решение принимает не вкус, а метрики")
        metrics = [("Activation", "45%+"), ("Loop", "25-35%"), ("Causality", "70%+"), ("D1", "20-30%"), ("Paid", "5-10%")]
        x0, y = 1.3 * cm, height / 2 - 18
        for idx, (label, target) in enumerate(metrics):
            x = x0 + idx * 3.0 * cm
            drawing.add(Circle(x + 1.2 * cm, y + 0.85 * cm, 25, fillColor=colors.HexColor("#dcfce7"), strokeColor=colors.HexColor("#16a34a")))
            add_label(drawing, x + 1.2 * cm, y + 0.85 * cm - 4, target, size=8, bold=True)
            add_label(drawing, x + 1.2 * cm, y - 8, label, size=8, bold=True)

    elif name == "decision_tree":
        title("Дерево решения", "Что делать после первых пользователей")
        box(drawing, 6.2 * cm, 6.2 * cm, 4.6 * cm, 0.9 * cm, "Петля понята?", fill="#dbeafe", stroke="#2563eb")
        box(drawing, 1.6 * cm, 3.6 * cm, 4.2 * cm, 0.9 * cm, "Нет: менять flow", fill="#fee2e2", stroke="#ef4444")
        box(drawing, 6.5 * cm, 3.6 * cm, 4.2 * cm, 0.9 * cm, "Да: смотреть D1", fill="#dcfce7", stroke="#16a34a")
        box(drawing, 11.4 * cm, 3.6 * cm, 4.2 * cm, 0.9 * cm, "Да + paid: строить", fill="#dbeafe", stroke="#2563eb")
        drawing.add(Line(8.5 * cm, 6.2 * cm, 3.7 * cm, 4.5 * cm, strokeColor=colors.HexColor("#64748b")))
        drawing.add(Line(8.5 * cm, 6.2 * cm, 8.6 * cm, 4.5 * cm, strokeColor=colors.HexColor("#64748b")))
        drawing.add(Line(8.6 * cm, 4.5 * cm, 13.5 * cm, 4.5 * cm, strokeColor=colors.HexColor("#64748b")))

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
