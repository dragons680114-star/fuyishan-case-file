import { APP_CONFIG } from "../core/config.js";
import { getDependencies } from "../core/dependencies.js";
import { isExternalUrl } from "../core/dom.js";

function isTransitionableLink(link) {
  if (!link?.href || link.target === "_blank" || link.hasAttribute("download")) return false;

  const url = new URL(link.href, window.location.href);
  if (isExternalUrl(url)) return false;
  if (url.hash && url.pathname === window.location.pathname) return false;
  if (url.pathname === window.location.pathname && url.search === window.location.search) return false;

  return url.protocol === "http:" || url.protocol === "https:";
}

// 同源頁面導覽時先播放遮罩，返回或快取恢復時再清除狀態。
export function initPageTransition() {
  const transition = document.querySelector("[data-page-transition]");
  const { gsap } = getDependencies();

  document.addEventListener("click", (event) => {
    const link = event.target.closest?.("a");
    if (!isTransitionableLink(link)) return;

    event.preventDefault();
    document.body.classList.add("is-transitioning");

    if (gsap && transition) {
      gsap.timeline({ onComplete: () => window.location.assign(link.href) })
        .set(transition, { autoAlpha: 1, transformOrigin: "bottom center" })
        .to(transition, { scaleY: 1, duration: APP_CONFIG.transitionDuration / 1000, ease: "power3.inOut" });
    } else {
      window.setTimeout(() => window.location.assign(link.href), APP_CONFIG.transitionDuration);
    }
  });

  window.addEventListener("pageshow", () => {
    if (gsap && transition) {
      gsap.fromTo(
        transition,
        { autoAlpha: 1, scaleY: 1, transformOrigin: "top center" },
        { autoAlpha: 0, scaleY: 0, duration: APP_CONFIG.transitionDuration / 1000, ease: "power3.out" },
      );
    }
    document.body.classList.remove("is-transitioning");
  });
}
