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

### v16 — 2026-08-01
The touch-mode tag colors (from v12/v15) still didn't appear on the
user's iPhone even after the cache fix — this time a real bug, not
caching. Root cause: CSS specificity. `.tracklist__tags em` (the base
pill style, specificity 0-1-1: one class + one element) was beating
`.tag--mix` alone (0-1-0: one class) inside the `@media (hover: none)`
block, so the base gray color/border silently won regardless of whether
the media query matched. This has been broken since v12 — the earlier
"faded" complaint may have partly been this too, tangled up with the
separate caching issue. Fixed by bumping the selector to
`.tracklist__tags em.tag--mix` (0-2-1), which unambiguously outranks the
base rule. Bumped cache-busting to `?v=16`.

### v17 — 2026-08-01
The tracklist row hover effects (sweep-line divider, number turning
white, row highlight) were gated behind `:hover`, same problem as the
tag colors — no hover on touchscreens means these never showed on
iPhone. Rather than making them permanently-on like the tag colors
(these are more of an interactive flourish than a status indicator, so
"always on" would just mean every row looks identical), added a tap
handler in `js/main.js`: clicking/tapping a `.tracklist__row` toggles an
`.is-touched` class, which every affected CSS rule now also matches
alongside `:hover` (e.g. `.tracklist__row:hover, .tracklist__row.is-touched`).
Tapping a row highlights it (sweep line draws in, number brightens);
tapping a different row moves the highlight; tapping the same row again
clears it. Verified via a real simulated click in the test browser —
note `getComputedStyle` inside this sandbox's JS-eval tool returned
stale values when checking class-toggle results, but the actual
rendered screenshot confirmed the effect works correctly.

### v18 — 2026-08-01
Per user request (and since tapping wasn't a great answer either): the
divider line under each tracklist row now sweeps in left-to-right
automatically as the row scrolls into view, no interaction required.
Added `.tracklist__row.in-view::after { transform: scaleX(1); }`
(`in-view` is the same class the existing IntersectionObserver already
adds for the row's fade-in), staggered per row via a `--i` custom
property set in `js/main.js` (`transition-delay: calc(var(--i) * 60ms +
400ms)`) so the lines cascade in a beat after each row fades in, rather
than all at once.

Had to be careful here: naively giving `::after` a flat per-row
`transition-delay` would have also delayed the *hover/tap* reaction
(same element, same property, transition-delay isn't conditional on
which class triggered the change). Fixed by scoping the delay to only
`.tracklist__row.in-view::after`, and adding a same-specificity
`.tracklist__row:hover::after, .tracklist__row.is-touched::after` rule
*after* it in source order that resets `transition-delay: 0s` — so
hover/tap still react instantly even on a row that already auto-revealed.
The tap-to-reveal from v17 is kept as a bonus, not removed.

### v19 — 2026-08-01
Added a page-wide max content width (`--content-max: 1600px`) so the
site doesn't stretch edge-to-edge on very wide monitors (user's case:
a 34" ultrawide). Applied `max-width: var(--content-max); margin: 0
auto;` to `.nav`, the generic `section` rule (covers hero/work/about/
contact since they're all `<section>` elements), and `.footer`. Nav's
background/border-bottom and every section divider now only span the
centered 1600px column rather than the full viewport — looks
intentional rather than broken since `.nav`'s background color is
identical to the page background, so there's no visible seam, just the
divider lines stopping at the column edge. Verified at a simulated
3440px viewport: content boxes centered correctly, headline no longer
sprawls, work section list + preview panel both contained.

### v20 — 2026-08-03
Added a fourth service tag, **Alt Mix** (`.tag--alt`, accent
`--accent-alt: #c084fc` — soft violet), for showcasing mixes that
either aren't yet released or that the artist granted permission to
share even when this wasn't the final chosen version. Matches the
existing outlined-pill tag pattern exactly: no fill, accent
color/border on row hover (desktop) via
`.tracklist__row:hover .tag--alt`, and permanently on touch via
`.tracklist__tags em.tag--alt` inside `@media (hover: none)` (using
the same higher-specificity selector fixed in v16). Demoed on
placeholder row 01 (was `Mix`, now `Alt Mix`) so the user can see it
render; real per-track assignment pending — all titles/artists are
still placeholders. Bumped cache-busting to `?v=20`.

Note: this version was made directly against the GitHub repo (not in
this local working copy) by another AI tool the user tried ("Hermes
AI"), which the user said "sort of was working but then failed" for
whatever else it was attempting — but they explicitly wanted the Alt
Mix tag itself kept. Merged in via `git rebase` alongside v21 below.

### v21 — 2026-08-03
Added a wavesurfer.js waveform audio player to each track row (one
WaveSurfer instance per row, loaded via the `wavesurfer.js@7` CDN
build in `index.html`). Went through a couple of layout iterations
before landing here:
- First pass: compact inline player (play button + waveform + time)
  replacing the duration column. User preferred the original top-line
  layout (title/artist/tags/duration together) with the waveform as a
  full-width element below instead — rows are taller now, which is
  fine per the user.
- Styling was then redone to closely match the user's own waveform
  player from dualitysounds.ca (they shared their actual working
  code): bare icon play/pause button (no circle background) using
  Material Symbols icon paths, `normalize: true`, `barRadius: 4`,
  `barGap: 1`, a visible cursor line, and clicking/dragging the
  waveform itself also starts playback (`wavesurfer.on('interaction', ...)`)
  — not just the button. Colors translated to this site's monochrome
  system: unplayed bars are white (`#f2f1ec`), and both the progress
  fill and the cursor use a new `--accent-waveform` teal (`#2dd4bf`),
  chosen distinct from the existing MIX/blue, MASTER/amber, RECORD/red
  tag accents and from dualitysounds' red.
- Playback logic calls `wavesurfer.play()`/`.pause()`/`.isPlaying()`
  explicitly (matching the user's proven working pattern) rather than
  `.playPause()`. Only one track plays at a time — starting a new one
  pauses whichever else was active (`pauseOthers()` in `js/main.js`).
- `assets/audio/placeholder.wav` is a locally-synthesized 12s tone
  (generated with Python's `wave` module, no external asset) shared by
  all 8 rows via `data-audio` on each `.tracklist__play` button, since
  real per-track audio isn't ready yet. User suspected the placeholder
  looks "silly" as a waveform since it's a sustained drone rather than
  a dynamic mix — likely right, real music will show much more varied
  peaks. Waiting on the user to drop a real reference mix into
  `assets/audio/` to test with.
- Waveforms are created eagerly on page load (not lazily on first
  play) since they currently all share one small cached file; revisit
  this (lazy-create-on-first-play, or IntersectionObserver-gated) once
  real, individually-sized audio files replace the placeholder so 8
  real tracks don't all download upfront.
- Could not get automated click-simulation to reliably trigger
  playback in this session's test sandbox despite several attempts
  (coordinate-based clicks, ref-based clicks) — but directly calling
  `wavesurfer.play()` via script confirmed the mechanism itself works
  correctly (`isPlaying()` became `true`), and the audio file fetches
  successfully over the network for every row. Treating the click
  simulation flakiness as a tooling quirk rather than a real bug;
  needs the user's own click-test on a real device to fully confirm.

Rebased on top of v20 (Alt Mix tag) after a push conflict; bumped
cache-busting to `?v=21` to cover both sets of changes.

User later provided a real track (`Overdose.mp3` + cover art) from
their own finished-music folder to test the waveform against, since
the synthesized placeholder's flat drone tone doesn't show realistic
dynamics. They explicitly do not want real audio/art committed to this
public repo long-term — the eventual plan is to host audio on a
DigitalOcean Space and reference it by URL, partly for basic
anti-scraping reasons. Any real audio dropped in during testing should
stay local-only (gitignored), not pushed.

### v22 — 2026-08-04
User already had a DigitalOcean Space (`mix-website-assets`, `tor1`
region, CDN enabled) set up, so real audio/art hosting is live rather
than hypothetical now. Row 1 (`Project Title One` / `Alt Mix`) now
points at real hosted assets instead of the local placeholder:
- `data-audio` → `https://mix-website-assets.tor1.cdn.digitaloceanspaces.com/Overdose.mp3`
- Both the desktop `.work__preview-item` and the mobile
  `.tracklist__cover` for row 1 now render an actual `<img>` of the
  cover art (`Overdose.png`) instead of the numeral placeholder, via
  new `object-fit: cover` rules for `.work__preview-item img` /
  `.tracklist__cover img`.
- The local-only test copy (`assets/audio/local-test/`, gitignored)
  was deleted once the real Space URLs were wired in — no longer
  needed.
- Rows 2-8 remain on the shared `placeholder.wav` until more real
  tracks/art are ready.

Hit and resolved a real CORS issue along the way: WaveSurfer fetches
audio via `fetch()` to decode it for the waveform, which requires the
Space to send `Access-Control-Allow-Origin`. First attempt failed
(`TypeError: Failed to fetch` from the browser, though `curl` showed
200 fine — CORS is a browser-enforced policy, invisible to curl).
After the user added a CORS rule (origin `https://anthonypittman.ca`,
`GET`), it still failed because DO's Cloudflare-backed CDN had already
cached the pre-CORS-fix response (`age`/`cf-cache-status: HIT`) — the
preflight `OPTIONS` request got the correct header, but the actual
cached `GET` response didn't. Purging the CDN cache fixed the caching
half. The final wrinkle: verified via direct `curl -H "Origin: ..."`
tests that CORS is now correctly scoped to `https://anthonypittman.ca`
specifically — meaning it will **only** work when tested from the real
deployed domain, not from a local dev server on a different origin
(`http://127.0.0.1:xxxx` gets correctly denied). This is expected/
correct CORS behavior, not a bug, but it does mean local testing of
row 1's real audio can't fully confirm success until checked on the
live site.

### v23 — 2026-08-04
Two waveform tweaks per feedback on the real Overdose.mp3 render.
(1) Bars looked flat — added `barHeight: 1.6` (exaggerates rendered
amplitude beyond the raw normalized 0-1 range) and bumped the
waveform's `height` from 36px to 44px (matching CSS) to give the
taller peaks room. (2) Swapped `--accent-waveform` from teal (`#2dd4bf`,
"not quite my vibe") to a warm orange (`#ff8a3d`) — user picked this
from a few options, chosen for being distinct from all four existing
tag accents (MIX blue, MASTER amber, RECORD red, Alt Mix violet).

### v24 — 2026-08-04
Reverted `barHeight: 1.6` from v23 almost immediately — user reported
the waveform looked flatter, not deeper, on the real live track. Root
cause: combined with `normalize: true` (which already stretches the
loudest peak to 100%), multiplying by 1.6 pushed most of an already
reasonably-loud mastered track past 100% and clipped it flat at the
top. Dropped back to no `barHeight` override (default 1); the taller
44px container from v23 was fine on its own and didn't need the
amplitude boost.

Also shipped two feature requests together:
- **Persistent selection.** Hovering (desktop) or tapping (mobile) a
  row used to only highlight it/light up its tags/show its cover art
  while actively hovering or until tapped again — moving the mouse
  away (or, on old tap logic, tapping the same row twice) reverted
  everything. Consolidated all of that into one `selectRow(row)`
  function in `js/main.js`, wired to `mouseenter` *and* `click` on each
  row (replacing separate, inconsistent mouseenter/mouseleave-based
  preview-art logic and click-to-toggle `is-touched` logic). There's no
  more `mouseleave` handler at all — the last-selected row simply stays
  selected until a different row is hovered or tapped. The play button
  also now calls `selectRow()` on click (it still `stopPropagation()`s
  so it doesn't double-fire the row's own click), so tapping play
  directly on mobile — without first tapping elsewhere in the row —
  still selects/highlights it.
- **Real durations.** `.tracklist__time` showed a static placeholder
  string that had no relationship to the actual audio file. Added a
  `formatTime()` helper and a `wavesurfer.on('ready', ...)` handler
  that overwrites the row's duration text with the real decoded length
  once each track loads. Verified locally: rows on the shared
  placeholder file all correctly updated from their fake per-row
  durations to the placeholder's real `0:12`.

### v25 — 2026-08-04
Two follow-ups from v24. (1) Live time display: `.tracklist__time` now
tracks the playhead instead of only showing the static duration —
wired to `timeupdate` (updates continuously during playback),
`interaction` (updates immediately when the user clicks/drags the
waveform to jump around, even before playback catches up), and
`finish` (resets back to the full duration once the track ends).
`ready` still sets the initial full-duration display. (2) Bug fix:
after making row selection persist past mouseleave in v24, the tag
pill accent colors (`.tag--mix`/`--master`/`--record`/`--alt`) were
still wired to `:hover` only, not `.is-touched` — so pills reverted
immediately on mouse-out even though the cover art and row highlight
correctly stayed. Added the matching `.tracklist__row.is-touched
.tag--*` rules so all three (row highlight, cover art, pill colors)
now stay in sync together.

### v26 — 2026-08-04
Changed `--bg` from `#0c0c0b` (matched to sebastianhadl.com in v7) to
`#111110` per direct request — a slightly lighter, warm near-black.
Bumped cache-busting to `?v=26`.

### v27 — 2026-08-04
User reported the "sides" of the page (outside the 1600px `--content-max`
column on wide screens) didn't look like the v26 background color.
Checked via computed styles at a simulated 3440px viewport: `body`
correctly showed `rgb(17,17,16)` everywhere, including outside the
content column, and no other rule overrides `--bg` — couldn't reproduce
a real mismatch locally, so this may well have been the recurring
stale-cache issue rather than a real bug. Added two defensive fixes
regardless, both good practice independent of the root cause: (1)
explicit `html { background: var(--bg); }` (previously only `body` had
it — harmless either way, but removes any doubt), (2) `color-scheme:
dark` on `:root`, which tells the browser this page is dark-themed so
things like the overscroll/bounce area and native scrollbar colors
default appropriately instead of falling back to a light theme.
Waiting on user confirmation / a screenshot if the issue persists after
a hard refresh.

### v28 — 2026-08-05
Swapped `--accent-waveform` from `#ff8a3d` to `#ffaa4d` (amber-orange).
Presented 6 orange variants as a visual swatch grid (rendered against
the site's actual `#111110` background) so the user could pick by eye
rather than guessing from hex codes; they picked this one.

### v29 — 2026-08-05
Swapped `--accent-waveform` again, from `#ffaa4d` (amber-orange) to
`#ff6b4a` (coral) — user picked this one from the same swatch grid
after trying amber-orange first.

### v30 — 2026-08-05
Moved off orange entirely — user asked for blue. Presented 6 blue
variants as a swatch grid (same technique as v28/v29); user picked
"periwinkle" (`#7ea8ff`), the lightest/softest option. `--accent-waveform`
changed from `#ff6b4a` (coral) to `#7ea8ff`. Bumped cache-busting to
`?v=30`.

### v31 — 2026-08-05
Swapped again, from periwinkle (`#7ea8ff`) to "indigo blue" (`#5b6fd6`) —
another option from the same v30 swatch grid, this one slightly
purple-leaning. Bumped cache-busting to `?v=31`.

### v32 — 2026-08-05
Swapped again, from indigo blue (`#5b6fd6`) to "sky blue" (`#4d9bff`) —
another option from the same v30 swatch grid, brightest/highest
visibility of the set. Bumped cache-busting to `?v=32`.

### v33 — 2026-08-23
First SEO pass, technical/on-page changes only (structured data and
real contact info intentionally deferred — the phone/email in Contact
are still placeholders, and local-business schema needs real values to
be worth adding). Changes:
- `<title>` now reads "Anthony Pittman — Mixing & Mastering Engineer in
  Saskatoon, SK" (was just "— Mix Engineer") so the city and both
  services are in the single most SEO-weighted tag on the page.
- Added `<link rel="canonical" href="https://anthonypittman.ca/">`.
- Added Open Graph (`og:*`) and Twitter card meta tags so links shared
  on social/text get a real title/description/image preview instead of
  nothing — `og:image`/`twitter:image` point at the existing
  `Overdose.png` on the DigitalOcean CDN since it's the only real image
  asset on the site; swap for a proper branded/photo image later.
- Both real `<img>` tags (row 1's cover art, desktop preview panel) got
  actual `alt="Overdose single artwork"` text instead of `alt=""` —
  helps image search indexing even though the containers are
  `aria-hidden` for screen readers.
- Added `robots.txt` (allow all, points at sitemap) and `sitemap.xml`
  (single URL, the homepage) at the repo root — neither existed before.

Did not bump `css/style.css`'s `?v=` cache-buster — no CSS/JS changed
this version, only `index.html` plus two new root files.

Local SEO note for next time: the biggest remaining lever is a Google
Business Profile (can't be created by an AI agent — needs the user to
verify ownership) plus swapping the placeholder phone/email for real
ones, at which point LocalBusiness JSON-LD structured data becomes
worth adding.

### v34 — 2026-08-23
Security pass on the CDN-loaded `wavesurfer.js` script. It was loaded as
`wavesurfer.js@7` (floating major version) with no integrity check — if
unpkg or the package were ever compromised, malicious JS could run in
visitors' browsers with no warning. Pinned to the exact resolved version
(`7.12.11`) and added a Subresource Integrity (`integrity` + `crossorigin`)
attribute, so the browser refuses to execute the file if its contents
don't match the expected hash. Verified locally via `python3 -m
http.server`: `WaveSurfer` global loads correctly (SRI hash is valid);
the only console errors were the pre-existing DigitalOcean CORS
restriction (documented in v22) that only allows audio fetches from the
real `anthonypittman.ca` origin, not `localhost` — unrelated to this
change. No other security issues found in an ad-hoc review: no secrets/
API keys in the repo, HTTPS is enforced with a valid cert (checked via
`gh api .../pages`), HTTP correctly redirects to HTTPS, and DigitalOcean
Spaces CORS is already scoped to just this domain. Custom response
security headers (CSP, X-Frame-Options, etc.) aren't possible on plain
GitHub Pages without fronting it with something like Cloudflare —
judged not worth the added complexity for a static site with no forms/
login/user data.

### v35 — 2026-08-23
Real contact info, first swap since launch. Replaced the placeholder
email (`hello@example.com`) with the user's real workspace alias,
`mixing@anthonypittman.ca`. Removed the phone number entirely (was a
fake placeholder, `+1 306 555-0100`) — user explicitly does not want a
phone number public on the site; personal number stays given out
privately to clients only, not published. `.contact__grid` is a `flex`
container so it re-flows fine with just the Instagram link left, no
layout fix needed. Verified via DOM query (not visual screenshot — this
sandbox's scroll/reveal capture has a known quirk with this site, noted
back in v4/v12/v17) that the email link's `href`/text and the grid's
remaining link are correct.

Note for next SEO pass: real email now exists, but per user request
there's still no phone number, and the About section's address is just
"Saskatoon, SK" (no street address). LocalBusiness JSON-LD structured
data could still be added using email + city — phone isn't strictly
required — worth revisiting since the "needs real contact info" blocker
from v33 is now partly cleared.

### v36 — 2026-08-23
Wired up the real Instagram link (was `href="#"` placeholder since the
site's inception) to `https://www.instagram.com/anthonypittmann/`,
handle given directly by the user. Couldn't verify the profile
resolves via `curl` — Instagram serves a generic client-rendered shell
to non-browser requests regardless of whether the handle exists, so
that check is inconclusive either way; used the handle as given.

### v37 — 2026-08-23
Added Spotify embed support as an alternative to the custom waveform
player, for tracks actually released on Spotify -- a play through
Spotify's own embed counts as a real stream (subject to their normal
30-second threshold), unlike the self-hosted waveform player which
doesn't generate anything for the artist. Hybrid approach: a row opts
in by putting the Spotify track ID on its `.tracklist__player` as
`data-spotify-track="..."` with no button/waveform markup inside;
`js/main.js` fills it with Spotify's official embed iframe
(`open.spotify.com/embed/track/...`, `theme=0` for dark background to
match the site). Rows without that attribute keep building the custom
WaveSurfer player exactly as before -- the row-building loop now
selects `.tracklist__player:not([data-spotify-track]) .tracklist__play`
so Spotify rows are skipped there. Row 1 (previously "Project Title
One" / the real Overdose audio+art from the DigitalOcean Space) is now
the first test case, pointed at the real Spotify track (ID
`4yNeCk7j8N7XQOglvuGSjC`, "Overdose" by Pittman) -- confirmed by loading
the embed URL directly in a browser tab and seeing the real track,
cover art, and title render correctly. `tracklist__title`/`tracklist__artist`
text on that row are still the old placeholders ("Project Title One" /
"Artist Name") -- content update, not done here. `tracklist__time`
("3:24") is also now just static informational text next to the tags
for Spotify rows, since Spotify's embed shows its own duration/progress
and doesn't feed anything back to that element.

Bumped `js/main.js` cache-busting to `?v=37` (JS changed, CSS didn't --
left `style.css?v=32` alone).

### v38 — 2026-08-23
User reported the Spotify embed's rounded corners weren't fully seamless
-- a screenshot showed faint light slivers at the four corners. Root
cause: the `border-radius: 12px` was only set inline via JS
(`iframe.style.borderRadius`), with no `overflow: hidden`/`clip` and no
background color set on the iframe itself -- Spotify's own internal
dark card doesn't perfectly fill the iframe's literal rectangular box
at the corners, so the iframe's default white background showed through
the gap. Moved the styling to CSS (`.tracklist__player iframe` in
`style.css`: `border-radius: 12px`, `overflow: hidden`, `background:
var(--bg)`, `display: block`) and dropped the inline JS style. The
background-color match is the actual fix -- now any sub-pixel gap
blends into the page's `#111110` instead of showing white. Verified via
`getComputedStyle` on the live iframe (`overflow: clip`, background
`rgb(17,17,16)`) rather than a screenshot -- this sandbox's scroll/
screenshot capture had another one of its recurring quirks (see v4/v12/
v17/v35) and returned an unstyled snapshot instead of the real render.

Bumped both `style.css` and `main.js` cache-busting to `?v=38`.

### v39 — 2026-08-23
Two follow-ups.

**Spotify embed corner seam:** user reported a faint white sliver still
showing at the rounded corners even after v38's background-match fix.
Concluded this is very likely rendering happening *inside* Spotify's
own iframe content (their player card, served from open.spotify.com)
rather than anything on our page -- browsers block a parent page from
reaching into or styling cross-origin iframe internals, so if their
card sits slightly inset from its own frame edge with its own corner
treatment, nothing in our CSS can touch it. No further code change
made here; flagged to the user as a "Spotify thing," not a bug in our
markup.

**Divider line now hover-only.** The tracklist row's bottom divider
line (the "shoots across" sweep effect) used to auto-reveal permanently
once a row scrolled into view (`.in-view::after`, added v18) and then
also stayed lit via the persistent `.is-touched` selection state (v24)
even after the pointer moved elsewhere -- in practice this meant the
line was visible almost all the time, defeating its point as a hover
accent. Per feedback, removed the `.in-view::after` auto-reveal rule
entirely and split the remaining trigger: `.tracklist__row:hover::after`
now handles desktop (reacts to real cursor position, so it reverses
immediately when the pointer actually leaves -- unaffected by
`.is-touched` persisting for the unrelated row-highlight/tag-color/
cover-art selection state), while `.tracklist__row.is-touched::after`
is now scoped inside `@media (hover: none)` so touch devices (no
`:hover` available) keep their tap-to-reveal equivalent without
reintroducing the "stays lit after you've moved on" effect on desktop.
Verified via `getComputedStyle` with `.in-view` forced on a row: `::after`
correctly stays `scaleX(0)` at rest, only the `:hover` rule sets `scaleX(1)`.

Bumped `style.css` cache-busting to `?v=39` (JS unchanged, left
`main.js?v=38` alone).

### v40 — 2026-08-23
Actual fix for the Spotify embed corner seam (v38/v39 attempts didn't
fully clear it). User sent a zoomed screenshot showing a single white
pixel right at the top-right corner tip -- that precise a leak, at
exactly the highest-curvature point, matches a known browser quirk
rather than something inside Spotify's own content: an `<iframe>` gets
composited as its own GPU layer, and rounding it directly
(`border-radius` + `overflow: hidden` on the iframe itself, what v38
did) can leave a sub-pixel gap right at the corner tip even when colors
match, because the rounded clip mask doesn't always fully cover that
point on the iframe's separate layer.

Fix: moved the rounding one level up. `js/main.js` now wraps the
Spotify iframe in a plain `<div class="spotify-embed">`; that wrapper
carries `border-radius: 12px`, `overflow: hidden`, and
`background: var(--bg)` (in `style.css`), while the iframe itself is
unrounded (`border-radius: 0`) and just fills the wrapper edge-to-edge.
Plain divs don't have the same GPU-layer corner-clip issue, so this
should fully close the gap rather than just minimize it. Verified via
`getComputedStyle`: wrapper has the radius/clip/background, iframe
itself reports `border-radius: 0px`.

Bumped both `style.css` and `main.js` cache-busting to `?v=40`.

### v41 — 2026-08-23
Two fixes.

**iPhone email cutoff.** User reported the contact email looked slightly
cut off on iPhone. Root cause: the real address
(`mixing@anthonypittman.ca`, swapped in at v35) is one unbroken string
with no spaces for the browser's default text wrapping to break on --
at narrow phone widths it was overflowing its box, and `.line-mask`
(used for the slide-up reveal animation on this element) clips
overflow via `overflow: hidden`, so the overflowing tail was getting
visually chopped off. Fixed with `overflow-wrap: break-word` +
`word-break: break-word` on `.contact__email`, plus `max-width: 100%`
and a small `line-height` bump (1 -> 1.15) so a wrapped second line
doesn't look cramped. Verified in mobile emulation (375px): the address
now wraps cleanly to 2 lines with zero scroll overflow (confirmed via
`scrollWidth === clientWidth`), where before it would have overflowed.

**Divider line as a scroll indicator on touch devices.** Per feedback:
desktop keeps the v39 hover-only divider line untouched. On touch
devices (no `:hover`), added a second, independent mechanism -- a new
`.in-frame` class continuously tracks whichever row is currently
centered in the viewport as the user scrolls (via an
`IntersectionObserver` with a thin `rootMargin: "-45% 0px -45% 0px"`
band around vertical center, gated behind
`window.matchMedia("(hover: none)").matches` so this whole block no-ops
on desktop). This is separate from the existing tap-to-select
`.is-touched` state -- both can independently trigger the same
`::after` line, scoped together inside the same `@media (hover: none)`
CSS block. Could not verify the live scrolling behavior in this
sandbox: even a bare-minimum `IntersectionObserver` with no options
never fired its callback in the test tab (isolated this from the
rootMargin logic specifically), consistent with this environment's
long-documented scroll/hover simulation limitations (v4, v12, v17,
v35). The `matchMedia("(hover: none)")` device-detection gate itself
*did* verify correctly under mobile emulation. Code uses the same
IntersectionObserver pattern already proven working for this site's
reveal-on-scroll system, but this specific piece needs a real iPhone
check to confirm.

Bumped both `style.css` and `main.js` cache-busting to `?v=41`.

### v42 — 2026-08-23
User confirmed the v41 scroll-tracking divider line works on their
iPhone. Follow-up complaint: tapping a row on iPhone greyed out the
whole rest of the tracklist. Root cause: `.tracklist:hover
.tracklist__row { opacity: 0.45; }` (dims every other row to spotlight
whichever one you're on) is meant as a mouse-hover trick, but iOS
Safari has a known quirk where tapping an element can trigger a
lingering `:hover` state on it (and its ancestors) since touch has no
real hover concept -- so tapping a row was also triggering the
container's `:hover`, dimming everything else, and not clearing
reliably. Scoped that dimming rule inside `@media (hover: hover)` so it
only ever applies on real hover-capable (mouse) devices; touch is
unaffected regardless of iOS's sticky-hover behavior. Left the tapped
row's own subtle highlight (`.is-touched` -> `opacity: 1` + light
background tint) as-is -- it's harmless with nothing around it dimming
anymore, and wasn't what was complained about. Verified via
`matchMedia('(hover: hover)')` under mobile emulation: correctly
evaluates `false`, confirming the rule is inactive there.

Bumped `style.css` cache-busting to `?v=42` (JS unchanged).

### v43 — 2026-08-23
User reported double divider lines on iPhone -- the tapped row (via
`.is-touched`) and whatever row had scrolled into the viewport center
(via v41's `.in-frame`) could each independently be lit at once.
Rather than try to reconcile two competing "current row" mechanisms on
touch, removed tap-to-select entirely there per explicit request:
`js/main.js` now only attaches the row's `click` -> `selectRow()`
listener when `matchMedia("(hover: hover)").matches` is true, so touch
devices never set `.is-touched` from tapping a row at all -- `.in-frame`
(scroll position) is the sole source of truth for the divider line on
touch now. Desktop is unaffected (still selects via `mouseenter` *and*
`click`, unchanged). Removed the now-dead `.tracklist__row.is-touched::after`
rule from the touch-only CSS block, leaving just `.in-frame::after`.
The play button's own click handler still calls `selectRow()`
regardless of device -- that's an explicit action (pressing play), not
an implicit "tap anywhere on the row" one, and wasn't part of the
complaint. Verified via simulated click events under both mobile
(`hover:none`) and desktop (`hover:hover`) emulation: touch click no
longer sets `.is-touched` on any row; desktop click still does, exactly
as before.

Bumped both `style.css` and `main.js` cache-busting to `?v=43`.

### v44 — 2026-08-23
Designed and shipped a real brand mark: a "fader" icon (three vertical
sliders, staggered heights, middle one in the site's accent blue) in
place of generic initials -- fits a mixing engineer's site far better.
Iterated through several rounds live with the user (single vs.
three-fader, plain rectangle vs. a real fader-cap look with a grip
groove line, framed rounded-square vs. edge-to-edge) before landing on:
grey tracks (`#8c8c88`, reused from `--fg-dim`), white/blue/white caps
with a groove-line detail, in a "bubbly" rounded-square frame
(`border-radius` ~30% of size, subtle light stroke) for the favicon.

Design was built as an HTML canvas drawing function (parameterized by
size, so every size is drawn crisp rather than one bitmap being
scaled down) and rendered into real files rather than screenshots --
this session's screenshot capture is unreliable for verifying visual
output (recurring quirk, see v4/v12/v17/v35/v41), so PNGs were
extracted directly via `canvas.toDataURL()` and, once a single
`javascript_exec` result got too large for one round-trip, POSTed from
the browser to a tiny local Python server that decoded + wrote them to
disk -- avoids ever hand-transcribing a multi-KB base64 string (an
earlier attempt at that produced silently-corrupted files).

Shipped as two variants of the same mark:
- **Favicon** (`assets/icons/favicon-{48,96,192}.png` +
  `apple-touch-icon.png`, 180px): the framed version. Linked in
  `index.html`'s `<head>` via `<link rel="icon">` (three sizes, PNG --
  no `.ico` file, unnecessary now that every modern browser and
  Google's crawler support PNG favicons directly) and
  `<link rel="apple-touch-icon">`.
- **Nav mark** (`assets/icons/nav-mark.png`, 256px source, true alpha
  transparency): the unframed version, since the nav bar's own
  background already matches `--bg` -- placed inside `.nav__mark`
  before the "Anthony Pittman" text, styled via new `.nav__mark-icon`
  (20px desktop / 15px at the existing 480px mobile breakpoint,
  `.nav__mark` switched to `inline-flex` with an 8px/6px gap to lay
  icon + text out side by side).

Verified via DOM (`getBoundingClientRect`, `naturalWidth/Height`) and
direct `curl` checks that every linked file resolves with 200 -- not
via screenshot, per the sandbox limitation above.

Bumped `style.css` cache-busting to `?v=44` (no JS changes this
version).

## Hosting

Repo will live on GitHub with Pages enabled (served from `main` branch, root).
gh CLI installed + authenticated as `anthonypittmann`.
