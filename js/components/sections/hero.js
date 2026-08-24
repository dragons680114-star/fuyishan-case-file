import { getDependencies } from "../../core/dependencies.js";
import { qs, qsa, prefersReducedMotion } from "../../core/dom.js";

// Hero 只管理首屏進場與背景影像槽的視差，文案仍保留在 HTML。
export function initHeroSection() {
  const root = qs("[data-hero]");
  const { gsap, scrollTrigger: ScrollTrigger } = getDependencies();
  if (!root || !gsap) return { name: "hero", mode: "static" };

  const revealElements = qsa("[data-hero-reveal]", root);
  const background = qs("[data-ai-background]", root);
  const content = qs(".hero-section__content", root);
  const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

  timeline.fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 });
  timeline.fromTo(revealElements, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, "-=0.08");

  if (!prefersReducedMotion() && ScrollTrigger && background) {
    gsap.to(background, {
      yPercent: 10,
      ease: "none",
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  // 桌面滑鼠移動時產生很輕的景深偏移，觸控裝置不啟用以避免誤觸。
  if (!prefersReducedMotion() && window.matchMedia?.("(pointer: fine)").matches) {
    const moveX = gsap.quickTo(content, "x", { duration: 0.8, ease: "power3.out" });
    const moveY = gsap.quickTo(content, "y", { duration: 0.8, ease: "power3.out" });
    const backgroundX = gsap.quickTo(background, "x", { duration: 1.2, ease: "power3.out" });
    const backgroundY = gsap.quickTo(background, "y", { duration: 1.2, ease: "power3.out" });

    root.addEventListener("pointermove", (event) => {
      const bounds = root.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      moveX(x * -10);
      moveY(y * -6);
      backgroundX(x * 10);
      backgroundY(y * 6);
    });

    root.addEventListener("pointerleave", () => {
      moveX(0);
      moveY(0);
      backgroundX(0);
      backgroundY(0);
    });
  }

  return { name: "hero", mode: "gsap" };
}
