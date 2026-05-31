import fs from 'fs';

const OUT = 'data_processed/russian_source_provenance_index.csv';
const DOC = 'docs/decision/russian-source-provenance-index-v1.md';

for (const dir of ['data_processed', 'docs/decision']) fs.mkdirSync(dir, { recursive: true });

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
  const header = rows.shift();
  if (!header) return [];
  return rows
    .filter(r => r.some(Boolean))
    .map(r => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

function csv(file) {
  return fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : [];
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

function mdTable(rows, columns, limit = rows.length) {
  const limited = rows.slice(0, limit);
  const header = `| ${columns.map(c => c.label).join(' | ')} |`;
  const sep = `| ${columns.map(c => c.align === 'right' ? '---:' : '---').join(' | ')} |`;
  const body = limited.map(row => `| ${columns.map(c => clean(row[c.key]).replace(/\|/g, '/')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

function sum(rows, key) {
  return rows.reduce((acc, row) => acc + Number(row[key] || 0), 0);
}

function countBy(rows, key) {
  const out = {};
  for (const row of rows) out[row[key] || 'unknown'] = (out[row[key] || 'unknown'] || 0) + 1;
  return out;
}

const manifest = csv('data_processed/evidence_artifact_manifest.csv');
const marketSources = csv('data_processed/market_source_registry.csv');
const sourceDiscovery = csv('data_raw/research_source_discovery.csv');
const sourceConfidence = csv('data_processed/market_source_confidence_review.csv');

const manifestExisting = manifest.filter(row => row.exists === 'yes');
const sourceRefArtifacts = manifestExisting.filter(row => Number(row.source_ref_rows || 0) > 0);
const rawSourceRefs = manifestExisting.filter(row => row.artifact_type === 'raw_data');
const processedSourceRefs = manifestExisting.filter(row => row.artifact_type === 'processed_data');
const marketById = new Map(marketSources.map(row => [row.source_id, row]));

const rows = [];

rows.push({
  provenance_id: 'PROV_001',
  layer: 'artifact_manifest',
  source_family_ru: 'Локальный манифест артефактов',
  row_count: manifestExisting.length,
  source_ref_rows: sum(manifestExisting, 'source_ref_rows'),
  evidence_scope_ru: 'Показывает, какие raw/processed/docs/report/PDF/script файлы существуют локально, сколько в них строк, сколько source refs, и какой короткий hash у файла.',
  strongest_use_ru: 'Защищает воспроизводимость пакета и помогает быстро увидеть, что после генерации нет missing artifacts.',
  boundary_ru: 'Manifest доказывает наличие и форму файлов, но не доказывает, что рынок купит продукт или что гипотеза валидирована.',
  main_files: 'data_processed/evidence_artifact_manifest.csv;docs/decision/evidence-package-manifest-v1.md',
  next_action_ru: 'Перегенерировать после каждого нового слоя или ручной validation tranche.'
});

rows.push({
  provenance_id: 'PROV_002',
  layer: 'raw_and_processed_source_refs',
  source_family_ru: 'Raw/processed source-reference слой',
  row_count: sourceRefArtifacts.length,
  source_ref_rows: sum(sourceRefArtifacts, 'source_ref_rows'),
  evidence_scope_ru: `${rawSourceRefs.length} raw artifacts and ${processedSourceRefs.length} processed artifacts carry non-empty source-like references.`,
  strongest_use_ru: 'Позволяет проследить competitor universe, reviews, forums, paywall evidence, market claims и audience rows обратно к source_url/app ids/source files.',
  boundary_ru: 'Source refs показывают provenance, но не заменяют ручную проверку качества страницы, скриншота, onboarding flow или participant quote.',
  main_files: sourceRefArtifacts.slice(0, 12).map(row => row.file_path).join(';'),
  next_action_ru: 'Использовать source_ref_columns при ручном audit каждого сильного claim.'
});

rows.push({
  provenance_id: 'PROV_003',
  layer: 'market_source_registry',
  source_family_ru: 'Market source registry для TAM/SAM/SOM',
  row_count: marketSources.length,
  source_ref_rows: marketSources.filter(row => row.source_url).length,
  evidence_scope_ru: 'Содержит market source id, publisher, URL, source type, claim summary, confidence и notes для рыночных оценок.',
  strongest_use_ru: 'Поддерживает TAM/SAM/SOM как range-based модель с явным confidence, а не как одну твердую цифру.',
  boundary_ru: 'Часть market report pages paywalled или broad-category; использовать как диапазоны и proxy, не как прогноз выручки Alina.',
  main_files: 'data_processed/market_source_registry.csv;data_processed/market_source_confidence_review.csv;docs/market/market-source-confidence-review-v1.md',
  next_action_ru: 'Расширять только source-native/targeted sources и confidence-tag каждый новый claim.'
});

rows.push({
  provenance_id: 'PROV_004',
  layer: 'source_discovery',
  source_family_ru: 'Research source discovery',
  row_count: sourceDiscovery.length,
  source_ref_rows: sourceDiscovery.filter(row => row.source_url).length,
  evidence_scope_ru: 'Сохраняет seed/source discovery candidates, queries, snippets, URL и extraction status.',
  strongest_use_ru: 'Показывает, откуда начинались market report и source expansion candidates.',
  boundary_ru: 'Discovery row не равен подтвержденному источнику; claim можно усиливать только после extraction/confidence review.',
  main_files: 'data_raw/research_source_discovery.csv;data_processed/source_expansion_backlog.csv;docs/competitive/source-expansion-backlog-v1.md',
  next_action_ru: 'Не цитировать discovery snippet как финальный источник без отдельного registry/confidence review.'
});

for (const src of marketSources) {
  const confidence = sourceConfidence.find(row => row.source_id === src.source_id) || {};
  rows.push({
    provenance_id: `SRC_${src.source_id}`,
    layer: 'market_source',
    source_family_ru: `${src.niche} / ${src.source_type}`,
    row_count: 1,
    source_ref_rows: src.source_url ? 1 : 0,
    evidence_scope_ru: clean(src.claim_summary),
    strongest_use_ru: clean(confidence.recommended_model_action || src.notes),
    boundary_ru: clean(src.notes || 'Use with confidence tag; do not overclaim.'),
    main_files: src.source_url,
    next_action_ru: clean(confidence.recommended_model_action || 'Keep as source-tagged market evidence.')
  });
}

const headers = [
  'provenance_id', 'layer', 'source_family_ru', 'row_count', 'source_ref_rows',
  'evidence_scope_ru', 'strongest_use_ru', 'boundary_ru', 'main_files', 'next_action_ru'
];
writeCsv(OUT, rows, headers);

const artifactTypeSummary = Object.entries(countBy(manifestExisting, 'artifact_type'))
  .map(([artifact_type, count]) => ({ artifact_type, count }));
const evidenceRoleSummary = Object.entries(countBy(manifestExisting, 'evidence_role'))
  .map(([evidence_role, count]) => ({ evidence_role, count }));

const lines = [];
lines.push('# Русский provenance index источников V1');
lines.push('');
lines.push(`Собрано: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Зачем нужен этот файл');
lines.push('');
lines.push('Этот слой объясняет, откуда берется evidence в большом пакете Alina Research. Он соединяет manifest, source refs, market source registry и discovery/backlog, чтобы в русском PDF было ясно: какие источники являются raw data, какие - обработанными матрицами, какие - рыночными report anchors, и какие claims нельзя усиливать без ручной проверки.');
lines.push('');
lines.push('## Сводка provenance');
lines.push('');
lines.push(`- Manifest artifacts: ${manifestExisting.length}`);
lines.push(`- Artifacts with source refs: ${sourceRefArtifacts.length}`);
lines.push(`- Source-reference rows across manifest: ${sum(manifestExisting, 'source_ref_rows')}`);
lines.push(`- Market source registry rows: ${marketSources.length}`);
lines.push(`- Source discovery rows: ${sourceDiscovery.length}`);
lines.push('');
lines.push('## Artifact Type Summary');
lines.push('');
lines.push(mdTable(artifactTypeSummary, [
  { key: 'artifact_type', label: 'Artifact type' },
  { key: 'count', label: 'Count', align: 'right' }
]));
lines.push('');
lines.push('## Evidence Role Summary');
lines.push('');
lines.push(mdTable(evidenceRoleSummary, [
  { key: 'evidence_role', label: 'Evidence role' },
  { key: 'count', label: 'Count', align: 'right' }
]));
lines.push('');
lines.push('## Provenance Rows');
lines.push('');
lines.push(mdTable(rows, [
  { key: 'provenance_id', label: 'ID' },
  { key: 'source_family_ru', label: 'Слой / источник' },
  { key: 'row_count', label: 'Rows', align: 'right' },
  { key: 'source_ref_rows', label: 'Source refs', align: 'right' },
  { key: 'boundary_ru', label: 'Граница' }
], 20));
lines.push('');
lines.push('## Файлы');
lines.push('');
lines.push(`- \`${OUT}\``);
lines.push(`- \`${DOC}\``);
lines.push('- `data_processed/evidence_artifact_manifest.csv`');
lines.push('- `data_processed/market_source_registry.csv`');
lines.push('- `data_raw/research_source_discovery.csv`');

fs.writeFileSync(DOC, `${lines.join('\n')}\n`);

console.log(`russian_source_provenance_rows=${rows.length}`);
console.log(`doc=${DOC}`);
