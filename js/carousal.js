// News controls track reachable scroll positions, including the final partial page.
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".news-slider");
  const slides = Array.from(document.querySelectorAll(".news-slide"));
  const dots = Array.from(document.querySelectorAll(".news-dot"));
  const prev = document.querySelector(".news-arrow-left");
  const next = document.querySelector(".news-arrow-right");
  if (!slider || !slides.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let positions = [];
  let current = 0;

  function updateControls() {
    current = positions.reduce((best, position, index) =>
      Math.abs(position - slider.scrollLeft) < Math.abs(positions[best] - slider.scrollLeft) ? index : best, 0);
    dots.forEach((dot, index) => {
      dot.hidden = index >= positions.length;
      dot.classList.toggle("active", index === current);
      dot.setAttribute("aria-current", index === current ? "true" : "false");
      dot.setAttribute("aria-label", `News position ${index + 1}`);
    });
    if (prev) prev.disabled = slider.scrollLeft <= 1;
    if (next) next.disabled = slider.scrollLeft >= slider.scrollWidth - slider.clientWidth - 1;
  }

  function measure() {
    const max = Math.max(0, slider.scrollWidth - slider.clientWidth);
    positions = [];
    const start = slides[0].getBoundingClientRect().left;
    slides.forEach(slide => {
      const position = Math.min(max, Math.max(0, slide.getBoundingClientRect().left - start));
      if (!positions.length || position - positions[positions.length - 1] > 1) positions.push(position);
    });
    updateControls();
  }

  function goTo(index) {
    const bounded = Math.max(0, Math.min(positions.length - 1, index));
    slider.scrollTo({ left: positions[bounded], behavior: reducedMotion.matches ? "instant" : "smooth" });
  }
  if (prev) prev.addEventListener("click", () => goTo(current - 1));
  if (next) next.addEventListener("click", () => goTo(current + 1));
  dots.forEach((dot, index) => dot.addEventListener("click", () => goTo(index)));
  slider.addEventListener("scroll", updateControls, { passive: true });
  window.addEventListener("resize", measure);
  measure();
});
