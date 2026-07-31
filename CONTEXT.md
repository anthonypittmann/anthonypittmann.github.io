# Anthony Pittman — Portfolio Site

Personal portfolio for Anthony Pittman, mix/recording/mastering engineer based in
Saskatoon, Saskatchewan. Plain HTML/CSS/JS (no build step), meant for GitHub Pages.

## Design brief

Inspired by the layout feel and typographic energy of sebastianhadl.com (bold
oversized headline type, monospace technical labels, numbered work list,
scroll-driven reveals) — but not a 1:1 copy. Original copy, original layout
details, black & white palette only.

Explicitly excluded, per request:
- No live world clock
- No mouse-pointer-tracking animation
- No fake channel-fader / dB meter widget
- No "CH 01 / CH 02 / CH 03" channel-style section numbering

## Structure

- `index.html` — the live/current page
- `css/style.css` — styles
- `js/main.js` — IntersectionObserver-based scroll reveal
- `versions/vN/` — a frozen snapshot of the site at the end of each iteration
- `CONTEXT.md` — this file; running log of decisions + iterations

Fonts (Google Fonts): **Anton** (display headline), **JetBrains Mono** (technical/
meta labels), **Inter** (body text).

Sections: Hero → Selected Work (numbered placeholder tracklist, 8 rows) → About
(bio + specialties) → Contact. All contact details and work rows are placeholders
to be swapped with real content later.

## Iteration log

### v1 — 2026-07-31
Initial build. Hero with big reveal-in headline, numbered work list with hover
dimming, about section with bio + 3 specialties, contact section with big email
link. Verified visually in-browser via local `python3 -m http.server`. No console
errors. Local git repo initialized.

### v2 — 2026-07-31
Feedback round: replaced the "A·P" nav mark with the full "Anthony Pittman"
(still links to `#top`, doubles as back-to-top); removed the duplicate
location line from the hero (it's already in About's fact strip); reworked
scroll reveals so text "flows" in rather than just popping — headings and the
hero title use a single-line slide-up mask (`.line-mask`), longer copy (hero
eyebrow, about bio) cascades in word-by-word (`.flow-words`), and tracklist
rows stagger in one after another via nth-child transition delays. Dropped
`scroll-behavior: smooth` (was causing the preview tool's scroll gesture to
hang — unrelated to the live site, but simpler without it).

### v3 — 2026-07-31
Fixed a hero layout bug reported on a real (wide, ~1310px) browser window:
large gap above the headline plus "MIX / RECORD / MASTER" visually
overlapping the title. Root cause suspected to be the Google Fonts
`display=swap` load swapping in Anton mid-reveal-transition and reflowing
the flex-centered hero while a transform-based transition was in flight.
Fix: `js/main.js` now waits on `document.fonts.ready` before starting the
IntersectionObserver reveals, so layout is settled before anything animates.
Also removed the redundant "Mix / Record / Master" list under the headline
(the eyebrow line above it already says the same three services) and
reordered the eyebrow to "Recording — Mixing — Mastering" per request.

### v4 — 2026-07-31
Two interaction additions. (1) Nav auto-hides on scroll down past 80px and
reveals on scroll up, via a `nav--hidden` class toggled by a scroll listener
in `js/main.js` (`transform: translateY(-100%)`, 0.4s ease-out). (2) Tracklist
row dividers now sweep in white left-to-right on hover instead of being a
static hairline, via a `.tracklist__row::after` line animated with
`scaleX(0)` → `scaleX(1)` on `:hover` — the same "shoots across" effect
referenced from sebastianhadl.com's track list.

Note: the nav hide/show couldn't be visually confirmed in the sandboxed
preview browser used for testing — that environment appears to no-op
`transform` on `position: fixed` elements specifically (also seen earlier
as fixed-nav mispositioning during scroll capture). Confirmed via
`getComputedStyle` that the class toggling logic itself is correct; the
CSS is standard and should render normally in a real browser. Worth a
manual check on the live site.

## Hosting

Repo will live on GitHub with Pages enabled (served from `main` branch, root).
gh CLI installed + authenticated as `anthonypittmann`.
