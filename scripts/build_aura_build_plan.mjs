import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, 'reports', 'aura-master-book.md');
const OUT = path.join(ROOT, 'reports', 'aura-build-plan.md');
const source = fs.readFileSync(SOURCE, 'utf8');

function getSection(title) {
  const markers = title.startsWith('#') ? [title] : [`## ${title}`, `### ${title}`, `#### ${title}`];
  const matches = markers
    .map(marker => ({ marker, start: source.indexOf(marker) }))
    .filter(match => match.start !== -1)
    .sort((a, b) => a.start - b.start);
  if (!matches.length) throw new Error(`Missing section: ${title}`);
  const { marker, start } = matches[0];
  const nextH2 = source.indexOf('\n## ', start + marker.length);
  const nextH3 = source.indexOf('\n### ', start + marker.length);
  const nextChapter = source.indexOf('\n# ГЛАВА ', start + marker.length);
  const nextMajor = source.indexOf('\n# Appendix / Evidence Layer', start + marker.length);
  const candidates = [nextH2, nextH3, nextChapter, nextMajor].filter(i => i !== -1);
  const end = candidates.length ? Math.min(...candidates) : source.length;
  return source.slice(start, end).trim();
}

function h3From(sectionTitle, h3Title) {
  const section = getSection(sectionTitle);
  const marker = `### ${h3Title}`;
  const start = section.indexOf(marker);
  if (start === -1) throw new Error(`Missing H3 ${h3Title} in ${sectionTitle}`);
  const next = section.indexOf('\n### ', start + marker.length);
  const end = next === -1 ? section.length : next;
  return section.slice(start, end).trim();
}

function pageBreak() {
  return '<!-- PAGEBREAK -->';
}

const lines = [];
lines.push('# AURA Build Plan');
lines.push('');
lines.push('AURA Build Plan - это рабочий технический документ. Он отделен от AURA Product Master Plan, чтобы продуктовая книга не превращалась в Jira, но вся инженерная, финансовая и delivery-детализация сохранялась.');
lines.push('');
lines.push('## Как читать');
lines.push('');
lines.push('| Раздел | Для кого | Зачем |');
lines.push('| --- | --- | --- |');
lines.push('| Architecture | CTO / tech lead | Понять систему и границы реализации. |');
lines.push('| Stack / Providers | CTO / engineering | Выбрать сервисы и контролировать риски. |');
lines.push('| Unit Economics | Founder / finance / product | Проверить себестоимость и pricing. |');
lines.push('| API / Data / Events | Engineering / analytics | Собрать backend, аналитику и admin. |');
lines.push('| Sprint Plan / Backlog | PM / delivery | Планировать разработку, часы, бюджет и зависимости. |');

lines.push(pageBreak());
lines.push('# 1. Architecture');
lines.push(getSection('Архитектура как продуктовая система'));
lines.push(getSection('Поток данных'));
lines.push(getSection('1. Architecture Decision'));
lines.push(getSection('2. System Architecture'));
lines.push(getSection('4. Техническая архитектура: схема системы'));

lines.push(pageBreak());
lines.push('# 2. Stack And Providers');
lines.push(getSection('3. Recommended Stack For первый продукт'));
lines.push(getSection('4. Component Responsibilities'));
lines.push(getSection('7. Provider Comparison'));
lines.push(getSection('Что технически нужно подключать для avatar и Life Series'));
lines.push(getSection('3. Технологическое исследование: сравнение и выбор'));

lines.push(pageBreak());
lines.push('# 3. Data, API, Analytics');
lines.push(getSection('10. Data Model'));
lines.push(getSection('11. API и системные контракты'));
lines.push(getSection('5. Database Schema Draft'));
lines.push(getSection('6. API Groups'));
lines.push(getSection('14. Analytics Events'));
lines.push(getSection('18. Event Taxonomy'));
lines.push(getSection('15. Metrics Dashboard'));

lines.push(pageBreak());
lines.push('# 4. Unit Economics And Cost Control');
lines.push(getSection('Экономика петли'));
lines.push(getSection('Cost stack'));
lines.push(getSection('Модель себестоимости: сколько может стоить продукт на разных масштабах'));
lines.push(getSection('8. Unit Economics Assumptions'));
lines.push(getSection('9. Unit Economics By Scale'));
lines.push(getSection('10. Sensitivity Analysis'));
lines.push(getSection('11. Revenue And Margin Scenarios'));
lines.push(getSection('12. Cost Control Rules'));
lines.push(getSection('5. Юнит-экономика: рабочая модель расходов'));

lines.push(pageBreak());
lines.push('# 5. Monetization Implementation');
lines.push(getSection('Лестница монетизации'));
lines.push(getSection('Монетизация: что проверять у конкурентов'));
lines.push(getSection('Монетизационная матрица: что именно продавать'));
lines.push(getSection('Почему люди платят соседним продуктам и что забирает АУРА'));
lines.push(getSection('Аналитика, платный экран и финмодель: что нужно доказать до ТЗ'));
lines.push(getSection('6. Монетизация: конкуренты и итоговая модель АУРЫ'));

lines.push(pageBreak());
lines.push('# 6. Delivery Plan');
lines.push(getSection('Roadmap сборки'));
lines.push(getSection('Карта зависимостей'));
lines.push(getSection('Бюджет по спринтам'));
lines.push(getSection('1. Требования к первому продукту'));
lines.push(getSection('2. Sprint Plan'));
lines.push(getSection('3. Budget Summary'));
lines.push(getSection('4. Detailed Backlog'));
lines.push(getSection('5. Epic Requirements'));
lines.push(getSection('6. Dependencies And Critical Path'));
lines.push(getSection('7. Definition Of Done'));
lines.push(getSection('8. Open Questions Before Build'));
lines.push(getSection('9. Team Plan'));
lines.push(getSection('10. Итоговое решение по разработке'));

lines.push(pageBreak());
lines.push('# 7. QA, Risks, Release');
lines.push(getSection('13. Security And Privacy Requirements'));
lines.push(getSection('16. Technical Risk Register'));
lines.push(getSection('19. QA Checklist Before First Cohort'));
lines.push(getSection('16. Acceptance Criteria'));
lines.push(getSection('17. Edge Cases And Empty States'));
lines.push(getSection('20. API And Backend Work Packages'));
lines.push(getSection('21. Итоговое техническое решение'));
lines.push(getSection('20. Источники и допущения'));

fs.writeFileSync(OUT, `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd()}\n`);
console.log(`wrote ${OUT}`);
