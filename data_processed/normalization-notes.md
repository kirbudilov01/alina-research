# Normalization and Dedup Logic

## Process
1. **Concatenation**: All five raw CSV files from `data_raw/` were merged into a single file `top200_all_merged.csv`.
2. **Deduplication**: The merged data was deduplicated to create `top200_all_dedup.csv`.
   - **Key**: (app_name, platform).
   - **Strategy**: Keep the first occurrence.
   - **Normalization**: App names and platforms were case-stripped and lowercased for comparison.

## Statistics
- Total raw rows (excluding headers): 250
- Deduplicated rows: 216
- Rows removed: 34
