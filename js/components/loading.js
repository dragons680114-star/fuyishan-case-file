import { APP_CONFIG } from "../core/config.js";
import { getDependencies } from "../core/dependencies.js";
import { qs } from "../core/dom.js";

// 載入模組確保首屏有最短展示時間，同時避免過長遮擋內容。
export function initLoading() {
  const loader = qs("[data-loader]");
  const mark = qs(".app-loader__mark", loader ?? document);
  const { gsap } = getDependencies();
  const startedAt = performance.now();
  let completed = false;

  const loaderLoop = gsap && mark
    ? gsap.to(mark, { rotation: 45, scale: 1.04, duration: 0.9, repeat: -1, yoyo: true, ease: "power2.inOut" })
    : null;

  const completeLoading = () => {
    if (completed) return;
    completed = true;

    const elapsed = performance.now() - startedAt;
    const remaining = Math.max(APP_CONFIG.loaderMinimumDuration - elapsed, 0);

    window.setTimeout(() => {
      if (gsap && loader) {
        loaderLoop?.kill();
        gsap.to(loader, {
          autoAlpha: 0,
          duration: 0.55,
          ease: "power2.out",
          onComplete: () => document.body.classList.remove("is-loading"),
        });
      } else {
        document.body.classList.remove("is-loading");
      }
      loader?.setAttribute("aria-hidden", "true");
      window.dispatchEvent(new CustomEvent(APP_CONFIG.readyEvent));
    }, remaining);
  };

  if (document.readyState === "complete") {
    completeLoading();
  } else {
    window.addEventListener("load", completeLoading, { once: true });
  }

  // 從快取恢復頁面時，瀏覽器可能不會再次觸發完整 load。
  window.addEventListener("pageshow", completeLoading, { once: true });
}
