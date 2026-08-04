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

document.querySelectorAll(".tracklist__row").forEach((row) => {
  const cover = row.dataset.cover;
  const item = document.querySelector(
    `.work__preview-item[data-cover="${cover}"]`
  );
  if (!item) return;

  row.addEventListener("mouseenter", () => {
    previewItems.forEach((el) => el.classList.remove("is-active"));
    item.classList.add("is-active");
  });

  row.addEventListener("mouseleave", () => {
    item.classList.remove("is-active");
  });
});

const tracklistRows = document.querySelectorAll(".tracklist__row");

tracklistRows.forEach((row, i) => {
  row.style.setProperty("--i", i);

  row.addEventListener("click", () => {
    const wasTouched = row.classList.contains("is-touched");
    tracklistRows.forEach((r) => r.classList.remove("is-touched"));
    if (!wasTouched) row.classList.add("is-touched");
  });
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
const accentWaveform = getComputedStyle(document.documentElement)
  .getPropertyValue("--accent-waveform")
  .trim();

document.querySelectorAll(".tracklist__play").forEach((button) => {
  const player = button.parentElement;
  const waveformEl = player.querySelector(".tracklist__waveform");

  const wavesurfer = WaveSurfer.create({
    container: waveformEl,
    waveColor: "#f2f1ec",
    progressColor: accentWaveform,
    cursorColor: accentWaveform,
    cursorWidth: 2,
    barWidth: 2,
    barGap: 1,
    barRadius: 4,
    height: 36,
    normalize: true,
    interact: true,
    hideScrollbar: true,
  });
  wavesurfer.load(button.dataset.audio);

  wavesurfer.on("play", () => button.classList.add("is-playing"));
  wavesurfer.on("pause", () => button.classList.remove("is-playing"));
  wavesurfer.on("finish", () => button.classList.remove("is-playing"));

  // Clicking/dragging on the waveform itself also starts playback,
  // not just the button.
  wavesurfer.on("interaction", () => {
    if (!wavesurfer.isPlaying()) {
      pauseOthers(wavesurfer);
      wavesurfer.play();
    }
  });

  button.addEventListener("click", (e) => {
    e.stopPropagation();

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
