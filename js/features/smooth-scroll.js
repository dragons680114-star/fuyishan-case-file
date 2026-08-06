import { prefersReducedMotion } from "../core/dom.js";
import { getDependencies } from "../core/dependencies.js";

// Lenis 只在可用且使用者未要求減少動態時啟用，否則保留瀏覽器原生滾動。
export function initSmoothScroll() {
  const { lenis: Lenis } = getDependencies();
  if (!Lenis || prefersReducedMotion()) return null;

  const smoothScroll = new Lenis({
    duration: 1.1,
    smoothWheel: true,
    syncTouch: false,
  });

  const raf = (time) => {
    smoothScroll.raf(time);
    window.requestAnimationFrame(raf);
  };

  window.requestAnimationFrame(raf);
  return smoothScroll;
}
