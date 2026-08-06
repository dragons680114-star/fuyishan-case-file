import { getDependencies } from "../../core/dependencies.js";
import { qs, qsa, prefersReducedMotion } from "../../core/dom.js";

function animateCounter(element, gsap, ScrollTrigger) {
  const target = Number(element.dataset.target);
  const decimals = Number(element.dataset.decimals ?? 0);
  const state = { value: 0 };

  gsap.to(state, {
    value: target,
    duration: 1.8,
    ease: "power2.out",
    onUpdate: () => {
      element.textContent = state.value.toFixed(decimals);
    },
    scrollTrigger: ScrollTrigger
      ? { trigger: element, start: "top 84%", once: true }
      : undefined,
  });
}

// Dashboard 只動畫化來源已提供的目標值，不自行創造新指標。
export function initDashboardSection() {
  const root = qs("[data-dashboard]");
  const { gsap, scrollTrigger: ScrollTrigger } = getDependencies();
  if (!root || !gsap || prefersReducedMotion()) return { name: "dashboard", mode: "static" };

  qsa("[data-dashboard-stat]", root).forEach((stat, index) => {
    gsap.fromTo(
      stat,
      { autoAlpha: 0, y: 45 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: stat, start: "top 82%", once: true },
      },
    );
  });

  qsa("[data-counter]", root).forEach((counter) => animateCounter(counter, gsap, ScrollTrigger));
  if (ScrollTrigger) ScrollTrigger.refresh();
  return { name: "dashboard", mode: "gsap" };
}
