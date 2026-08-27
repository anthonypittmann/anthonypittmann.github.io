function splitIntoWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words
    .map(
      (word, i) =>
        `<span class="word"><span class="word-inner" style="--i:${i}">${word}</span></span>`
    )
    .join(" ");
}

document.querySelectorAll(".flow-words").forEach(splitIntoWords);

function startReveals() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );

  document
    .querySelectorAll(".reveal, .flow-words")
    .forEach((el) => observer.observe(el));
}

// Wait for webfonts to finish swapping in before starting any reveal
// transitions, so a mid-transition font-swap reflow can't leave elements
// visually overlapping.
if (document.fonts && document.fonts.status !== "loaded") {
  document.fonts.ready.then(startReveals);
} else {
  startReveals();
}

const nav = document.querySelector(".nav");
let lastScrollY = window.scrollY;

window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    if (Math.abs(y - lastScrollY) < 5) return;

    if (y <= 80) {
      nav.classList.remove("nav--hidden");
    } else if (y > lastScrollY) {
      nav.classList.add("nav--hidden");
    } else {
      nav.classList.remove("nav--hidden");
    }

    lastScrollY = y;
  },
  { passive: true }
);

const previewItems = document.querySelectorAll(".work__preview-item");
const tracklistRows = document.querySelectorAll(".tracklist__row");

// Selecting a row (by hover on desktop, or tap on mobile) highlights it,
// lights up its tags, and swaps in its cover art -- and all of that stays
// in place once the pointer leaves, showing whichever track was selected
// last, rather than reverting the moment you stop hovering.
function selectRow(row) {
  tracklistRows.forEach((r) => r.classList.remove("is-touched"));
  row.classList.add("is-touched");

  const item = document.querySelector(
    `.work__preview-item[data-cover="${row.dataset.cover}"]`
  );
  if (item) {
    previewItems.forEach((el) => el.classList.remove("is-active"));
    item.classList.add("is-active");
  }
}

tracklistRows.forEach((row, i) => {
  row.style.setProperty("--i", i);
  row.addEventListener("mouseenter", () => selectRow(row));
  row.addEventListener("click", () => selectRow(row));
});

function formatTime(seconds) {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

// Rows for tracks that are actually released on Spotify use Spotify's own
// official embed player instead of the custom waveform -- a play there
// counts as a real Spotify stream (same royalty rules as the app), unlike
// the self-hosted waveform player which doesn't pay the artist anything.
// Mark a row for this by putting the Spotify track ID (from Spotify's
// Share -> Embed track) on its .tracklist__player as data-spotify-track,
// with no button/waveform markup inside -- this fills it in.
document.querySelectorAll(".tracklist__player[data-spotify-track]").forEach((player) => {
  const iframe = document.createElement("iframe");
  iframe.src = `https://open.spotify.com/embed/track/${player.dataset.spotifyTrack}?utm_source=generator&theme=0`;
  iframe.width = "100%";
  iframe.height = "152";
  iframe.frameBorder = "0";
  iframe.loading = "lazy";
  iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
  player.appendChild(iframe);
});

let activeWavesurfer = null;

function pauseOthers(current) {
  if (activeWavesurfer && activeWavesurfer !== current) {
    activeWavesurfer.pause();
  }
  activeWavesurfer = current;
}

// Waveforms are created eagerly (rather than lazily on first play) so the
// list reads as a proper track list right away. That's fine while every
// row shares one small placeholder file -- if these get swapped for real,
// individually-sized audio files, switch this to lazy-create-on-first-play
// (or an IntersectionObserver) so 8 real tracks don't all download at once.
// Rows using the Spotify embed (data-spotify-track, handled above) are
// skipped here since they have no .tracklist__play button to wire up.
const accentWaveform = getComputedStyle(document.documentElement)
  .getPropertyValue("--accent-waveform")
  .trim();

document.querySelectorAll(".tracklist__player:not([data-spotify-track]) .tracklist__play").forEach((button) => {
  const row = button.closest(".tracklist__row");
  const player = button.parentElement;
  const waveformEl = player.querySelector(".tracklist__waveform");
  const timeEl = row.querySelector(".tracklist__time");

  const wavesurfer = WaveSurfer.create({
    container: waveformEl,
    waveColor: "#f2f1ec",
    progressColor: accentWaveform,
    cursorColor: accentWaveform,
    cursorWidth: 2,
    barWidth: 2,
    barGap: 1,
    barRadius: 4,
    height: 44,
    normalize: true,
    interact: true,
    hideScrollbar: true,
  });
  wavesurfer.load(button.dataset.audio);

  // Show the audio file's real length once it's loaded, instead of the
  // placeholder duration text. Once playback starts (or the user jumps
  // around by clicking/dragging the waveform), the same element switches
  // to tracking the current playhead position, and resets back to the
  // full duration when the track ends.
  wavesurfer.on("ready", () => {
    timeEl.textContent = formatTime(wavesurfer.getDuration());
  });

  wavesurfer.on("timeupdate", (currentTime) => {
    timeEl.textContent = formatTime(currentTime);
  });

  wavesurfer.on("play", () => button.classList.add("is-playing"));
  wavesurfer.on("pause", () => button.classList.remove("is-playing"));
  wavesurfer.on("finish", () => {
    button.classList.remove("is-playing");
    timeEl.textContent = formatTime(wavesurfer.getDuration());
  });

  // Clicking/dragging on the waveform itself also starts playback,
  // not just the button.
  wavesurfer.on("interaction", () => {
    timeEl.textContent = formatTime(wavesurfer.getCurrentTime());
    if (!wavesurfer.isPlaying()) {
      pauseOthers(wavesurfer);
      wavesurfer.play();
    }
  });

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    selectRow(row);

    if (wavesurfer.isPlaying()) {
      wavesurfer.pause();
    } else {
      pauseOthers(wavesurfer);
      wavesurfer.play();
    }
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.getElementById(link.getAttribute("href").slice(1));
    if (!target) return;

    e.preventDefault();
    const top =
      target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight;
    window.scrollTo({ top, behavior: "smooth" });
  });
});
