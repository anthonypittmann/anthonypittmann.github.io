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

## Hosting

Repo will live on GitHub with Pages enabled (served from `main` branch, root).
gh CLI installed + authenticated as `anthonypittmann`.
