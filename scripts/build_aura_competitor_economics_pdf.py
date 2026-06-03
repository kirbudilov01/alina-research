#!/usr/bin/env python3
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from statistics import mean
from typing import Iterable

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Flowable,
    Frame,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUT_PDF = ROOT / "output" / "pdf" / "AURA_COMPETITOR_ECONOMICS_REPORT.pdf"
OUT_MD = ROOT / "reports" / "aura-competitor-economics-report.md"
PAGE_SIZE = landscape(A4)
PAGE_W, PAGE_H = PAGE_SIZE
CONTENT_W_MM = 260

PURPLE = colors.HexColor("#9B85E4")
DEEP = colors.HexColor("#241B3A")
INK = colors.HexColor("#222222")
MUTED = colors.HexColor("#6C6578")
LIGHT = colors.HexColor("#F4F1FF")
GRID = colors.HexColor("#DED8F3")
GREEN = colors.HexColor("#E8F7EF")
YELLOW = colors.HexColor("#FFF7D9")
RED = colors.HexColor("#FFF0F0")


def register_fonts() -> tuple[str, str, str]:
    font_dir = Path("/System/Library/Fonts/Supplemental")
    regular = font_dir / "Arial.ttf"
    bold = font_dir / "Arial Bold.ttf"
    italic = font_dir / "Arial Italic.ttf"
    pdfmetrics.registerFont(TTFont("AURA-Regular", str(regular)))
    pdfmetrics.registerFont(TTFont("AURA-Bold", str(bold)))
    pdfmetrics.registerFont(TTFont("AURA-Italic", str(italic)))
    return "AURA-Regular", "AURA-Bold", "AURA-Italic"


FONT, FONT_BOLD, FONT_ITALIC = register_fonts()


def p(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(text.replace("\n", "<br/>"), style)


styles = getSampleStyleSheet()
S = {
    "title": ParagraphStyle(
        "title",
        fontName=FONT_BOLD,
        fontSize=28,
        leading=31,
        textColor=DEEP,
        spaceAfter=10,
    ),
    "subtitle": ParagraphStyle(
        "subtitle",
        fontName=FONT,
        fontSize=11,
        leading=16,
        textColor=MUTED,
        spaceAfter=12,
    ),
    "h1": ParagraphStyle(
        "h1",
        fontName=FONT_BOLD,
        fontSize=20,
        leading=25,
        textColor=DEEP,
        spaceBefore=8,
        spaceAfter=12,
    ),
    "h2": ParagraphStyle(
        "h2",
        fontName=FONT_BOLD,
        fontSize=13,
        leading=17,
        textColor=DEEP,
        spaceBefore=9,
        spaceAfter=6,
    ),
    "body": ParagraphStyle(
        "body",
        fontName=FONT,
        fontSize=8.8,
        leading=12.2,
        textColor=INK,
        spaceAfter=6,
    ),
    "small": ParagraphStyle(
        "small",
        fontName=FONT,
        fontSize=7.4,
        leading=9.2,
        textColor=INK,
    ),
    "small_muted": ParagraphStyle(
        "small_muted",
        fontName=FONT,
        fontSize=7.2,
        leading=9,
        textColor=MUTED,
    ),
    "callout_title": ParagraphStyle(
        "callout_title",
        fontName=FONT_BOLD,
        fontSize=9.2,
        leading=11.5,
        textColor=DEEP,
        spaceAfter=3,
    ),
    "callout": ParagraphStyle(
        "callout",
        fontName=FONT,
        fontSize=8.5,
        leading=11.4,
        textColor=INK,
    ),
    "kpi": ParagraphStyle(
        "kpi",
        fontName=FONT_BOLD,
        fontSize=17,
        leading=19,
        textColor=PURPLE,
        alignment=TA_CENTER,
    ),
    "kpi_label": ParagraphStyle(
        "kpi_label",
        fontName=FONT,
        fontSize=7.6,
        leading=9,
        textColor=MUTED,
        alignment=TA_CENTER,
    ),
    "toc": ParagraphStyle(
        "toc",
        fontName=FONT,
        fontSize=9.5,
        leading=13,
        textColor=INK,
        leftIndent=8,
    ),
}


class SectionDivider(Flowable):
    def __init__(self, number: str, title: str, subtitle: str):
        super().__init__()
        self.number = number
        self.title = title
        self.subtitle = subtitle
        self.width = CONTENT_W_MM * mm
        self.height = 150 * mm

    def draw(self):
        c = self.canv
        c.saveState()
        c.setFillColor(LIGHT)
        c.roundRect(0, 28 * mm, self.width, 78 * mm, 6 * mm, stroke=0, fill=1)
        c.setFillColor(PURPLE)
        c.rect(0, 28 * mm, 7 * mm, 78 * mm, stroke=0, fill=1)
        c.setFont(FONT_BOLD, 42)
        c.setFillColor(PURPLE)
        c.drawString(16 * mm, 81 * mm, self.number)
        c.setFont(FONT_BOLD, 24)
        c.setFillColor(DEEP)
        c.drawString(16 * mm, 64 * mm, self.title)
        text = c.beginText(16 * mm, 51 * mm)
        text.setFont(FONT, 11)
        text.setLeading(15)
        text.setFillColor(MUTED)
        for line in self.subtitle.split("\n"):
            text.textLine(line)
        c.drawText(text)
        c.restoreState()


class BarChart(Flowable):
    def __init__(self, rows: list[tuple[str, float, str]], title: str, max_value: float | None = None):
        super().__init__()
        self.rows = rows
        self.title = title
        self.max_value = max_value or max(v for _, v, _ in rows)
        self.width = CONTENT_W_MM * mm
        self.height = (18 + len(rows) * 9) * mm

    def draw(self):
        c = self.canv
        c.saveState()
        c.setFont(FONT_BOLD, 10)
        c.setFillColor(DEEP)
        c.drawString(0, self.height - 10, self.title)
        y = self.height - 23
        label_w = 65 * mm
        bar_w = 150 * mm
        for label, value, suffix in self.rows:
            c.setFont(FONT, 7.4)
            c.setFillColor(INK)
            c.drawString(0, y, label[:38])
            c.setFillColor(LIGHT)
            c.roundRect(label_w, y - 2, bar_w, 4.7 * mm, 1.5 * mm, stroke=0, fill=1)
            c.setFillColor(PURPLE)
            c.roundRect(label_w, y - 2, max(1, bar_w * value / self.max_value), 4.7 * mm, 1.5 * mm, stroke=0, fill=1)
            c.setFont(FONT_BOLD, 7.2)
            c.setFillColor(DEEP)
            c.drawRightString(label_w + bar_w + 18 * mm, y, suffix)
            y -= 9 * mm
        c.restoreState()


class FlowDiagram(Flowable):
    def __init__(self, labels: list[str], title: str):
        super().__init__()
        self.labels = labels
        self.title = title
        self.width = CONTENT_W_MM * mm
        self.height = 42 * mm

    def draw(self):
        c = self.canv
        c.saveState()
        c.setFont(FONT_BOLD, 10)
        c.setFillColor(DEEP)
        c.drawString(0, self.height - 9, self.title)
        x = 0
        y = 11 * mm
        box_w = self.width / len(self.labels) - 4 * mm
        for i, label in enumerate(self.labels):
            c.setFillColor(LIGHT if i % 2 == 0 else colors.white)
            c.setStrokeColor(PURPLE)
            c.roundRect(x, y, box_w, 15 * mm, 2.5 * mm, stroke=1, fill=1)
            c.setFillColor(DEEP)
            c.setFont(FONT_BOLD, 7.5)
            lines = label.split("\n")
            for j, line in enumerate(lines[:2]):
                c.drawCentredString(x + box_w / 2, y + 9 * mm - j * 4 * mm, line)
            if i < len(self.labels) - 1:
                c.setFillColor(PURPLE)
                c.setFont(FONT_BOLD, 12)
                c.drawString(x + box_w + 1.4 * mm, y + 6 * mm, "->")
            x += box_w + 4 * mm
        c.restoreState()


def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PURPLE)
    canvas.rect(0, 0, PAGE_W, 4 * mm, stroke=0, fill=1)
    canvas.setFont(FONT, 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 10 * mm, "AURA Competitor Economics Report")
    canvas.drawRightString(PAGE_W - 18 * mm, 10 * mm, str(doc.page))
    canvas.restoreState()


@dataclass
class Competitor:
    name: str
    segment: str
    revenue: str
    mau: str
    payers: str
    price: str
    arpmau: str
    conversion: str
    lesson: str
    source: str


ASTROLOGY = [
    Competitor("Co-Star iOS", "Western subscription astrology", "$797.5K/mo", "2.7M MAU", "64K", "$8.99/mo + IAP", "$0.30", "2.4%", "Social compatibility and identity language can create large iOS monetization without a heavy ad engine.", "Rev.now; Axios; TIME"),
    Competitor("Co-Star Android", "Western subscription astrology", "$95.3K/mo", "487K MAU", "n/a", "$8.62/mo", "$0.20", "n/a", "iOS/Android monetization split matters; AURA should model premium adoption separately by platform.", "Rev.now"),
    Competitor("Nebula iOS", "Astrology/web2app funnel", "$718K/mo", "2.2M MAU", "52K", "$9.99/mo + weekly IAP", "$0.33", "2.4%", "Paid growth can scale, but trust/refund risk rises when the funnel feels too aggressive.", "Rev.now; Web2App World"),
    Competitor("CHANI iOS", "Premium astrology/wellness voice", "$674.5K/mo", "n/a", "45K-65K implied", "~$13/mo", "n/a", "n/a", "Trusted voice and premium content can support higher price without looking like a generic horoscope app.", "Rev.now leaderboard"),
    Competitor("The Pattern iOS", "Relationships/self-insight", "$36.1K/mo", "160K MAU", "4K", "annual ~= $7/mo", "$0.23", "2.5%", "Relationship/self-understanding depth is monetizable, but scale depends on trust and product freshness.", "Rev.now; Adapty"),
    Competitor("The Pattern Android", "Relationships/self-insight", "$84.9K/mo", "227K MAU", "n/a", "$27.48/mo proxy", "$0.37", "n/a", "Some Android niches can still monetize when the use case is emotionally high intent.", "Rev.now"),
    Competitor("AstroSage Kundli Android", "Vedic utility/chart platform", "$547.8K/mo", "2.4M MAU", "34K", "$11.77/mo + IAP", "$0.23", "1.4%", "Birth-data utility can produce huge top-of-funnel; conversion is lower than premium iOS apps.", "Rev.now"),
    Competitor("Astrotalk iOS slice", "Consultation marketplace", "$613.5K/mo", "152K MAU", "n/a", "wallet/IAP", "$4.04", "n/a", "Urgent question + live guidance can produce much higher ARPMAU than subscription content.", "Rev.now; Moneycontrol"),
    Competitor("AstroTime Android", "Live astrologer/chat", "$440.8K/mo", "242K MAU", "11K", "~$30/mo", "$1.82", "4.5%", "Human guidance or urgent paid moments can lift conversion, but operations become heavier.", "Rev.now"),
    Competitor("Astrolink Android", "Birth chart + tarot utility", "$46.5K/mo", "215K MAU", "3K", "$10.92/mo + IAP", "$0.22", "1.4%", "Long-tail utility apps monetize, but the floor is closer to $0.20 ARPMAU than $1+.", "Rev.now"),
    Competitor("Cosmic Insights iOS", "Vedic/deep chart utility", "$13.8K/mo", "61K MAU", "~1K", "$6.99/mo", "$0.23", "1.6%", "Deep content depth alone does not guarantee high ARPMAU without stronger packaging.", "Rev.now"),
    Competitor("Astrotalk company", "Faith-tech marketplace", "Rs 1,214 crore FY25 total revenue", "n/a", "n/a", "consultations/store", "n/a", "n/a", "Astrology can become a massive service business, but this is not the same economics as a pure subscription app.", "Moneycontrol; Economic Times"),
    Competitor("Astroyogi company", "Faith-tech marketplace", "Rs 84-85 crore FY24", "3M users", "n/a", "consultations + AI + retail", "n/a", "n/a", "Mid-scale profitable astrology platform validates service demand beyond one app-store category.", "NextWhatBusiness; Entrackr"),
    Competitor("InstaAstro company", "Consultation marketplace", "Rs 25 crore FY24", "n/a", "n/a", "consultations", "n/a", "n/a", "Smaller players can still reach meaningful revenue when the use case is high intent.", "Financial Express; Entrackr"),
]

MINDFULNESS = [
    Competitor("Calm brand", "Sleep/meditation/wellness", "$300M/year proxy; historical >$500M COVID peak", "n/a", "4M+ subscribers", "$70/year; $14.99/mo", "n/a", "n/a", "Annual wellness subscription can be a very large business when trust, sleep and ritual are strong.", "Sacra"),
    Competitor("Calm Android", "Sleep/meditation/wellness", "$2.35M/mo", "3.6M MAU", "85K", "~$19.90/mo parsed", "$0.65", "2.4%", "Even at scale, visible paid conversion can look similar to astrology apps; ARPMAU is higher.", "Rev.now"),
    Competitor("Calm iOS", "Sleep/meditation/wellness", "$5M/mo estimate", "300K downloads/mo", "n/a", "$14.99/mo; $69.99/year", "n/a", "n/a", "Annual anchor is important for cashflow and retention pressure.", "Adapty"),
    Competitor("Headspace brand", "Meditation/mental health", "~$200M/year brand proxy", "n/a", "n/a", "$12.99/mo", "n/a", "n/a", "B2B/off-store revenue can matter; app-store estimates understate brand economics.", "Rev.now; Udonis"),
    Competitor("Headspace Android", "Meditation/mental health", "$1.23M/mo", "n/a", "n/a", "IAP $4.99-$119.99", "n/a", "n/a", "Large wellness brands monetize through multiple channels, not just app subscriptions.", "Rev.now"),
    Competitor("Waking Up", "Premium mindfulness/teacher", "$492.7K/mo iOS leaderboard", "n/a", "n/a", "$19.99/mo; $129.99/year", "n/a", "n/a", "Serious-seeker positioning can carry premium pricing if the teacher/voice is trusted.", "Official pricing; Rev.now"),
    Competitor("Insight Timer", "Free library + premium/live", "$345.5K/mo Android leaderboard", "32M members", "n/a", "~$19.95/mo", "n/a", "n/a", "A free content/library strategy can create huge reach but does not automatically create high ARPMAU.", "Rev.now; public stats"),
    Competitor("Balance Android", "Personalized meditation coach", "$180K/mo", "~317K MAU implied", "11K", "$11.99/mo", "$0.57", "3.5%", "Personalization can lift conversion above the 2-3% baseline.", "Rev.now"),
    Competitor("Meditopia iOS", "Meditation + AI therapy", "$118.4K/mo", "629K MAU", "n/a", "$5.83/mo", "$0.19", "n/a", "Large MAU plus lower price can still leave ARPMAU near astrology long-tail.", "Rev.now"),
]

AI_AVATAR = [
    Competitor("Character.AI", "AI companion/roleplay", "$30M-$32M ARR proxy", "20M MAU early 2024 proxy", "n/a", "c.ai+ $9.99/mo", "n/a", "n/a", "AI companionship proves engagement, but inference cost and safety are central risks.", "Sacra; Character.AI pricing"),
    Competitor("Replika Android", "AI companion/avatar", "$2.36M/mo", "n/a", "99K proxy", "~$17.23/mo proxy", "n/a", "n/a", "Users pay for memory, intimacy, voice/video/avatar affordances, not for raw chat alone.", "Rev.now; CompanionWise"),
    Competitor("Finch iOS", "Self-care pet/progression", "$1.5M-$2.0M/mo proxy", "n/a", "n/a", "$9.99/mo Plus", "n/a", "n/a", "Cute companion + daily care loop can monetize without claiming to be therapy or astrology.", "Rev.now; SensorTower snippets"),
]

GENERATION_COSTS = [
    ("GPT-4.1 mini", "LLM", "$0.40/1M input; $1.60/1M output", "Daily text loop is cheap if prompts are structured.", "OpenAI official pricing"),
    ("OpenAI Images", "Image", "~$0.01 low / $0.04 medium / $0.17 high", "Life Canvas can fit subscription if image count is capped.", "OpenAI official pricing"),
    ("Google Veo 2", "Cinematic video", "~$0.50/sec", "8 sec ~= $4 before retries; cannot be free daily content.", "Google Vertex AI pricing"),
    ("Runway API", "Video", "$0.01/credit; examples around $0.25 per 5 sec", "Good for tests and low-cost paid clips; still needs retry budget.", "Runway developer docs"),
    ("Replicate Wan 2.1", "Video", "$0.24/output sec", "8 sec ~= $1.92; needs token or premium bundle.", "Replicate model page"),
    ("HeyGen Avatar IV/V", "Talking avatar", "$0.05-$0.0667/sec", "30 sec ~= $1.50-$2.00; not a default daily loop.", "HeyGen developer docs"),
    ("D-ID Build", "Talking avatar", "$14.4/mo annual, 16 min offline video", "Can be economical under limits; verify watermark/credits before production.", "D-ID pricing"),
]

SOURCES = [
    ("Rev.now methodology and app estimates", "https://rev.now/"),
    ("Calm revenue, subscribers and business model", "https://sacra.com/c/calm/"),
    ("Astrotalk FY25 revenue and PBT", "https://www.moneycontrol.com/news/business/startup/astrotalk-revenue-rises-85-to-rs-1-214-crore-in-fy25-13795476.html/amp"),
    ("Co-Star funding/downloads/no-marketing signal", "https://www.axios.com/2021/04/14/astrology-app-co-star-raises-15-million-funding"),
    ("Co-Star Gen Z/no marketing signal", "https://time.com/6083293/astrology-apps-personalized/"),
    ("Nebula web2app funnel breakdown", "https://web2appworld.com/breakdowns/nebula/"),
    ("OpenAI API pricing", "https://openai.com/api/pricing/"),
    ("Google Vertex AI generative pricing", "https://cloud.google.com/vertex-ai/generative-ai/pricing"),
    ("Runway API pricing", "https://docs.dev.runwayml.com/guides/pricing"),
    ("HeyGen API pricing", "https://developers.heygen.com/docs/pricing"),
    ("D-ID API pricing", "https://www.d-id.com/pricing/api?from=studio_settings"),
    ("Character.AI pricing", "https://character.ai/subscribe"),
    ("Sacra Character.AI", "https://sacra.com/c/character-ai/"),
    ("Headspace statistics proxy", "https://www.blog.udonis.co/statistics/headspace"),
    ("The Pattern paywall reference", "https://adapty.io/paywall-library/the-pattern/"),
    ("Co-Star paywall reference", "https://adapty.io/paywall-library/co-star-personalized-astrology/"),
]


def table(data: list[list[str]], widths: list[float], header=True, font_size=7.0, leading=8.2) -> Table:
    converted = []
    for r, row in enumerate(data):
        converted.append([p(str(cell), ParagraphStyle(
            f"cell_{r}",
            fontName=FONT_BOLD if header and r == 0 else FONT,
            fontSize=font_size,
            leading=leading,
            textColor=colors.white if header and r == 0 else INK,
            alignment=TA_LEFT,
        )) for cell in row])
    t = Table(converted, colWidths=[w * mm for w in widths], repeatRows=1 if header else 0, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PURPLE if header else colors.white),
        ("GRID", (0, 0), (-1, -1), 0.35, GRID),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#FBFAFF")]),
    ]))
    return t


def callout(title: str, text: str, bg=LIGHT) -> Table:
    data = [[p(title, S["callout_title"])], [p(text, S["callout"])]]
    t = Table(data, colWidths=[CONTENT_W_MM * mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("BOX", (0, 0), (-1, -1), 0.4, PURPLE),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return t


def kpi_row(items: list[tuple[str, str]]) -> Table:
    cells = []
    width = (CONTENT_W_MM - 2) / len(items)
    for value, label in items:
        cells.append(Table([[p(value, S["kpi"])], [p(label, S["kpi_label"])]], colWidths=[width * mm]))
    t = Table([cells], colWidths=[width * mm] * len(items))
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BOX", (0, 0), (-1, -1), 0.3, GRID),
        ("INNERGRID", (0, 0), (-1, -1), 0.3, GRID),
        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    return t


def bullets(items: Iterable[str]) -> ListFlowable:
    return ListFlowable(
        [ListItem(p(item, S["body"]), bulletColor=PURPLE) for item in items],
        bulletType="bullet",
        leftIndent=12,
    )


def competitor_rows(rows: list[Competitor]) -> list[list[str]]:
    return [["Продукт", "Сегмент", "Revenue", "MAU/users", "Payers", "Цена", "ARPMAU", "Conv.", "Урок для AURA"]] + [
        [r.name, r.segment, r.revenue, r.mau, r.payers, r.price, r.arpmau, r.conversion, r.lesson] for r in rows
    ]


def section_meaning(story: list, learned: str, decision: str, impact: str):
    story.extend([
        Spacer(1, 3 * mm),
        callout("Что это значит для AURA", f"<b>Что узнали:</b> {learned}<br/><br/><b>Решение:</b> {decision}<br/><br/><b>Влияние на продукт:</b> {impact}", bg=colors.HexColor("#F8F5FF")),
        Spacer(1, 5 * mm),
    ])


def build_story() -> list:
    story = []
    story.extend([
        Spacer(1, 22 * mm),
        p("AURA", S["title"]),
        p("Competitor Economics Report", S["title"]),
        p("Суперподробный числовой справочник по конкурентам, подпискам, пользователям, конверсиям, ARPMAU, маркетингу и стоимости AI-генерации. Версия: 2026-06-03.", S["subtitle"]),
        Spacer(1, 8 * mm),
        callout("Главная мысль", "AURA нельзя считать только как astrology app, mindfulness app или avatar app. Правильная финансовая логика лежит на пересечении: astrology willingness to pay + mindfulness daily ritual + AI companion personalization + visual Life Canvas progression."),
        Spacer(1, 8 * mm),
        kpi_row([
            ("2-3%", "базовая платная конверсия для AURA"),
            ("$0.25-$0.50", "реалистичный ранний ARPMAU"),
            ("$9.99-$14.99", "основной диапазон подписки"),
            ("NO", "free daily video в MVP"),
        ]),
        PageBreak(),
        p("Оглавление", S["h1"]),
        p("1. Методология и качество данных", S["toc"]),
        p("2. Карта конкурентных рынков", S["toc"]),
        p("3. Astrology competitors: экономика и выводы", S["toc"]),
        p("4. Mindfulness competitors: экономика и выводы", S["toc"]),
        p("5. AI companion / avatar competitors", S["toc"]),
        p("6. Бенчмарки: conversion, ARPMAU, pricing, CAC", S["toc"]),
        p("7. Стоимость генерации: text, image, video, avatar", S["toc"]),
        p("8. Финансовые сценарии AURA", S["toc"]),
        p("9. Маркетинг конкурентов и GTM-уроки", S["toc"]),
        p("10. Решения для AURA", S["toc"]),
        p("11. Appendix: источники", S["toc"]),
        PageBreak(),
    ])

    story.extend([SectionDivider("01", "Методология", "Сначала отделяем официальные цифры от публичных оценок.\nЭто нужно, чтобы не строить финансовую модель на красивых, но ложных данных."), PageBreak()])
    story.extend([
        p("1. Методология и качество данных", S["h1"]),
        p("В открытом доступе почти нет настоящих внутренних P&L по частным astrology, mindfulness и AI companion приложениям. Поэтому этот справочник использует три слоя данных: официальные цены, публичные app-intelligence estimates и расчетные метрики AURA.", S["body"]),
        table([
            ["Слой данных", "Примеры", "Как использовать", "Уровень доверия"],
            ["Official pricing", "OpenAI, Google Vertex AI, Runway, HeyGen, Character.AI, публичные subscription pages", "Можно использовать как основу COGS и pricing bands", "High"],
            ["Public estimates", "Rev.now, Sacra, Adapty, Udonis, press/articles", "Можно использовать как directional benchmark", "Medium"],
            ["Derived economics", "ARPMAU, conversion, net revenue, scenario CAC", "Использовать как гипотезы для модели и MVP-проверки", "Medium/Low"],
        ], [36, 52, 58, 24], font_size=7.5),
        Spacer(1, 4 * mm),
        callout("Важно", "Все revenue/MAU/paying users из app-intelligence являются оценками, а не официальной отчетностью компаний. В финансовой модели AURA эти цифры нужно считать не как факт, а как диапазон, который помогает выбрать реалистичные assumptions."),
        Spacer(1, 5 * mm),
        FlowDiagram(["Market\nsignals", "Competitor\nunit economics", "AI cost\nbenchmarks", "AURA\nscenario model", "MVP\nvalidation"], "Логика чтения справочника"),
    ])
    section_meaning(story, "Публичные цифры дают достаточно точную рамку, но не заменяют собственную юнит-экономику.", "Использовать диапазоны: conservative / base / strong.", "AURA должна с первого дня логировать cost per episode, cost per image, cost per video, paywall conversion и refund/cancellation signals.")
    story.append(PageBreak())

    story.extend([SectionDivider("02", "Карта рынков", "AURA находится не в одной категории.\nДеньги и риски приходят из разных соседних рынков."), PageBreak()])
    story.extend([
        p("2. Карта конкурентных рынков", S["h1"]),
        p("Для AURA важны не только прямые astrology apps. Продукт объединяет личный прогноз, ежедневный ритуал, AI-помощника и визуальную историю жизни. Поэтому финансовая база должна включать четыре соседних класса.", S["body"]),
        table([
            ["Рынок", "Что доказывает", "Сильные примеры", "Главный риск", "Что брать AURA"],
            ["Astrology / spiritual guidance", "Пользователи платят за personal meaning, birth data, compatibility, weekly guidance", "Co-Star, Nebula, CHANI, The Pattern, AstroSage", "generic readings, aggressive paywalls, trust/refund", "willingness to pay за личный смысл"],
            ["Mindfulness / meditation / sleep", "Daily ritual и annual subscription могут быть большим бизнесом", "Calm, Headspace, Waking Up, Balance", "контентная библиотека без персональной причинности", "ритуал, annual plan, wellness trust"],
            ["AI companion", "Пользователи платят за memory, companion continuity, voice/avatar", "Replika, Character.AI", "inference cost, safety, intimacy risk", "assistant memory без зависимости от бесконечного чата"],
            ["Avatar / visual AI", "Визуальный output может быть premium moment", "HeyGen, Runway, Veo ecosystem", "video COGS уничтожает подписку", "Life Canvas image-first + paid video tokens"],
        ], [32, 46, 35, 41, 42], font_size=7.1),
        Spacer(1, 5 * mm),
        FlowDiagram(["Birth data /\npersonal context", "Weekly\nmeaning", "Daily\naction", "AI assistant\nmemory", "Life Canvas\nchange"], "AURA как пересечение рынков"),
    ])
    section_meaning(story, "Самая сильная финансовая логика AURA не в копировании одного рынка, а в сборке четырех доказанных механизмов.", "Позиционировать продукт как weekly life-series / visual self-guidance, а не как очередной horoscope feed.", "Подписка должна продавать season, memory и causal Life Canvas; видео и специальные визуальные моменты - отдельно.")
    story.append(PageBreak())

    story.extend([SectionDivider("03", "Astrology competitors", "Здесь проверяем, сколько зарабатывают приложения,\nгде пользователь платит за личный смысл и прогноз."), PageBreak()])
    story.extend([
        p("3. Astrology competitors: экономика и выводы", S["h1"]),
        p("Astrology apps важны для AURA, потому что они ближе всего к исходному пользовательскому запросу: человек вводит дату рождения, получает персональный смысл, прогноз, объяснение текущего периода и иногда платит за углубление.", S["body"]),
        kpi_row([
            ("$0.19-$0.37", "типичный ARPMAU subscription astrology"),
            ("1.4-2.5%", "видимая paid conversion у многих apps"),
            ("$1.82-$4.04", "ARPMAU у consultation-like моделей"),
            ("$9.99-$14.99", "рабочий диапазон подписки"),
        ]),
        Spacer(1, 5 * mm),
        table(competitor_rows(ASTROLOGY[:7]), [29, 34, 23, 24, 17, 25, 17, 15, 69], font_size=6.7, leading=8.3),
        PageBreak(),
        p("3.1 Astrology competitors: consultation and long-tail layer", S["h2"]),
        table(competitor_rows(ASTROLOGY[7:]), [29, 34, 32, 23, 17, 27, 17, 15, 59], font_size=6.7, leading=8.3),
        Spacer(1, 5 * mm),
        BarChart([
            ("Astrotalk iOS slice", 4.04, "$4.04"),
            ("AstroTime Android", 1.82, "$1.82"),
            ("The Pattern Android", 0.37, "$0.37"),
            ("Nebula iOS", 0.33, "$0.33"),
            ("Co-Star iOS", 0.30, "$0.30"),
            ("AstroSage Android", 0.23, "$0.23"),
            ("Astrolink Android", 0.22, "$0.22"),
        ], "ARPMAU: subscription apps vs consultation-like apps", max_value=4.04),
    ])
    section_meaning(story, "Subscription astrology часто дает $0.20-$0.37 ARPMAU, а консультационные модели могут быть в 5-15 раз выше.", "Для MVP не копировать консультационный marketplace, но оставить paid urgent moments как будущую ветку.", "AURA должна считать базовую модель как subscription/self-discovery, а upside - через tokenized premium moments.")
    story.append(PageBreak())

    story.extend([
        p("3.2 Что именно монетизируется в astrology apps", S["h1"]),
        table([
            ["Paid object", "Примеры", "Почему платят", "AURA-эквивалент"],
            ["Monthly subscription", "Co-Star Plus, Nebula, CHANI, The Pattern", "Хочется регулярного личного смысла и deeper reading", "AURA Plus: weekly season + memory + Life Canvas"],
            ["Compatibility / relationships", "Co-Star Eros, The Pattern relationships, Nebula compatibility", "Высокая эмоциональная ставка", "Relationship episode / future-self branch"],
            ["Birth chart / deep report", "CHANI, Cosmic Insights, AstroSage", "Тangible artifact из даты рождения", "Life profile / personal context / season setup"],
            ["Live guidance", "Astrotalk, AstroTime, Astroyogi", "Нужно срочно получить ответ на личный вопрос", "AI assistant first; expert/creator later"],
            ["Wallet / top-up", "Astrotalk, AstroTime", "Пользователь платит за минуты/ответы", "Не MVP, но можно тестировать concierge"],
            ["Spiritual commerce", "Astrotalk Store, Astroyogi retail", "Доверие к guidance превращается в покупку", "Не MVP; future marketplace only"],
            ["Special visual asset", "Soulmate sketch, aura reading, premium reports", "Хочется увидеть себя/судьбу как объект", "Future-self image/video token"],
        ], [34, 43, 53, 48], font_size=7.1),
        Spacer(1, 5 * mm),
        callout("Продуктовый вывод", "AURA должна продавать не “гороскоп”. Деньги находятся в ощущении: “это про меня”, “это объясняет мою неделю”, “я могу что-то сделать”, “я вижу, как меняется моя картина жизни”."),
    ])
    story.append(PageBreak())

    story.extend([SectionDivider("04", "Mindfulness competitors", "Здесь проверяем, почему люди платят за daily ritual,\nsleep, stress relief, teacher voice и annual subscription."), PageBreak()])
    story.extend([
        p("4. Mindfulness competitors: экономика и выводы", S["h1"]),
        p("Mindfulness category доказывает не астрологию, а ежедневный ритуал. Calm, Headspace, Balance и Waking Up показывают, что пользователь готов платить за повторяемый self-care loop, если продукт помогает проживать день понятнее и спокойнее.", S["body"]),
        kpi_row([
            ("4M+", "paying subscribers у Calm"),
            ("$300M/yr", "Calm revenue proxy"),
            ("$0.57-$0.65", "видимый ARPMAU у Balance/Calm Android"),
            ("$69-$129/yr", "annual anchor wellness apps"),
        ]),
        Spacer(1, 5 * mm),
        table(competitor_rows(MINDFULNESS), [30, 34, 34, 25, 17, 30, 17, 15, 59], font_size=6.7, leading=8.3),
        Spacer(1, 5 * mm),
        BarChart([
            ("Calm Android", 0.65, "$0.65"),
            ("Balance Android", 0.57, "$0.57"),
            ("Co-Star iOS", 0.30, "$0.30"),
            ("Nebula iOS", 0.33, "$0.33"),
            ("Meditopia iOS", 0.19, "$0.19"),
        ], "ARPMAU: wellness/personalization vs astrology baselines", max_value=0.75),
    ])
    section_meaning(story, "Wellness apps могут быть крупнее astrology apps, но их экономика часто основана на фиксированном контенте, а не на дорогой AI-генерации.", "AURA должна брать daily ritual и annual plan, но не строить огромную библиотеку медитаций.", "Главная retention-петля: Episode -> Action -> Reset -> Reflection -> Life Canvas -> Tomorrow Hook.")
    story.append(PageBreak())

    story.extend([SectionDivider("05", "AI companion / avatar", "Здесь проверяем, за что люди платят в AI-компаньонах\nи почему визуальный слой нужно ограничивать экономически."), PageBreak()])
    story.extend([
        p("5. AI companion / avatar competitors", S["h1"]),
        p("AI companion и avatar-продукты важны для AURA не как прямые клоны, а как доказательство спроса на memory, avatar, emotional continuity и визуальную персонализацию. При этом именно здесь возникает главный cost risk: пользователь хочет много генерации, а продукт платит за каждую итерацию.", S["body"]),
        table(competitor_rows(AI_AVATAR), [34, 38, 35, 31, 23, 31, 20, 18, 55], font_size=7.1, leading=8.8),
        Spacer(1, 5 * mm),
        table([
            ["Механика", "Что доказывает", "Риск", "AURA-решение"],
            ["AI chat/memory", "Пользователь хочет continuity и персонального собеседника", "unbounded inference cost, safety, hallucinations", "ограниченный assistant внутри season, не бесконечный чат"],
            ["Avatar customization", "Визуальный помощник повышает attachment", "может стать косметикой без продуктового смысла", "avatar отражает role/season/future-self, а не просто скин"],
            ["Voice/video", "Повышает emotional presence", "дорого, тяжело масштабировать бесплатно", "premium token / milestone only"],
            ["Progression pet/companion", "Дневная забота удерживает", "может выглядеть детски", "Life Canvas как взрослая progression-система"],
        ], [35, 52, 45, 58], font_size=7.0),
    ])
    section_meaning(story, "AI companion-рынок подтверждает willingness to pay за память и эмоциональную связность.", "AURA не должна быть просто чатботом с аватаром; аватар должен объяснять изменение Life Canvas.", "Чат, картинка и видео должны быть подчинены loop, иначе экономика и продуктовый фокус развалятся.")
    story.append(PageBreak())

    story.extend([SectionDivider("06", "Бенчмарки", "Теперь переводим чужие цифры в рабочие assumptions\nдля AURA: conversion, ARPMAU, price, CAC."), PageBreak()])
    story.extend([
        p("6. Бенчмарки для финансовой модели AURA", S["h1"]),
        p("Ниже не “правильные ответы”, а рабочие диапазоны. Их задача - не доказать красивую модель, а не дать AURA случайно заложить нереалистичную конверсию, ARPMAU или CAC.", S["body"]),
        table([
            ["Сценарий", "Paid conversion", "ARPMAU", "Monthly price", "Token attach", "Когда возможно"],
            ["Conservative", "1.5%", "$0.20", "$7.99-$9.99", "3%", "AURA ощущается как еще одно self-discovery приложение"],
            ["Base", "2.5-3.0%", "$0.35-$0.50", "$9.99-$14.99", "8-12%", "пользователь понимает Life Canvas causality до paywall"],
            ["Strong", "4.0-5.0%", "$0.80-$1.50", "$14.99", "15-20%", "есть high-intent paid moments: relationship, future-self, premium visual"],
            ["Marketplace-like", "n/a", "$2.00+", "wallet/top-up", "n/a", "только если появится human/creator/expert layer"],
        ], [30, 28, 27, 30, 28, 67], font_size=7.2),
        Spacer(1, 5 * mm),
        BarChart([
            ("Conservative", 1.5, "1.5%"),
            ("Base low", 2.5, "2.5%"),
            ("Base high", 3.0, "3.0%"),
            ("Strong low", 4.0, "4.0%"),
            ("Strong high", 5.0, "5.0%"),
        ], "Paid conversion assumptions", max_value=5.0),
        Spacer(1, 5 * mm),
        table([
            ["CAC-сценарий", "CAC activated user", "CAC payer", "Marketing % revenue", "Комментарий"],
            ["Founder/creator validation", "$0-$5", "$20-$80", "0-20%", "первые 100-1,000 пользователей, интервью, теплые каналы"],
            ["Organic/social identity", "$2-$10", "$50-$150", "10-30%", "если Life Canvas/season recap реально шарится"],
            ["Paid web2app quiz", "$5-$25", "$150-$500+", "30-70%", "работает только с сильным LTV и большим количеством creatives"],
            ["Marketplace/expert", "$10-$50+", "$200-$800+", "25-60%", "не MVP, так как требует высокого ARPPU и операций"],
        ], [40, 31, 28, 32, 65], font_size=7.0),
    ])
    section_meaning(story, "Реалистичный base-case для AURA - не 10% paid conversion, а 2.5-3.0%.", "Считать MVP через жесткие gates: first loop completion, D1/D7 retention, paywall conversion, token attach.", "Если AURA не доказывает causality и retention, платная реклама быстро уничтожит модель.")
    story.append(PageBreak())

    story.extend([SectionDivider("07", "Стоимость генерации", "Самая опасная часть экономики AURA - видео.\nText и images могут жить в подписке, video должен быть ограничен."), PageBreak()])
    story.extend([
        p("7. Стоимость генерации: text, image, video, avatar", S["h1"]),
        table([["Provider/model", "Layer", "Public price signal", "AURA implication", "Source"]] + [list(r) for r in GENERATION_COSTS], [32, 24, 45, 72, 31], font_size=6.8),
        Spacer(1, 5 * mm),
        table([
            ["Сценарий", "100 users", "1,000 users", "10,000 users", "Решение"],
            ["1 free 8s Veo clip / month", "$400", "$4,000", "$40,000", "слишком дорого до доказанной paid conversion"],
            ["4 free 8s Veo clips / month", "$1,600", "$16,000", "$160,000", "убивает подписочную маржу"],
            ["1 paid 8s Runway clip", "$40 COGS", "$400 COGS", "$4,000 COGS", "может работать как low-price token"],
            ["1 paid 8s Replicate/Wan clip", "$192 COGS", "$1,920 COGS", "$19,200 COGS", "нужен token $4.99-$9.99"],
            ["1 paid 30s HeyGen avatar", "$150-$200", "$1,500-$2,000", "$15,000-$20,000", "premium forecast / assistant moment only"],
            ["Image-first Life Canvas", "$4-$17", "$40-$170", "$400-$1,700", "безопасный дефолт visual layer"],
        ], [48, 27, 30, 32, 59], font_size=7.0),
        Spacer(1, 5 * mm),
        callout("Жесткое правило экономики", "AURA может выглядеть визуально дорогой, но не должна раздавать бесплатное ежедневное AI-видео. Text + structured personalization + limited Life Canvas images помещаются в подписку. Expensive video/avatar - только paid token, milestone или premium season."),
    ])
    section_meaning(story, "Главный риск продукта - не LLM-текст, а видео/avatar COGS и retry budget.", "В MVP: image-first Life Canvas, no free daily video, strict generation caps.", "Каждый generated asset должен иметь cost logging и связь с user value, иначе модель нельзя масштабировать.")
    story.append(PageBreak())

    story.extend([SectionDivider("08", "Финансовые сценарии", "Переводим benchmarks в простую модель AURA:\n100, 1,000, 10,000, 100,000 MAU."), PageBreak()])
    scenarios = [
        ["MAU", "Payers @2.5%", "Gross subscription @ $11.99", "Net after 15% fee", "AI/image COGS", "Product margin before marketing"],
        ["100", "3", "$36/mo", "$31/mo", "$10-$25/mo", "$6-$21/mo"],
        ["1,000", "25", "$300/mo", "$255/mo", "$100-$250/mo", "$5-$155/mo"],
        ["10,000", "250", "$2,998/mo", "$2,548/mo", "$1,000-$2,500/mo", "$48-$1,548/mo"],
        ["100,000", "2,500", "$29,975/mo", "$25,479/mo", "$10,000-$25,000/mo", "$479-$15,479/mo"],
        ["1,000,000", "25,000", "$299,750/mo", "$254,788/mo", "$100,000-$250,000/mo", "$4,788-$154,788/mo"],
    ]
    story.extend([
        p("8. Финансовые сценарии AURA", S["h1"]),
        p("Ниже базовый subscription-only stress test без token revenue. Он специально консервативный: показывает, что AURA не должна тащить высокие COGS в бесплатный слой и не должна рассчитывать, что одна подписка покроет ежедневное видео.", S["body"]),
        table(scenarios, [24, 30, 42, 34, 34, 60], font_size=7.0),
        Spacer(1, 5 * mm),
        table([
            ["Revenue line", "Price", "COGS target", "Почему нужен"],
            ["Plus monthly", "$9.99-$14.99", "$0.80-$1.50/payer", "основной регулярный revenue"],
            ["Annual", "$69-$89/year", "same core COGS", "cashflow и снижение churn pressure"],
            ["Low video token", "$2.99-$4.99", "<$1", "доступный visual upsell"],
            ["Premium video token", "$6.99-$9.99", "$2-$4", "Veo/HeyGen/Replicate moments без разрушения маржи"],
            ["Creator/special season", "$14.99-$29.99", "content + capped AI", "монетизация доверия и тем, а не только compute"],
        ], [42, 36, 36, 82], font_size=7.2),
    ])
    section_meaning(story, "На малых объемах подписка без token revenue может быть тонкой, если free COGS не контролируются.", "Первый MVP должен доказывать retention дешево: text + image, без бесплатного видео.", "Token upsell и annual plan нужны не как жадность, а как защита экономики.")
    story.append(PageBreak())

    story.extend([SectionDivider("09", "Маркетинг", "Проверяем, как конкуренты привлекают пользователей\nи какие CAC-сценарии реалистичны для AURA."), PageBreak()])
    story.extend([
        p("9. Маркетинг конкурентов и GTM-уроки", S["h1"]),
        table([
            ["Продукт", "Маркетинговый сигнал", "Уверенность", "Что это значит для AURA"],
            ["Nebula", "$6.8M/mo YouTube ad spend, 620 creatives, 18.6M visits in Jan 2026; 600 Facebook ads; 50 landing pages; 30+ persona pages", "Medium/High third-party", "платный scale возможен, но требует web2app funnel, сотни creatives и высокого LTV"],
            ["Nebula", "Soulmate sketch 10% ad traffic; marriage compatibility 8.2%; aura reading 8%", "Directional", "visual/romantic/future-self curiosity hooks сильны для тестов AURA"],
            ["Co-Star", "20M+ downloads with no real marketing spend; 25% young US women 18-25 downloaded it", "High historical press", "социальный identity-hook может снижать CAC лучше платной рекламы"],
            ["Astrotalk", "FY25 expenses Rs 1,129 crore; marketing/tech/ops/talent growth cited", "High financial signal", "marketplace scale требует больших ops + marketing costs"],
            ["CHANI", "trusted founder/content-led premium positioning", "Qualitative", "голос/доверие могут заменить часть paid ads"],
            ["The Pattern / Co-Star", "relationship/self-insight and compatibility social hooks", "Qualitative", "shareable output должен быть связан с личным смыслом, а не просто картинкой"],
        ], [28, 78, 30, 58], font_size=6.7),
        Spacer(1, 5 * mm),
        FlowDiagram(["Warm cohort\n100 users", "Creator/social\n1,000 users", "Landing tests\n$500-$2K", "Measure\nD1/D7/paywall", "Scale only\nif payback works"], "AURA GTM sequence"),
        Spacer(1, 5 * mm),
        table([
            ["Hook", "Почему может работать", "Что измерить"],
            ["Your week as a visual life-series", "не гороскоп, а сериал о себе и своей неделе", "signup, first loop completion, share rate"],
            ["Future-self / Life Canvas from birth data", "visual curiosity + personal context", "landing conversion, token interest, trust concerns"],
            ["Not a horoscope: weekly reset with visual outcome", "снижает scam-risk и эзотерический пафос", "paid conversion after first loop"],
            ["Relationship / compatibility episode", "emotionally high-intent astrology monetization pattern", "waitlist, token attach, refund risk"],
        ], [48, 78, 70], font_size=7.1),
    ])
    section_meaning(story, "Первые пользователи AURA не должны покупаться большой рекламой; сначала нужно доказать loop.", "Запускать paid tests только после данных по first loop, D1/D7 и paywall.", "Лучшие creative hooks должны быть визуальными, но честными: Life Canvas, future-self, weekly reset, а не fake urgency.")
    story.append(PageBreak())

    story.extend([SectionDivider("10", "Решения для AURA", "Финальный перевод конкурентных данных\nв продуктовые и финансовые решения."), PageBreak()])
    story.extend([
        p("10. Итоговые решения для AURA", S["h1"]),
        table([
            ["Вопрос", "Решение", "Почему"],
            ["Как позиционировать?", "Не astrology app, не avatar app, не habit tracker. AURA = weekly visual self-guidance with Life Canvas causality.", "Так продукт берет willingness to pay из astrology, ritual из wellness и differentiation из visual AI."],
            ["Что продавать в подписке?", "Weekly season, daily episode, memory, reflections, limited Life Canvas images, Tomorrow Hook.", "Это удерживает без дорогого видео и не превращает продукт в generic horoscope feed."],
            ["Что продавать отдельно?", "Premium visual/video moments: future-self, cinematic Life Canvas, relationship episode, creator season.", "Эти механики повышают ARPMAU без разрушения подписочной маржи."],
            ["Какая базовая цена?", "$9.99-$14.99/mo; annual $69-$89.", "Это соответствует astrology/wellness price bands и дает место для AI/image COGS."],
            ["Какая conversion-модель?", "Conservative 1.5%, base 2.5-3%, strong 4-5%.", "Такие диапазоны ближе к видимым competitor proxies, чем фантазийные 8-10%."],
            ["Что нельзя делать?", "No free daily video, no unlimited AI, no aggressive weekly trap, no marketplace in MVP.", "Иначе продукт рискует стать дорогим, недоверительным и тяжелым операционно."],
            ["Главный MVP gate?", "Пользователь должен сказать: Life Canvas изменился, потому что я сделал действие.", "Если он говорит “ИИ просто нарисовал новую картинку”, продуктовая гипотеза проваливается."],
        ], [42, 72, 82], font_size=7.0),
        Spacer(1, 5 * mm),
        callout("Финальный вывод", "AURA финансово должна вести себя как wellness subscription, продуктово - как personal meaning system, технически - как cost-controlled AI product. Победная модель: дешёвая ежедневная петля + редкие дорогие premium moments."),
    ])
    story.append(PageBreak())

    story.extend([SectionDivider("A", "Appendix", "Источники и ссылки.\nЭтот слой нужен для проверки данных, а не для первого чтения."), PageBreak()])
    story.extend([
        p("Appendix: источники", S["h1"]),
        p("Список ниже фиксирует ключевые внешние ссылки, использованные для competitor/economics layer. В презентации их лучше выносить в sources appendix, а не перегружать основные слайды.", S["body"]),
        table([["Источник", "URL"]] + [[name, url] for name, url in SOURCES], [65, 130], font_size=6.6, leading=8.0),
        Spacer(1, 6 * mm),
        callout("Что еще желательно добрать позже", "1. Реальные D1/D7/D30 retention и subscriber churn по конкурентам.<br/>2. Refund/cancellation rates по astrology web2app funnels.<br/>3. Точные CAC by channel для Nebula/Astrotalk/Co-Star-like launches.<br/>4. Реальные cost logs AURA после concierge/prototype cohort."),
    ])
    return story


def build_pdf():
    OUT_PDF.parent.mkdir(parents=True, exist_ok=True)
    doc = BaseDocTemplate(
        str(OUT_PDF),
        pagesize=PAGE_SIZE,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=16 * mm,
        bottomMargin=18 * mm,
        title="AURA Competitor Economics Report",
        author="Codex",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin + 8 * mm, doc.width, doc.height - 8 * mm, id="normal")
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=on_page)])
    doc.build(build_story())


def markdown_table(headers: list[str], rows: list[list[str]]) -> str:
    out = ["| " + " | ".join(headers) + " |", "| " + " | ".join(["---"] * len(headers)) + " |"]
    for row in rows:
        out.append("| " + " | ".join(str(x).replace("\n", " ") for x in row) + " |")
    return "\n".join(out)


def build_markdown():
    OUT_MD.parent.mkdir(parents=True, exist_ok=True)
    md = []
    md.append("# AURA Competitor Economics Report\n")
    md.append("Дата обновления: 2026-06-03.\n")
    md.append("Цель: отдельный числовой справочник по конкурентам, подпискам, пользователям, конверсиям, ARPMAU, маркетингу и стоимости AI-генерации.\n")
    md.append("## Executive Summary\n")
    md.append("- AURA не должна считаться только как astrology app, mindfulness app или avatar app.\n")
    md.append("- Базовая платная конверсия: 2.5-3.0%; консервативно 1.5%; сильный сценарий 4-5%.\n")
    md.append("- Реалистичный ранний ARPMAU: $0.25-$0.50; upside через premium visual/video tokens.\n")
    md.append("- Text + limited images могут жить внутри подписки; бесплатное ежедневное AI-видео нельзя включать в MVP.\n")
    md.append("\n## Astrology Competitors\n")
    md.append(markdown_table(["Product", "Segment", "Revenue", "MAU/users", "Payers", "Price", "ARPMAU", "Conversion", "Lesson", "Source"], [[c.name, c.segment, c.revenue, c.mau, c.payers, c.price, c.arpmau, c.conversion, c.lesson, c.source] for c in ASTROLOGY]))
    md.append("\n## Mindfulness Competitors\n")
    md.append(markdown_table(["Product", "Segment", "Revenue", "MAU/users", "Payers", "Price", "ARPMAU", "Conversion", "Lesson", "Source"], [[c.name, c.segment, c.revenue, c.mau, c.payers, c.price, c.arpmau, c.conversion, c.lesson, c.source] for c in MINDFULNESS]))
    md.append("\n## AI Companion / Avatar Competitors\n")
    md.append(markdown_table(["Product", "Segment", "Revenue", "MAU/users", "Payers", "Price", "ARPMAU", "Conversion", "Lesson", "Source"], [[c.name, c.segment, c.revenue, c.mau, c.payers, c.price, c.arpmau, c.conversion, c.lesson, c.source] for c in AI_AVATAR]))
    md.append("\n## Generation Cost Benchmarks\n")
    md.append(markdown_table(["Provider/model", "Layer", "Public price signal", "AURA implication", "Source"], [list(r) for r in GENERATION_COSTS]))
    md.append("\n## AURA Decisions\n")
    md.append("- Pricing: Plus $9.99-$14.99/mo; annual $69-$89/year.\n")
    md.append("- Free: first forecast, Day 1 loop, one Life Canvas moment; COGS target below $0.20.\n")
    md.append("- Premium video: tokenized $2.99-$9.99 depending on provider and quality.\n")
    md.append("- Main validation gate: user understands that Life Canvas changed because they completed an action.\n")
    md.append("\n## Sources\n")
    for name, url in SOURCES:
        md.append(f"- {name}: {url}")
    OUT_MD.write_text("\n".join(md), encoding="utf-8")


if __name__ == "__main__":
    build_markdown()
    build_pdf()
    print(f"Wrote {OUT_MD}")
    print(f"Wrote {OUT_PDF}")
