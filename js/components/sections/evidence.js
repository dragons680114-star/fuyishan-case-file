import { getDependencies } from "../../core/dependencies.js";
import { qs, qsa, prefersReducedMotion } from "../../core/dom.js";

// Evidence 以卡片的深度、遮罩與視差強調線索差異，避免模仿簡報排列。
export function initEvidenceSection() {
  const root = qs("[data-evidence]");
  const { gsap, scrollTrigger: ScrollTrigger } = getDependencies();
  if (!root) return { name: "evidence", mode: "static" };

  const cards = qsa("[data-evidence-card]", root);
  const focusButtons = qsa("[data-evidence-focus]", root);

  // 線索切換器：一次聚焦一張卡，讓使用者先看圖像與關鍵判讀，再自行展開資料。
  const focusEvidence = (requestedIndex, animate = true) => {
    const activeIndex = Math.min(Math.max(requestedIndex, 0), cards.length - 1);
    root.dataset.focusedEvidence = String(activeIndex);

    cards.forEach((card, index) => {
      const isFocused = index === activeIndex;
      card.classList.toggle("is-focused", isFocused);
      card.classList.toggle("is-muted", !isFocused);

      // 被切換回畫面的線索，需解除先前進場動畫留下的隱藏樣式。
      if (isFocused && gsap) {
        const content = qs(".evidence-card__content", card);
        gsap.set(card, { clearProps: "opacity,visibility,transform" });
        if (content) gsap.set(content, { clearProps: "opacity,visibility,transform" });
      }
      if (animate && gsap) {
        gsap.to(card, {
          autoAlpha: isFocused ? 1 : 0.58,
          y: isFocused ? -10 : 0,
          duration: 0.42,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    });

    focusButtons.forEach((button, index) => button.setAttribute("aria-selected", String(index === activeIndex)));
  };

  focusButtons.forEach((button, index) => {
    button.addEventListener("click", () => focusEvidence(index));
    button.addEventListener("keydown", (event) => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? focusButtons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + focusButtons.length) % focusButtons.length;
      focusButtons[nextIndex]?.focus();
      focusEvidence(nextIndex);
    });
  });

  focusEvidence(0, false);

  // 即使外部動畫資源暫時不可用，線索切換器仍保持可操作。
  if (!gsap || prefersReducedMotion()) return { name: "evidence", mode: "static" };

  cards.forEach((card, index) => {
    const visual = qs(".evidence-card__visual", card);
    const content = qs(".evidence-card__content", card);

    gsap.fromTo(
      card,
      { autoAlpha: 0, y: 70, rotateX: index % 2 ? -2 : 2 },
      {
        autoAlpha: 1,
        y: 0,
        rotateX: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 78%", once: true },
      },
    );

    if (visual && ScrollTrigger) {
      gsap.to(visual, {
        yPercent: index % 2 ? -5 : 5,
        ease: "none",
        scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
      });
    }

    if (content) {
      gsap.fromTo(
        content,
        { autoAlpha: 0, x: index % 2 ? -30 : 30 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 70%", once: true },
        },
      );
    }

    // 線索卡使用原生 details 保證無 JS 也可閱讀，再用 GSAP 補上展開質感。
    const details = qs("[data-evidence-details]", card);
    const detailsBody = qs(".evidence-card__details-body", details ?? card);
    const toggle = qs(".evidence-card__toggle", details ?? card);
    const toggleIcon = qs(".evidence-card__toggle i", details ?? card);
    details?.addEventListener("toggle", () => {
      toggle?.setAttribute("aria-expanded", String(details.open));
      card.classList.toggle("is-inspected", details.open);

      if (!details.open) {
        if (toggleIcon) gsap.to(toggleIcon, { rotation: 0, duration: 0.25, ease: "power2.out" });
        return;
      }
      if (!detailsBody) return;

      gsap.fromTo(
        detailsBody,
        { autoAlpha: 0, y: -10 },
        { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" },
      );
      gsap.fromTo(
        qsa(".evidence-inline-data span, .evidence-metric, .evidence-card__warning, .compare-strip__item", detailsBody),
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.38, stagger: 0.08, ease: "power3.out" },
      );
      if (toggleIcon) gsap.to(toggleIcon, { rotation: 45, duration: 0.3, ease: "power2.out" });
    });

    if (window.matchMedia?.("(pointer: fine)").matches) {
      card.addEventListener("pointerenter", () => focusEvidence(index, false));
      card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        gsap.to(card, { rotateY: x * 2.2, rotateX: y * -2.2, duration: 0.45, ease: "power2.out", overwrite: "auto" });
      });
      card.addEventListener("pointerleave", () => {
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "power3.out", overwrite: "auto" });
      });
    }
  });

  if (ScrollTrigger) ScrollTrigger.refresh();
  return { name: "evidence", mode: "gsap" };
}
