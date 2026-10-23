# DriveAssist study stimulus (v2, development version)

Interactive webpage for the CHI 2027 poster study *One Click Away: Information Placement and Driver-Responsibility Understanding Among Drivers with ADHD* (Texas State University). Halden Motors and DriveAssist are fictional.

**Status:** development prototype. Not approved for participants until IRB approval and Dr. Das's sign-off on the final content.

## Files

| File | Purpose |
|---|---|
| `index.html` | All page content. The responsibility statement lives once, in `<template id="tpl-statement">`. |
| `assets/css/styles.css` | Shared styling for both conditions |
| `assets/js/app.js` | Condition setup, Learn More accordion, logging, Qualtrics hand-off, test panel |
| `assets/js/config.js` | `dev: true` for testing; set to `false` for the participant version (disables test panel and swap layout) |
| `DESIGN.md` | Visual specification shared by both conditions |
| `assets/img/diagrams.html` | Editable source of the three diagrams (they are built into `index.html`) |
| `versions/v1/` | Version 1, kept for comparison and reproducibility |
| `assets/img/hero.svg` | Placeholder hero illustration (to be replaced by the hero photo) |
| `assets/fonts/` | Archivo font, self-hosted (SIL Open Font License) so no third-party requests |
| `robots.txt` | Keeps the page out of search engines |

## Opening the page

Add these to the end of the site address:

| Link ending | What it shows |
|---|---|
| *(none)* | Research notice only; no product page |
| `?c=1&test=1` | Condition A (Adjacent) with the test panel (development builds only) |
| `?c=2&test=1` | Condition B (Separated) with the test panel |
| `?c=1` / `?c=2` | What participants will see (no test panel) |
| `&layout=swap` | Internal comparison only (statement trades places with a sensor card) |

## Test panel checks

With `test=1`, a panel in the lower right shows:
- the statement appears exactly once, and its wording matches the canonical text;
- no banned words (driver obligations, autonomy, reduced effort, "looks out for you") appear outside the statement;
- where the Learn More section starts, and total page height (to measure the layout shift);
- the logged data, updating live.

The banned-word check is a guardrail. Copy changes still need a manual review of meaning.

## Data recorded (no personal information)

| Field | Meaning |
|---|---|
| `cond` | A or B |
| `layout` | shift (primary) or swap |
| `rid` | Linking code passed in from Qualtrics |
| `time_on_page_ms` | Time from page load to Continue |
| `tab_hidden_ms` | Time the browser tab was in the background (data quality) |
| `lm_opens` | Number of times Learn More was opened |
| `lm_first_open_ms` | Time until Learn More was first opened (-1 if never) |
| `lm_open_ms` | Total time Learn More was open |
| `completed` | Continue was clicked |

## Measured layout shift (shift layout, 1440 × 900 window)

| Version | Learn More starts (A) | Learn More starts (B) | Difference |
|---|---|---|---|
| v1 (1366 px wide) | 2139 px | 1955 px | 184 px |
| v2 | 2909 px | 2695 px | 214 px |

The difference equals the statement card plus its spacing. Re-measure after any design change and report it in the methods.

## Qualtrics connection (next step)

- **Window mode (default):** participants arrive from Qualtrics with `?c=1&rid=...&ret=<Qualtrics URL>` and the Continue button returns them with the data fields added to the address. Only `https://*.qualtrics.com` return addresses are accepted.
- **Embed mode:** `&mode=embed` inside a Qualtrics question; data is sent to the survey every 5 seconds. Survey-side code still to be written and tested.

## Credits

- Font: Archivo, Omnibus-Type, SIL Open Font License 1.1 (`assets/fonts/OFL-LICENSE.txt`)
- Illustration, diagrams and icons: original, created for this study
- Hero photo: [source, photographer, license, link]


## v3 visual refresh (October 2026)

The original experimental text and JavaScript condition logic remain intact. Shared visual improvements include a photographic-style hero, two capability illustrations, highway imagery, larger content panels, a functioning Explore Features anchor, and revised header typography. All four JPG assets were cropped from an original AI-generated concept image created for this prototype; they are not manufacturer photos. The generated imagery should be inspected for visual artifacts and brand resemblance before use in research.

**Important:** The two conditions are development stimuli, not ready for participants. `assets/js/config.js` currently has `dev: true`; switch to false and test the Qualtrics integration before recruitment. `robots.txt` is not access control. The Qualtrics return flow and event capture must be validated separately.
