import { qs, qsa, prefersReducedMotion } from "../core/dom.js";
import { getDependencies } from "../core/dependencies.js";

const PRESENTATION_STORAGE_KEY = "fuyishan-case-presentation-mode";
const DESKTOP_QUERY = "(min-width: 48rem)";

function readStoredMode() {
  try {
    return window.localStorage.getItem(PRESENTATION_STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveMode(enabled) {
  try {
    window.localStorage.setItem(PRESENTATION_STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    // 儲存空間被瀏覽器限制時，展示模式仍然可以正常使用。
  }
}

function createControls(sections) {
  const root = document.createElement("aside");
  root.className = "presentation-controls";
  root.dataset.presentationControls = "";
  root.hidden = true;
  root.setAttribute("aria-label", "簡報章節控制");

  root.innerHTML = `
    <button class="presentation-controls__button" type="button" data-presentation-prev aria-label="上一頁">
      <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
    </button>
    <span class="presentation-controls__counter" data-presentation-counter>01 / ${String(sections.length).padStart(2, "0")}</span>
    <div class="presentation-controls__dots" data-presentation-dots aria-label="章節頁面"></div>
    <button class="presentation-controls__button" type="button" data-presentation-next aria-label="下一頁">
      <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
    </button>
    <button class="presentation-controls__fullscreen" type="button" data-presentation-fullscreen aria-label="切換全螢幕">
      <i class="fa-solid fa-expand" data-presentation-fullscreen-icon aria-hidden="true"></i>
    </button>
  `;

  const dots = qs("[data-presentation-dots]", root);
  sections.forEach((section, index) => {
    const dot = document.createElement("button");
    dot.className = "presentation-controls__dot";
    dot.type = "button";
    dot.dataset.presentationDot = String(index);
    dot.setAttribute("aria-label", `${index + 1}. ${section.dataset.section || section.id}`);
    dot.setAttribute("aria-current", index === 0 ? "true" : "false");
    dots?.append(dot);
  });

  document.body.append(root);
  return root;
}

function updateToggle(toggle, label, icon, enabled) {
  toggle?.setAttribute("aria-pressed", String(enabled));
  toggle?.setAttribute("aria-label", enabled ? "離開簡報展示模式" : "進入簡報展示模式");
  if (label) label.textContent = enabled ? "離開展示" : "展示模式";
  icon?.classList.toggle("fa-expand", !enabled);
  icon?.classList.toggle("fa-compress", enabled);
}

function updateFullscreenButton(button, icon) {
  const isFullscreen = Boolean(document.fullscreenElement);
  button?.setAttribute("aria-label", isFullscreen ? "離開全螢幕" : "進入全螢幕");
  icon?.classList.toggle("fa-expand", !isFullscreen);
  icon?.classList.toggle("fa-compress", isFullscreen);
}

function clearSectionState(sections, gsap) {
  sections.forEach((section) => {
    section.classList.remove("is-presentation-active", "is-presentation-leaving");
    gsap?.killTweensOf(section);
    if (gsap) gsap.set(section, { clearProps: "opacity,visibility,transform" });
  });
}

function revealSectionContent(section, gsap) {
  const elements = qsa("[data-scroll-reveal], [data-hero-reveal], [data-ending-reveal]", section);
  if (!elements.length) return;

  if (!gsap || prefersReducedMotion()) {
    elements.forEach((element) => {
      element.style.opacity = "1";
      element.style.visibility = "visible";
      element.style.transform = "none";
    });
    return;
  }

  gsap.fromTo(
    elements,
    { autoAlpha: 0, y: 18 },
    { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.045, ease: "power3.out", delay: 0.16 },
  );
}

function findClosestSection(sections) {
  const currentScroll = window.scrollY;
  return sections.reduce(
    (closest, section, index) => {
      const distance = Math.abs(section.offsetTop - currentScroll);
      return distance < closest.distance ? { index, distance } : closest;
    },
    { index: 0, distance: Number.POSITIVE_INFINITY },
  ).index;
}

function updateProgress(sections, index) {
  const percentage = sections.length > 1 ? Math.round((index / (sections.length - 1)) * 100) : 100;
  const fill = qs("[data-progress-fill]");
  const value = qs("[data-progress-value]");
  if (fill) fill.style.width = `${percentage}%`;
  if (value) value.textContent = `${percentage}%`;
}

// 初始化 16:9 互動展示模式，支援滾輪、方向鍵、章節圓點與全螢幕。
export function initPresentationMode() {
  const sections = qsa("[data-section]");
  const toggle = qs("[data-presentation-toggle]");
  const label = qs("[data-presentation-label]");
  const icon = qs("[data-presentation-icon]");
  const mediaQuery = window.matchMedia?.(DESKTOP_QUERY);
  const { gsap } = getDependencies();

  if (!sections.length || !toggle) return { enabled: false, sections: 0 };

  const controls = createControls(sections);
  const previousButton = qs("[data-presentation-prev]", controls);
  const nextButton = qs("[data-presentation-next]", controls);
  const fullscreenButton = qs("[data-presentation-fullscreen]", controls);
  const fullscreenIcon = qs("[data-presentation-fullscreen-icon]", controls);
  const counter = qs("[data-presentation-counter]", controls);
  const dots = qsa("[data-presentation-dot]", controls);
  let currentIndex = 0;
  let enabled = false;
  let animating = false;

  const updateControls = () => {
    if (counter) counter.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(sections.length).padStart(2, "0")}`;
    dots.forEach((dot, index) => dot.setAttribute("aria-current", String(index === currentIndex)));
    if (previousButton) previousButton.disabled = currentIndex === 0;
    if (nextButton) nextButton.disabled = currentIndex === sections.length - 1;
    updateProgress(sections, currentIndex);
  };

  const setInitialSlide = (index) => {
    currentIndex = Math.min(Math.max(index, 0), sections.length - 1);
    clearSectionState(sections, gsap);
    sections[currentIndex].scrollTop = 0;
    sections[currentIndex].classList.add("is-presentation-active");
    revealSectionContent(sections[currentIndex], gsap);
    updateControls();
  };

  const goToSlide = (targetIndex, direction = 1) => {
    if (!enabled || animating) return;

    const nextIndex = Math.min(Math.max(targetIndex, 0), sections.length - 1);
    if (nextIndex === currentIndex) return;

    const previousSection = sections[currentIndex];
    const nextSection = sections[nextIndex];
    currentIndex = nextIndex;
    updateControls();

    // 每張展示頁皆從頂部開始，避免上一輪閱讀位置殘留。
    nextSection.scrollTop = 0;
    previousSection.classList.add("is-presentation-leaving");
    nextSection.classList.add("is-presentation-active");
    animating = true;

    if (!gsap || prefersReducedMotion()) {
      previousSection.classList.remove("is-presentation-active", "is-presentation-leaving");
      revealSectionContent(nextSection, gsap);
      animating = false;
      return;
    }

    const incomingX = direction > 0 ? 52 : -52;
    const outgoingX = direction > 0 ? -52 : 52;
    const incomingContent = qsa("[data-scroll-reveal], [data-hero-reveal], [data-ending-reveal]", nextSection);

    gsap.killTweensOf([previousSection, nextSection, ...incomingContent]);
    gsap.set(nextSection, { autoAlpha: 0, x: incomingX, scale: 0.985 });
    gsap.set(incomingContent, { autoAlpha: 0, y: 18 });

    gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        previousSection.classList.remove("is-presentation-active", "is-presentation-leaving");
        gsap.set(previousSection, { clearProps: "opacity,visibility,transform" });
        gsap.set(nextSection, { clearProps: "opacity,visibility,transform" });
        animating = false;
      },
    })
      .to(previousSection, { autoAlpha: 0, x: outgoingX, scale: 0.985, duration: 0.34, ease: "power2.in" }, 0)
      .to(nextSection, { autoAlpha: 1, x: 0, scale: 1, duration: 0.62 }, 0.1)
      .to(incomingContent, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.045 }, 0.2);
  };

  const enterFullscreen = async () => {
    if (document.fullscreenElement) return;
    try {
      await document.documentElement.requestFullscreen?.();
    } catch {
      // 瀏覽器拒絕全螢幕時，仍保留 16:9 展示模式。
    }
  };

  const exitFullscreen = async () => {
    if (!document.fullscreenElement) return;
    try {
      await document.exitFullscreen?.();
    } catch {
      // 使用者或瀏覽器已經離開全螢幕時，不需要再做額外處理。
    }
  };

  const applyMode = (nextEnabled, options = {}) => {
    const canUseDeck = mediaQuery?.matches ?? false;
    const shouldEnable = Boolean(nextEnabled && canUseDeck);
    enabled = shouldEnable;
    document.documentElement.dataset.presentationMode = enabled ? "deck" : "scroll";
    document.body.classList.toggle("is-presentation", enabled);
    controls.hidden = !enabled;
    updateToggle(toggle, label, icon, enabled);

    if (enabled) {
      setInitialSlide(options.index ?? findClosestSection(sections));
      if (options.requestFullscreen) void enterFullscreen();
    } else {
      clearSectionState(sections, gsap);
      window.scrollTo({ top: sections[currentIndex]?.offsetTop ?? 0, behavior: "smooth" });
      updateProgress(sections, currentIndex);
      if (options.exitFullscreen) void exitFullscreen();
    }

    if (options.persist !== false) saveMode(enabled);
    window.dispatchEvent(new CustomEvent("app:presentation-change", { detail: { enabled, index: currentIndex } }));
  };

  const handleWheel = (event) => {
    if (!enabled || Math.abs(event.deltaY) < 18) return;

    const activeSection = sections[currentIndex];
    const isScrollable = activeSection.scrollHeight > activeSection.clientHeight + 4;
    const atTop = activeSection.scrollTop <= 1;
    const atBottom = activeSection.scrollTop + activeSection.clientHeight >= activeSection.scrollHeight - 1;

    // 內容超出 16:9 舞台時，先讓使用者閱讀完整內容；滑到頁首／頁尾才切換章節。
    if (isScrollable && ((event.deltaY > 0 && !atBottom) || (event.deltaY < 0 && !atTop))) return;

    event.preventDefault();
    goToSlide(currentIndex + (event.deltaY > 0 ? 1 : -1), event.deltaY > 0 ? 1 : -1);
  };

  toggle.addEventListener("click", () => {
    const nextEnabled = !enabled;
    saveMode(nextEnabled);
    applyMode(nextEnabled, { requestFullscreen: nextEnabled, exitFullscreen: !nextEnabled });
  });

  previousButton?.addEventListener("click", () => goToSlide(currentIndex - 1, -1));
  nextButton?.addEventListener("click", () => goToSlide(currentIndex + 1, 1));
  fullscreenButton?.addEventListener("click", () => {
    if (!enabled) applyMode(true, { requestFullscreen: true });
    else if (document.fullscreenElement) void exitFullscreen();
    else void enterFullscreen();
  });
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const nextIndex = Number(dot.dataset.presentationDot);
      goToSlide(nextIndex, nextIndex > currentIndex ? 1 : -1);
    });
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest?.("a[href^='#']");
    if (!enabled || !link) return;
    const target = document.querySelector(link.getAttribute("href"));
    const targetIndex = target ? sections.indexOf(target) : -1;
    if (targetIndex < 0) return;
    event.preventDefault();
    goToSlide(targetIndex, targetIndex > currentIndex ? 1 : -1);
  });

  window.addEventListener("wheel", handleWheel, { passive: false });
  window.addEventListener("keydown", (event) => {
    if (!enabled) return;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) return;

    const keyActions = {
      ArrowDown: 1,
      ArrowRight: 1,
      PageDown: 1,
      ArrowUp: -1,
      ArrowLeft: -1,
      PageUp: -1,
    };
    if (event.key in keyActions) {
      event.preventDefault();
      const direction = keyActions[event.key];
      goToSlide(currentIndex + direction, direction);
    }
    if (event.key === "Home") {
      event.preventDefault();
      goToSlide(0, -1);
    }
    if (event.key === "End") {
      event.preventDefault();
      goToSlide(sections.length - 1, 1);
    }
    if (event.key === "Escape" && !document.fullscreenElement) applyMode(false, { exitFullscreen: false });
  });

  document.addEventListener("fullscreenchange", () => updateFullscreenButton(fullscreenButton, fullscreenIcon));
  window.addEventListener("resize", () => {
    if (!mediaQuery?.matches && enabled) applyMode(false, { exitFullscreen: true, persist: false });
  });
  mediaQuery?.addEventListener?.("change", (event) => {
    if (!event.matches && enabled) applyMode(false, { exitFullscreen: true, persist: false });
  });

  updateFullscreenButton(fullscreenButton, fullscreenIcon);
  updateToggle(toggle, label, icon, false);
  const storedMode = readStoredMode();
  // 一般開啟時維持長頁閱讀；使用者主動選擇後才在桌機恢復 16:9 展示模式。
  const shouldStartInDeck = storedMode === "on" && (mediaQuery?.matches ?? false);
  applyMode(shouldStartInDeck, { index: 0, persist: false });

  return {
    enabled: () => enabled,
    goToSlide,
    sections: sections.length,
  };
}
