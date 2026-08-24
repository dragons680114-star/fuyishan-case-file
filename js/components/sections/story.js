import { getDependencies } from "../../core/dependencies.js";
import { qs, qsa, prefersReducedMotion } from "../../core/dom.js";

// Story 將每一個敘事節拍交給 ScrollTrigger，形成逐步揭露的閱讀節奏。
export function initStorySection() {
  const root = qs("[data-story]");
  const { gsap, scrollTrigger: ScrollTrigger } = getDependencies();
  if (!root || !gsap || prefersReducedMotion()) return { name: "story", mode: "static" };

  qsa("[data-story-step]", root).forEach((step) => {
    gsap.fromTo(
      step,
      { autoAlpha: 0, x: -24 },
      {
        autoAlpha: 1,
        x: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: step,
          start: "top 82%",
          once: true,
        },
      },
    );
  });

  if (ScrollTrigger) ScrollTrigger.refresh();
  return { name: "story", mode: "gsap" };
}
