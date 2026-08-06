import { prefersReducedMotion, qsa } from "../core/dom.js";
import { getDependencies } from "../core/dependencies.js";

// ScrollTrigger 只處理帶有資料屬性的元素，因此新增頁面不需修改核心程式。
export function initScrollEffects() {
  const revealElements = qsa("[data-scroll-reveal]");
  const parallaxElements = qsa("[data-parallax]");
  const sceneElements = qsa(".section-scene");
  const { gsap, scrollTrigger: ScrollTrigger } = getDependencies();

  if (prefersReducedMotion() || !gsap || !ScrollTrigger) {
    revealElements.forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "none";
    });
    return { mode: "static", revealCount: revealElements.length, parallaxCount: 0, sceneCount: 0 };
  }

  gsap.registerPlugin(ScrollTrigger);

  revealElements.forEach((element) => {
    gsap.fromTo(
      element,
      { autoAlpha: 0, y: 20 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 86%",
          once: true,
        },
      },
    );
  });

  parallaxElements.forEach((element) => {
    const depth = Number(element.dataset.parallax) || 12;

    gsap.to(element, {
      yPercent: depth,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  // 食品廠景使用「慢慢推近＋字幕分層出現」的鏡頭語言，讓每張圖像影片鏡頭而不是靜態卡片。
  sceneElements.forEach((scene) => {
    const image = scene.querySelector(".section-scene__image");
    const shade = scene.querySelector(".section-scene__shade");
    const caption = scene.querySelector(".section-scene__caption");
    const captionParts = caption ? qsa(".eyebrow, strong, p, .section-scene__source", caption) : [];

    if (image) {
      gsap.fromTo(
        image,
        { scale: 1.1 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: scene,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      // 桌面滑入場景時增加一點鏡頭靠近感，離開後回到原位。
      scene.addEventListener("mouseenter", () => {
        gsap.to(image, { scale: 1.035, duration: 0.8, ease: "power2.out", overwrite: true });
      });
      scene.addEventListener("mouseleave", () => {
        gsap.to(image, { scale: 1, duration: 0.8, ease: "power2.out", overwrite: true });
      });
    }

    if (shade) {
      gsap.fromTo(
        shade,
        { opacity: 0.7 },
        {
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: scene, start: "top 78%", once: true },
        },
      );
    }

    if (captionParts.length) {
      gsap.fromTo(
        captionParts,
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: scene, start: "top 72%", once: true },
        },
      );
    }
  });

  ScrollTrigger.refresh();
  return {
    mode: "gsap",
    revealCount: revealElements.length,
    parallaxCount: parallaxElements.length,
    sceneCount: sceneElements.length,
  };
}
