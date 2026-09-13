# Internet in Peru: My Life Online

A CM1040 (Web Development) coursework website exploring the history of the internet in Peru, from its academic origins in 1991 to the present day, with the author's own lifetime (1996–2026) highlighted on an interactive timeline, rural connectivity programmes, and current digital-divide statistics.

## What this project demonstrates

- Responsive layout for desktop and mobile, including a table-to-cards pattern for data tables (CM1040 Topic 3)
- Accessibility and usability best practices: a global high-contrast / font-size toggle, semantic landmarks, keyboard navigation, skip link, and WCAG-aligned colour contrast throughout, including in the custom brand palette (CM1040 Topic 4)
- Data loaded from three separate JSON files, each validated in JavaScript before rendering (CM1040 Topic 5)
- A custom template engine pattern (fetch → validate → render) reused across three different pages and data shapes, with iteration, conditional branching, and automatic DOM updates without a page reload (CM1040 Topic 6)
- An accessible "click to enlarge" image viewer built on the native `<dialog>` element, used for content-rich images (a scanned press clipping and a data chart)
- A full intellectual-property classification table and AI-use transparency note (CM1040 Topics 9 and 10)

## Project structure

```text
peru-internet-history/
├── index.html                       Home page
├── timeline.html                    Interactive timeline (1991-2026)
├── closing-the-gap.html             Rural connectivity programmes
├── peru-today.html                  Digital-divide statistics
├── sources.html                     Licence table, AI note, and full reference list
├── css/
│   └── style.css                    All page styles: layout, brand palette/typography,
│                                    accessibility bar, responsive tables, lightbox
├── js/
│   ├── validator.js                 JSON validation functions (shared by all pages)
│   ├── templateEngine.js            Renders events.json onto the Timeline page
│   ├── programsEngine.js            Renders programas_rurales.json onto Closing the Gap
│   ├── statsEngine.js               Renders estadisticas_regionales.json onto Peru Today
│   ├── accessibilityBar.js          High-contrast / font-size toggle (every page)
│   └── lightbox.js                  Click-to-enlarge viewer (Closing the Gap, Peru Today)
├── json/
│   ├── events.json                  Timeline data (17 entries, 1991-2026)
│   ├── programas_rurales.json       5 rural connectivity programmes
│   └── estadisticas_regionales.json INEI comparison stats + 2 highlighted figures
├── img/                             Photos, charts, the logo, and the project video
├── fonts/                           Typeface files used by the site stylesheet
└── README.md                        This file
```

## Requirements

- [Visual Studio Code](https://code.visualstudio.com/)
- The **Live Server** extension for VS Code (by Ritwick Dey) — required because the site loads JSON data via `fetch()`, which most browsers block when opening an HTML file directly (`file://...`) rather than serving it over HTTP.
- No other dependencies, frameworks, or build steps are required. This project uses plain HTML, CSS, and JavaScript (ES modules) only.

## How to run this project locally

1. **Install the Live Server extension** in VS Code:
   - Open the Extensions panel (`Ctrl+Shift+X` / `Cmd+Shift+X`)
   - Search for "Live Server" (publisher: Ritwick Dey)
   - Click **Install**

2. **Open this project folder** in VS Code (`File → Open Folder...` and select the unzipped `peru-internet-history` folder).

3. **Start the local server**:
   - Right-click on `index.html` in the file explorer
   - Select **"Open with Live Server"**
   - Your default browser should open automatically at an address like `http://127.0.0.1:5500/index.html`

4. **Navigate the site** using the top navigation bar (Home, Timeline, Closing the gap, Peru today, Sources).

5. To stop the server, click the **"Port: 5500"** button in the VS Code status bar, or close the browser tab and click the Live Server icon again to toggle it off.

## Verifying the JSON validators

Open your browser's developer console (`F12` → **Console** tab) while browsing any page. If an entry in a JSON data file is missing a required field, a warning is logged there and that specific entry is skipped, rather than breaking the whole page — this is the validation behaviour described in the coursework report (Section D: Developing the code).

## Accessibility features

- **Skip to main content** link (first Tab stop on every page)
- **High-contrast toggle** and **font-size stepper** in the top-right accessibility bar, present on every page and built on CSS custom properties + `document.documentElement`, so every element on the page scales together
- All interactive elements meet a minimum 44×44px touch target (WCAG 2.5.5)
- Visible focus outlines on every interactive element when navigating by keyboard
- Data tables (Peru Today, Sources) reflow into stacked cards on narrow screens instead of compressing columns (WCAG 1.4.10)
- The click-to-enlarge image viewer uses the native `<dialog>` element, which provides focus trapping and Escape-to-close for free

## Testing summary

- **HTML validation** (W3C Nu Html Checker): all five pages pass with 0 errors and 0 warnings.
- **Accessibility** (Lighthouse): all five pages score **100/100**. An initial run flagged a skipped heading level (`<h3>` directly under `<h1>`), which was fixed by correcting the heading hierarchy.
- Full before/after evidence for both checks is included in the coursework report (Section E: Testing).

## Known limitations

- This is a static site: there is no backend server, database, or server-side application. The JSON files are static data files loaded by the browser using JavaScript. Some content, including the chart, is rendered dynamically on the client side from these JSON files, but the site remains static because all data and code are served as fixed files.
- The site has been tested in the latest version of Google Chrome, including Chrome DevTools' mobile device emulation. Other modern evergreen browsers should also work, since only standard ES modules, CSS custom properties, and the native `<dialog>` element are used.
- Two of the original press-photo images required compression before use; if you replace any image in `img/`, keep an eye on file size, as very large uncompressed photos can noticeably slow down page load.

## Author

Flavia Victoria Collacso Terrazas — CM1040 Web Development, University of London (Coursera).

## Acknowledgement of AI assistance

Part of the preliminary research, citation verification, and partial support for the initial code structure of this project were carried out with the help of an AI language model, under the supervision of the author, who made the final decision regarding each piece of data included. Please see the “Sources” page for the full transparency statement.
