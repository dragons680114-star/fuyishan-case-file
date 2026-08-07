import { initLoading } from "./components/loading.js";
import { initPageTransition } from "./components/page-transition.js";
import { initProgressNavigation } from "./components/progress-navigation.js";
import { initSectionComponents } from "./components/sections/index.js?v=20260807-counterpulse";
import { initTheme } from "./components/theme.js";
import { publishDependencyStatus } from "./core/dependencies.js";
import { initScrollEffects } from "./features/scroll-effects.js";
import { initScrollSnap } from "./features/scroll-snap.js";
import { initSmoothScroll } from "./features/smooth-scroll.js";
import { initPresentationMode } from "./features/presentation-mode.js";
import { initSceneInteractions } from "./features/scene-interactions.js";

// 線索切換的保護機制：即使個別章節動畫尚未載入，也能立即切換並顯示文字。
function initEvidenceFallback() {
  const root = document.querySelector("[data-evidence]");
  if (!root) return;

  const cards = [...root.querySelectorAll("[data-evidence-card]")];
  const buttons = [...root.querySelectorAll("[data-evidence-focus]")];
  if (!cards.length || !buttons.length) return;

  const activate = (requestedIndex) => {
    const activeIndex = Math.min(Math.max(requestedIndex, 0), cards.length - 1);
    root.dataset.focusedEvidence = String(activeIndex);

    cards.forEach((card, index) => {
      const isActive = index === activeIndex;
      const content = card.querySelector(".evidence-card__content");
      card.classList.toggle("is-focused", isActive);
      card.classList.toggle("is-muted", !isActive);

      if (isActive) {
        card.style.removeProperty("opacity");
        card.style.removeProperty("visibility");
        card.style.removeProperty("transform");
        content?.style.removeProperty("opacity");
        content?.style.removeProperty("visibility");
        content?.style.removeProperty("transform");
      }
    });

    buttons.forEach((button, index) => button.setAttribute("aria-selected", String(index === activeIndex)));
  };

  buttons.forEach((button, index) => button.addEventListener("click", () => activate(index)));
  activate(Number(root.dataset.focusedEvidence ?? 0));
}

function updateRuntimeStatus(scrollMode, sections) {
  const status = document.querySelector("[data-runtime-status]");
  if (!status) return;

  const sectionCount = sections.filter(({ mode }) => mode === "gsap").length;
  status.textContent = scrollMode === "static" ? "靜態閱讀模式已就緒" : `${sectionCount} 個章節動畫已啟動`;
}

// 應用程式入口只負責組裝模組，頁面內容應由未來的業務模組自行掛載。
function bootstrap() {
  publishDependencyStatus();
  initTheme();
  initLoading();
  initPageTransition();
  initProgressNavigation();
  initScrollSnap();
  const smoothScroll = initSmoothScroll();
  initEvidenceFallback();
  const sections = initSectionComponents();
  const scrollEffects = initScrollEffects();
  const presentation = initPresentationMode();
  const sceneInteractions = initSceneInteractions();
  updateRuntimeStatus(scrollEffects.mode, sections);

  window.InteractiveWebFramework = Object.freeze({
    version: "1.0.0",
    sections,
    scrollEffects,
    smoothScroll,
    presentation,
    sceneInteractions,
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
} else {
  bootstrap();
}
