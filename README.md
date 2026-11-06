# Halden DriveAssist — Study Webpage

Interactive research webpage developed for a study examining how drivers understand information about Level 2 driver-assistance systems.

> **Research notice:** Halden Motors and DriveAssist are fictional and were created for this study.

## How It Is Used

- Participants are recruited through Prolific.
- Participants access the webpage from the first Qualtrics survey and click **Continue** to proceed to the second survey.
- Qualtrics randomly assigns each participant to one of two webpage versions.
- Participants see only their assigned version.
- Accessing the webpage without a valid version code displays a short research notice instead of the experimental webpage.

## Page Versions

Both versions use identical wording, visual elements, and functionality. Only the placement of driver-responsibility information differs.

- **Version 1 — Adjacent:** https://mtazike.github.io/driveassist-study/?c=1
- **Version 2 — Separated:** https://mtazike.github.io/driveassist-study/?c=2

## Data Recorded

The webpage records the following interaction measures:

- Sections viewed and time spent viewing them.
- Scrolling behavior.
- Clicks on the **Learn More** controls.
- Browser tab switching.
- Total time spent on the webpage.

These measures are transferred to the second Qualtrics survey using a randomly generated study code to link responses across study components.

The webpage does not request participants' names, email addresses, or other direct personal identifiers.

GitHub Pages is a third-party hosting service that may process technical information, including IP addresses. The research team does not receive IP-address records from GitHub.

## Project Files

| File | Purpose |
|---|---|
| `index.html` | Webpage structure and content |
| `assets/css/` | Webpage styling |
| `assets/js/app.js` | Experimental condition setup, interaction logging, and Qualtrics redirect |
| `assets/js/config.js` | Study configuration (`dev: false` for data collection) |
| `robots.txt` | Requests that cooperating search engines do not index the webpage |

## Study Workflow

**Prolific → Qualtrics Survey 1 → Assigned DriveAssist Webpage → Qualtrics Survey 2 → Prolific**

The study is conducted online in one session lasting approximately 15–20 minutes.

