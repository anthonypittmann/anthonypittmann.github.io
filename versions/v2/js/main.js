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
