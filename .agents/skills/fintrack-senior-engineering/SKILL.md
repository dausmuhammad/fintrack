---
name: fintrack-senior-engineering
description: Implement and review FinTrack features with senior system engineering judgment, emphasizing financial data correctness, browser persistence, and recoverable failure handling.
---

# FinTrack Senior System Engineering

Use JavaScript modules and JSX components per the user's latest instruction. Enforce data contracts through runtime validation and meaningful tests; do not add TypeScript or require a TypeScript check.

Read `struktur_mockup_ui_fintrack.md` from the project root for product scope and acceptance criteria. Apply this skill to FinTrack implementation and review; it does not authorize new infrastructure or deployment.

## Engineering decisions

- Before changing code, identify the affected data invariant and end-to-end user outcome. Choose the simplest architecture that preserves both; the MVP is a local single-user application.
- Keep money as integer rupiah, business dates as date-only strings, and category IDs stable. Keep calculations independent of React and storage.
- Define clear boundaries between validation, repository, shared application state, and presentation. Prefer one source of truth and derived totals rather than synchronized copies.
- Treat storage writes as fallible. Validate before mutation; update successful UI state only after persistence succeeds. Never overwrite unread or corrupt data with empty defaults during hydration.
- Validate imports as untrusted input, including schema version, shape, duplicate IDs, date validity, category compatibility, and numeric bounds. Preserve existing data when validation or persistence fails.
- Use a repository interface that permits later backend replacement without implementing a speculative backend now. Avoid generic frameworks and abstractions without a present caller.
- Inspect dependency compatibility and existing conventions before scaffolding. Keep client boundaries narrow and avoid server access to browser APIs.

## Delivery review

Trace a transaction through create, persistence, dashboard, budget, edit, delete, and reload. Review error and cancellation paths as carefully as the successful path. Test financial invariants and import atomicity with meaningful fixtures. Run the required build, type, lint, and test checks; distinguish observed results from assumptions.

Explain material tradeoffs briefly in the delivery or README. Do not equate a senior role with extra layers, dependencies, or unsupported claims of production readiness.
