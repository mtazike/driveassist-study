# DriveAssist v2: visual specification

One design system for both conditions. Any change here applies to A and B alike.

## Type
- **Family:** Archivo (self-hosted, variable width and weight). One family for everything.
- **Body:** 18 px, line height 1.65, normal width. No participant-facing text below 16 px.
- **Headings:** expanded width (118%), weight 650.

| Role | Size / line height |
|---|---|
| Hero title (H1, on image) | 68 / 1.02 |
| Hero tagline | 24 / 1.35 |
| Section title (H2) | 36 / 1.2 |
| Item title (H3) | 22 / 1.3 |
| Body | 18 / 1.65 |
| Lead / intro | 20 / 1.6 |
| Header links, breadcrumb, footer | 16 / 1.4 |

## Color
| Token | Hex | Use |
|---|---|---|
| ink | #15212B | Text, buttons, card rule |
| steel | #4F5D68 | Secondary text |
| line | #D8DEE3 | Dividers |
| mist | #F2F4F6 | Card and diagram backgrounds |
| paper | #FFFFFF | Page |
| accent | #1D5C63 | Icons, links, focus ring |

## Layout
- **Page width:** 1200 px max, 40 px side padding.
- **Text column:** 760 px max; the statement card is fixed at **720 px wide in both positions**.
- **Section rhythm:** 72 px top and bottom padding, 1 px divider between sections.
- **Header:** 72 px, not sticky. Wordmark left; three section links right (Overview, Features, Where It Works). No link to Learn More.
- **Breadcrumb:** plain text under the header.
- **Hero:** 600 px tall on desktop, image cropped so the vehicle stays fully visible; title and tagline bottom-left on a dark gradient.

## Components
- **Statement card:** mist background, 4 px ink left rule, 4 px radius, 24 × 28 px padding, 18 px text, first sentence bold. Identical wherever it is placed.
- **Diagrams:** 16:9, mist background, same line style and vehicle colors; labels are neutral nouns only.
- **Accordion:** full-width row, 1 px top and bottom rule, chevron right; 20 px semibold label.
- **Primary button:** ink background, white 17 px semibold text, 4 px radius, 16 × 32 px padding.

## Rules carried over from the content sheet
- No obligation, autonomy, reduced-effort, or "system watches for you" wording outside the statement.
- No carousels, footnote markers, award badges, or external links.
- Navigation links scroll to the same sections in both conditions.
- Diagrams show following distance and lane position only, never collision avoidance or autonomous navigation.
