import { getDependencies } from "../../core/dependencies.js";
import { qs, qsa, prefersReducedMotion } from "../../core/dom.js";

// Timeline 以每一階段為獨立動畫單位，日後可替換或增減階段而不影響其他 section。
export function initTimelineSection() {
  const root = qs("[data-timeline]");
  const { gsap, scrollTrigger: ScrollTrigger, scrollTo: ScrollToPlugin } = getDependencies();
  if (!root || !gsap || prefersReducedMotion()) return { name: "timeline", mode: "static" };

  const items = qsa("[data-timeline-item]", root);
  const controls = qsa("[data-timeline-control]", root);

  items.forEach((item) => {
    gsap.fromTo(
      item,
      { autoAlpha: 0, x: 36 },
      {
        autoAlpha: 1,
        x: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: { trigger: item, start: "top 82%", once: true },
      },
    );

    // 每個階段的標籤延遲出現，讓使用者能順著「標題 → 說明 → 行動標籤」閱讀。
    const tags = qsa(".timeline-item__tags span", item);
    if (tags.length) {
      gsap.fromTo(
        tags,
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 68%", once: true },
        },
      );
    }
  });

  controls.forEach((control) => {
    control.addEventListener("click", () => {
      const target = qs(control.dataset.target);
      if (!target) return;

      controls.forEach((item) => item.setAttribute("aria-selected", String(item === control)));
      items.forEach((item) => item.classList.toggle("timeline-item--active", item === target));

      // 點擊階段控制時，用一次輕微聚焦動畫提示目前所在位置。
      const marker = qs(".timeline-item__marker", target);
      const body = qs(".timeline-item__body", target);
      if (marker) gsap.fromTo(marker, { scale: 0.86 }, { scale: 1, duration: 0.5, ease: "back.out(2)" });
      if (body) gsap.fromTo(body, { autoAlpha: 0.62, x: 18 }, { autoAlpha: 1, x: 0, duration: 0.55, ease: "power3.out" });

      if (ScrollToPlugin) {
        gsap.to(window, {
          duration: 0.8,
          ease: "power3.inOut",
          scrollTo: { y: target, offsetY: 96 },
        });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // CSS pseudo-element 無法直接 tween，改用同一容器的 scaleY 視覺提示。
  const rail = qs(".action-timeline", root);
  if (rail && ScrollTrigger) {
    const railOverlay = document.createElement("span");
    railOverlay.className = "action-timeline__progress";
    rail.append(railOverlay);
    gsap.fromTo(
      railOverlay,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        transformOrigin: "top center",
        scrollTrigger: { trigger: rail, start: "top 72%", end: "bottom 70%", scrub: true },
      },
    );
  }

  if (ScrollTrigger) ScrollTrigger.refresh();
  return { name: "timeline", mode: "gsap" };
}
