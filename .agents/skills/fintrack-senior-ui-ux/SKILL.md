---
name: fintrack-senior-ui-ux
description: Design, implement, and review FinTrack screens with senior UI/UX judgment for transaction entry, financial readability, responsive navigation, and accessible interactions.
---

# FinTrack Senior UI/UX

Implement React components in JavaScript/JSX as requested by the user; do not introduce TypeScript.

Read `struktur_mockup_ui_fintrack.md` from the project root for the visual direction, workflows, and responsive requirements. Read the installed antislop rules and relevant skills when available; this skill complements them and does not replace or certify their audit.

## Design decisions

- Prioritize three jobs: record a transaction quickly, understand available balance, and see spending against a monthly budget. Every prominent control or visual must support a concrete user task.
- Map entry point, input, validation, success, cancellation, and recovery before polishing. All forms and confirmations use Drawers: bottom on mobile, right on desktop. On mobile, dropdowns, calendars, periods, and calendar month/year choices also use bottom Drawers, nested when opened from a form.
- Establish consistent spacing, typography, radius, surface, and semantic color tokens. The latest palette uses forest green, sage, and soft cream; dark mode uses charcoal green and mint. Income/expense retain semantic green/rose signals. Use shared Input/Label/RadioGroup primitives, desktop Radix Select/Popover, and React DayPicker rather than visible native dropdown/date controls.
- Give money strong hierarchy, tabular numerals, consistent alignment, explicit signs/types, and clear periods. Never let a monthly total appear to be an all-time balance.
- Keep desktop and mobile navigation equivalent in meaning; make add-transaction discoverable in both. Design at 360 px before expanding to desktop and preserve reachable actions when the keyboard opens.
- Review empty, loading, invalid, saving, failed, and successful states. Preserve input on errors and use concise Indonesian instructions that explain how to recover.
- Use semantic controls, visible focus, field labels, accessible icon names, and dialog focus handling. Convey budget overrun and income/expense with more than color.
- Use real data or explicitly empty states. No fabricated insight, decorative charts, fake account avatar, or generic marketing copy in the product.

## Delivery review

Inspect rendered screens at the specified mobile, tablet, and desktop widths and in both themes when browser tools are available. Walk through keyboard navigation, long notes, large amounts, empty search results, over-budget states, and form errors. Check bottom navigation/safe areas and mobile keyboard behavior.

Fix usability and hierarchy issues before adding polish. Report which screens and interactions were actually inspected; screenshots alone do not establish that a workflow works. Apply the installed antislop Delivery Gate when available and report its actual results.
