import { getDependencies } from "../../core/dependencies.js";
import { qs, qsa, prefersReducedMotion } from "../../core/dom.js";

// 行動頁先提供三個可點選步驟，只有被選取的內容卡才會展開，方便逐段報告。
export function initTimelineSection() {
  const root = qs("[data-timeline]");
  const { gsap, scrollTrigger: ScrollTrigger } = getDependencies();
  if (!root || !gsap || prefersReducedMotion()) return { name: "timeline", mode: "static" };

  const items = qsa("[data-timeline-item]", root);
  const controls = qsa("[data-timeline-control]", root);

  root.dataset.timelineState = "idle";
  items.forEach((item) => item.classList.remove("timeline-item--active"));
  controls.forEach((control) => control.setAttribute("aria-selected", "false"));

  controls.forEach((control) => {
    control.addEventListener("click", () => {
      const target = qs(control.dataset.target);
      if (!target) return;

      root.dataset.timelineState = "active";
      controls.forEach((item) => item.setAttribute("aria-selected", String(item === control)));
      items.forEach((item) => item.classList.toggle("timeline-item--active", item === target));

      // 只展開目前點選的一張行動卡，讓報告者可按 01、02、03 的順序說明。
      const marker = qs(".timeline-item__marker", target);
      const body = qs(".timeline-item__body", target);
      const tags = qsa(".timeline-item__tags span", target);

      gsap.set(target, { autoAlpha: 1 });
      if (marker) gsap.fromTo(marker, { autoAlpha: 0, scale: 0.76 }, { autoAlpha: 1, scale: 1, duration: 0.42, ease: "back.out(2)" });
      if (body) gsap.fromTo(body, { autoAlpha: 0, x: 24 }, { autoAlpha: 1, x: 0, duration: 0.55, ease: "power3.out" });
      if (tags.length) gsap.fromTo(tags, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.07, ease: "power3.out" });
    });
  });

  if (ScrollTrigger) ScrollTrigger.refresh();
  return { name: "timeline", mode: "gsap" };
}
