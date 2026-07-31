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
