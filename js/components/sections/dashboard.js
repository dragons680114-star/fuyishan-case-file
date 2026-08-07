import { getDependencies } from "../../core/dependencies.js";
import { qs, qsa, prefersReducedMotion } from "../../core/dom.js";

function startCounterPulse(element, gsap, delay) {
  element._dashboardPulseTween?.kill();
  // 數字完成後保留低頻率的微彈跳，晚進入這一頁也能感受到互動，不會干擾閱讀。
  element._dashboardPulseTween = gsap.to(element, {
    y: "-0.07em",
    scale: 1.035,
    duration: 0.26,
    delay,
    ease: "sine.out",
    yoyo: true,
    repeat: -1,
    repeatDelay: 2.7,
  });
}

function animateCounter(element, gsap, onComplete, delay = 0) {
  const target = Number(element.dataset.target);
  const decimals = Number(element.dataset.decimals ?? 0);
  const state = { value: 0 };

  element._dashboardCounterTween?.kill();
  element._dashboardPulseTween?.kill();
  element.textContent = (0).toFixed(decimals);
  // 讓每個數字先輕輕彈入，再開始計數；閱讀時仍能清楚追蹤數值變化。
  gsap.fromTo(
    element,
    { autoAlpha: 0.45, scale: 0.82, y: "0.18em" },
    { autoAlpha: 1, scale: 1, y: 0, duration: 0.52, delay, ease: "back.out(2.1)", overwrite: true },
  );
  element._dashboardCounterTween = gsap.to(state, {
    value: target,
    // 放慢節奏，讓經營者能實際看見每個目標值被累加，而非一閃即逝。
    duration: 3.8,
    delay,
    ease: "power1.out",
    onUpdate: () => {
      element.textContent = state.value.toFixed(decimals);
    },
    onComplete: () => {
      startCounterPulse(element, gsap, delay * 0.55);
      onComplete();
    },
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

  const counters = qsa("[data-counter]", root);
  let lastPlayTime = 0;
  const playCounters = ({ replay = false } = {}) => {
    const state = root.dataset.counterState;
    if (state === "running" || (!replay && state === "complete")) return;

    // 同一瞬間若收到捲動與版面切換訊號，只播放一次，避免數字被重設。
    if (performance.now() - lastPlayTime < 700) return;
    lastPlayTime = performance.now();

    root.dataset.counterState = "running";
    let completed = 0;
    const finish = () => {
      completed += 1;
      if (completed === counters.length) root.dataset.counterState = "complete";
    };
    counters.forEach((counter, index) => animateCounter(counter, gsap, finish, index * 0.12));
  };

  // 捲動閱讀時第一次進入頁面才播放；16:9 模式則每次跳到本頁重新從零開始。
  if (ScrollTrigger) {
    ScrollTrigger.create({
      trigger: root,
      // 章節貼齊畫面頂端才開始，使用導覽按鈕或捲動吸附時都能看到完整過程。
      start: "top top",
      onEnter: () => playCounters({ replay: true }),
      onEnterBack: () => playCounters({ replay: true }),
    });
  } else {
    playCounters();
  }

  // 簡報展示模式是以章節切換呈現，不一定會觸發捲動事件；監看目前章節即可保證重播。
  const presentationObserver = new MutationObserver(() => {
    if (root.classList.contains("is-presentation-active")) playCounters({ replay: true });
  });
  presentationObserver.observe(root, { attributes: true, attributeFilter: ["class"] });

  window.addEventListener("app:presentation-change", () => {
    if (root.classList.contains("is-presentation-active")) playCounters({ replay: true });
  });

  if (ScrollTrigger) ScrollTrigger.refresh();
  return { name: "dashboard", mode: "gsap" };
}
