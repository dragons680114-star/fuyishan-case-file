import { APP_CONFIG } from "../core/config.js";

function createProgressNavigation() {
  const root = document.createElement("div");
  root.className = "progress-navigation";
  root.dataset.progressNavigation = "";
  root.setAttribute("aria-hidden", "false");
  root.innerHTML = `
    <span class="progress-navigation__track">
      <span class="progress-navigation__fill" data-progress-fill></span>
    </span>
    <span class="progress-navigation__value" data-progress-value>0%</span>
  `;

  document.body.prepend(root);
  return root;
}

// 進度導航使用原生 scroll 事件，與 Lenis、GSAP 或未來自訂滾動方案保持獨立。
export function initProgressNavigation() {
  const root = document.querySelector("[data-progress-navigation]") ?? createProgressNavigation();
  const fill = root.querySelector("[data-progress-fill]");
  const value = root.querySelector("[data-progress-value]");
  const sectionLinks = [...document.querySelectorAll('.site-nav__link[href^="#"]')];
  const linkedSections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  // 讓螢幕閱讀器知道目前畫面所在的主要章節；不改變原本的導覽樣式。
  const updateCurrentSection = (section) => {
    sectionLinks.forEach((link) => {
      const isCurrent = section && link.getAttribute("href") === `#${section.id}`;
      if (isCurrent) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  if ("IntersectionObserver" in window && linkedSections.length) {
    const visibleSections = new Map();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleSections.set(entry.target, entry.intersectionRatio);
        else visibleSections.delete(entry.target);
      });
      const current = [...visibleSections.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
      updateCurrentSection(current);
    }, { threshold: [0.25, 0.5, 0.75], rootMargin: "-18% 0px -42%" });
    linkedSections.forEach((section) => observer.observe(section));
  }

  const updateProgress = () => {
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = documentHeight > 0 ? Math.min(Math.max(window.scrollY / documentHeight, 0), 1) : 1;
    const percentage = Math.round(progress * 100);

    if (fill) fill.style.width = `${percentage}%`;
    if (value) value.textContent = `${percentage}%`;
    window.dispatchEvent(new CustomEvent(APP_CONFIG.progressUpdateEvent, { detail: { progress, percentage } }));
  };

  let frameRequested = false;
  const requestUpdate = () => {
    if (frameRequested) return;
    frameRequested = true;

    window.requestAnimationFrame(() => {
      frameRequested = false;
      updateProgress();
    });
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
  window.addEventListener("load", requestUpdate, { once: true });
  updateProgress();

  return { root, updateProgress };
}
