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

### v5 — 2026-07-31
Follow-up feedback on v4. (1) Nav was using `mix-blend-mode: difference`
with no background, so it visually inverted against whatever content was
behind it — unreadable/"masked" once it reappeared over bright content
mid-page. Swapped that for a solid `background: var(--bg)` plus a
`border-bottom` hairline, so it now reads as a proper opaque bar with a
divider, same as the section headings. (2) The hero headline had drifted
away from the bottom divider bar: `.hero` vertically centered its content
via `justify-content: center` while `.hero__base` was independently
pinned via `position: absolute; bottom: 40px`, so the two moved
independently and the gap between them grew when the old roles list was
removed in v3. Fixed by putting `.hero__base` back in normal flow and
anchoring the whole hero block to the bottom (`justify-content: flex-end`),
so the name and the divider/scroll bar sit together as one unit again.
(3) Slowed the tracklist hover-sweep line from 0.5s to 0.9s with a longer
ease-out curve so it reads as a deliberate sweep rather than an instant
snap.

### v6 — 2026-07-31
Contact section trimmed to phone + Instagram only (dropped LinkedIn and
SoundCloud placeholders). Work section now has a sticky album-cover
preview panel on the right (`.work__preview`, hidden below 1000px) that
cross-fades in a placeholder per row on hover, wired up in `js/main.js`
via each row's `data-cover` attribute — swap the placeholder
`.work__preview-item` content for real cover art per project later.
Tracklist numbers now turn white on row hover. Explicitly broke the
black & white constraint (per direct request) for the MIX/MASTER/RECORD
tag pills only: each gets a distinct accent color on hover (blue/amber/
green, defined as `--accent-mix` / `--accent-master` / `--accent-record`
in `:root`) — everything else on the site stays monochrome.

### v7 — 2026-07-31
Matched `--bg` to sebastianhadl.com's actual measured background color:
checked via `getComputedStyle` on the live reference site and it's
`rgb(12, 12, 11)` (`#0c0c0b`), a warm near-black charcoal — changed from
our prior `#0a0a0a`. Note: these two values are only 2 units apart per
channel, nearly imperceptible: if the intent was a visibly lighter/greyer
background, this small nudge won't read as one — flag a specific shade
if so.

### v8 — 2026-07-31
Tag accent colors (blue/amber/green from v6) were triggering on `:hover`
of the pill itself, which made them look like independently clickable
elements — not the intent, they're just a status indicator. Changed the
trigger to `.tracklist__row:hover .tag--mix` etc. (and same for
`--master`/`--record`), so hovering anywhere on the row lights up that
row's pills together, with no implied interactivity on the pills
themselves.

### v9 — 2026-07-31
Swapped `--accent-record` from green (`#6fcf97`) to red (`#ff5c5c`).

### v10 — 2026-07-31
Mobile pass. Tested at 375px (phone) and 768px (tablet) via the browser
preview; most sections already held up fine thanks to existing clamp()
sizing and the 720px/1000px breakpoints from earlier versions. The one
real break was the fixed nav: "Anthony Pittman" plus the Work/About/
Contact links would wrap mid-word at narrow widths. Added a
`max-width: 480px` block that stacks the nav into two rows (name, then
links) instead of letting it wrap awkwardly, and trims section/hero
padding down (140px→72px vertical, 40px→24px horizontal) so there isn't
excessive empty space on small screens. Verified no horizontal overflow
at 375px (`scrollWidth === innerWidth`).

### v11 — 2026-07-31
Nav links (and back-to-top) were plain anchor jumps — instant, no
animation. Added a click handler in `js/main.js` on every `a[href^="#"]`
that intercepts the jump and does `window.scrollTo({ top, behavior:
"smooth" })` instead, with `top` offset by the nav's current height so
sections don't land tucked underneath the fixed nav bar. Deliberately did
this in JS rather than re-adding global `scroll-behavior: smooth` (which
was removed in v3 after it caused issues) so the offset compensation
could be included.

### v12 — 2026-07-31
Three mobile fixes. (1) The v10 nav fix over-corrected: stacking the nav
into two left-aligned rows moved the Work/About/Contact links off the
right edge. Reverted to a single row (matches desktop's space-between)
and instead shrank `.nav__mark`/`.nav__links` font sizes and gap so both
fit without wrapping down to ~320px. (2) The MIX/MASTER/RECORD tag accent
colors were gated behind `:hover`, which doesn't work on touchscreens —
added an `@media (hover: none)` block that shows each tag's accent color
permanently on touch devices instead of requiring a hover that can't
happen. Couldn't visually verify this one in the test sandbox (a resized
desktop browser still reports `hover: hover`, never `hover: none`) but
the CSS is standard and correctly scoped. (3) The sticky right-side
album-cover preview panel is hidden below 1000px with nothing replacing
it, so mobile lost the visual entirely. Added a small always-visible
`.tracklist__cover` thumbnail (currently the same numeral placeholder as
the desktop preview) to each row, shown only below 720px via a
`grid-template-areas` change that puts it to the left of the row's
stacked details — same real-image swap-in path as the desktop preview
once actual cover art exists.

### v13 — 2026-07-31
Tag accent colors looked "really faded" on iPhone. Root cause: the
active state was a thin 1px accent-colored border/text plus a 12%-opacity
tint background — against the near-black `--bg`, that low-opacity tint
is barely there, and on a high-contrast OLED screen the whole thing reads
as washed out rather than a bold accent. Changed both the desktop hover
rule and the touch `@media (hover: none)` rule to a solid-fill badge
instead: full-strength accent color as the background, `var(--bg)` (dark)
text, `font-weight: 700` — same treatment on both hover and touch so
there's no inconsistency between desktop and mobile anymore.

### v14 — 2026-08-01
User reported the tag colors still looked washed out on iPhone after
v13, with a screenshot showing muted navy/maroon/olive fills — that
visual exactly matches v12's old 12%-opacity `color-mix()` tint against
the near-black background, not v13's solid-fill badges. Verified via
`curl` and `gh api .../pages/builds/latest` that the server is correctly
serving v13 (commit `190ea3a`, build status "built"), so the phone was
almost certainly showing a stale cached `style.css` — GitHub Pages sends
`cache-control: max-age=600` and Safari can hold onto that (or longer)
across app switches/tab revisits without revalidating.

Fix: added a `?v=13` cache-busting query string to the `style.css` and
`main.js` `<link>`/`<script>` tags in `index.html`. Bump this version
number on every future release so browsers are forced to fetch fresh
assets instead of relying on users to hard-refresh. Left the actual tag
color CSS untouched (still v13's solid-fill badges) pending the user
confirming what it actually looks like once the stale cache is gone.

### v15 — 2026-08-01
Cache-busting worked — user confirmed via a fresh iPhone screenshot that
v13's solid-fill badges were in fact rendering (bold blue/red/amber
pills), which resolved the "faded" mystery: it really had been a stale
cache. But the solid-fill look itself read as "sillier" / too loud for
the site — a gumdrop-colored badge clashes with the otherwise minimal
outlined-pill style used everywhere else. Landed on a middle ground: on
row hover (desktop) / permanently on touch, only `color` and
`border-color` change to the accent hue — no fill at all, so it reads as
a colored outline (fully saturated, not washed out) consistent with the
site's existing pill styling, rather than a solid badge.

## Hosting

Repo will live on GitHub with Pages enabled (served from `main` branch, root).
gh CLI installed + authenticated as `anthonypittmann`.
