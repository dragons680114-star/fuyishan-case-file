import { initLoading } from "./components/loading.js";
import { initPageTransition } from "./components/page-transition.js";
import { initProgressNavigation } from "./components/progress-navigation.js";
import { initSectionComponents } from "./components/sections/index.js?v=20260807-refine";
import { initTheme } from "./components/theme.js";
import { publishDependencyStatus } from "./core/dependencies.js";
import { initScrollEffects } from "./features/scroll-effects.js";
import { initScrollSnap } from "./features/scroll-snap.js";
import { initSmoothScroll } from "./features/smooth-scroll.js";
import { initPresentationMode } from "./features/presentation-mode.js";
import { initSceneInteractions } from "./features/scene-interactions.js";

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
