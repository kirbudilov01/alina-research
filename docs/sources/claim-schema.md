# Claim Schema

Date: 2026-05-31

## Purpose

This project needs a strict claim layer so that the final PDF can separate evidence from interpretation.

## Claim Format

```text
Claim text (sources: SRC-XXXX, confidence: High|Medium|Low, updated: YYYY-MM-DD)
```

## Claim Table Fields

- claim_id
- claim_text
- hypothesis_id
- market
- niche
- claim_type
- value
- unit
- geography
- period
- source_id
- source_url
- source_title
- source_publisher
- source_date
- extraction_date
- confidence
- evidence_direction
- notes

## Claim Types

- market_size
- growth_rate
- revenue_proxy
- pricing
- retention_mechanic
- audience_signal
- competitor_feature
- whitespace_positive
- whitespace_negative
- compliance_risk
- monetization_risk
- product_pattern

## Evidence Direction

- supports
- weakens
- neutral
- requires_followup

## Confidence Rules

High:

- Primary data, reputable analyst PDF, public company filing, platform API, peer-reviewed paper, or clearly sourced report.

Medium:

- Public analyst summary, reputable business article, app store metadata, structured marketplace listing.

Low:

- SEO market pages with unclear methodology, forum posts, anonymous estimates, scraped snippets, weakly sourced blog posts.

