import { getDependencies } from "../../core/dependencies.js";
import { qs, qsa, prefersReducedMotion } from "../../core/dom.js";

// Ending 收束情緒與行動出口，背景仍維持獨立影像槽。
export function initEndingSection() {
  const root = qs("[data-ending]");
  const { gsap, scrollTrigger: ScrollTrigger } = getDependencies();
  if (!root || !gsap || prefersReducedMotion()) return { name: "ending", mode: "static" };

  const background = qs("[data-ai-background]", root);
  const content = qsa("[data-ending-reveal]", root);

  gsap.fromTo(
    content,
    { autoAlpha: 0, y: 32 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: { trigger: root, start: "top 70%", once: true },
    },
  );

  if (background && ScrollTrigger) {
    gsap.to(background, {
      yPercent: -8,
      ease: "none",
      scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
    });
  }

  if (ScrollTrigger) ScrollTrigger.refresh();
  return { name: "ending", mode: "gsap" };
}
