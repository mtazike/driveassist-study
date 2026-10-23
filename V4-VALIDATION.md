# DriveAssist v4 — development validation and field guide

This is a **development-only build**. No participant recruitment until IRB and Dr. Das approval, Qualtrics integration tests, and finalized questionnaire.

## Development URLs
- `?c=1&test=1` — Adjacent
- `?c=2&test=1` — Separated
- `?c=1&test=1&img=230` — compare 230px feature photos (default 270px)
- `?c=2&test=1&img=230` — compare 230px feature photos

## Condition equivalence
- Both versions have four independently expandable FAQ rows.
- Only the canonical statement changes location: immediately following capability cards in A; first inside FAQ 1 in B.
- Same neutral FAQ 1 answer in both conditions.
- The statement's card styling and wording are identical.
- Main page in B is shorter by the statement height; expanded FAQ 1 in B is taller by the statement height.

## Logging operational definitions
- Visibility measured for each target at >=50% intersection with the viewport, while the tab is active.
- `*_seen` means at least 1,000 cumulative milliseconds of qualifying exposure; this is opportunity to encounter, **not reading or attention**.
- `reach_*` uses the same 1,000 ms rule.
- `faqN_opened` is 1 if row N opened at least once; `faqN_open_ms` is total active-tab time open.
- `faq_open_count` counts opening actions across all rows; `faq_unique_opened` counts distinct rows.
- `stmt_first_visible_ms` and `faq1_first_open_ms` use -1 if never.
- `max_scroll_pct` is the greatest page-relative vertical scroll percentage (0–100).
- `reloads` and `reentry_count` are best-effort browser signals, not tamper-proof.
- Browser `sessionStorage` is used for best-effort reload counting; blocked storage is tolerated.
- `cond` is not a secure condition assignment. Qualtrics must check it against the assigned condition.

## Qualtrics integration
The `ret` URL must be a HTTPS `qualtrics.com` subdomain. Test that Survey 2 has matching embedded-data names and receives every field. Do not pass a Prolific ID through the website. Do not use these URL query summaries without university privacy review.

## Before participant deployment
- Change `window.DA_CONFIG.dev` to `false`; test=1 and img=230 then cease working.
- Keep the primary `shift` layout; remove or disable alternative development options.
- Confirm device eligibility through approved recruitment and Qualtrics settings; no mobile blocking is enforced in this development build.
- Confirm content and imagery with Dr. Das; ensure current IRB describes the interactions and logging.
- Run A/B screenshot checks at identical browser viewport sizes and test the full survey handoff.
- Verify with pilot that 50% / 1000ms thresholds are appropriate before preregistration.
