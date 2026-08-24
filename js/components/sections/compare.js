import { getDependencies } from "../../core/dependencies.js";
import { qs, qsa, prefersReducedMotion } from "../../core/dom.js";

// Compare 讓比較條從零展開，所有比例都直接讀取 HTML 的來源標記。
export function initCompareSection() {
  const root = qs("[data-compare]");
  const { gsap, scrollTrigger: ScrollTrigger } = getDependencies();
  if (!root || !gsap || prefersReducedMotion()) return { name: "compare", mode: "static" };

  const board = qs(".compare-board", root);
  const bars = qsa(".comparison-bar i, .compare-strip__item i", root);

  if (board) {
    gsap.fromTo(
      board,
      { autoAlpha: 0, y: 50 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: board, start: "top 78%", once: true },
      },
    );
  }

  bars.forEach((bar) => {
    gsap.fromTo(
      bar,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.2,
        ease: "power3.out",
        transformOrigin: "left center",
        scrollTrigger: { trigger: bar, start: "top 84%", once: true },
      },
    );
  });

  if (ScrollTrigger) ScrollTrigger.refresh();
  return { name: "compare", mode: "gsap" };
}
