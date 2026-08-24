import { qsa, prefersReducedMotion } from "../core/dom.js";
import { getDependencies } from "../core/dependencies.js";

// 場景聚光：滑鼠在工廠畫面上移動時，柔和地帶出使用者正在看的位置。
export function initSceneInteractions() {
  const scenes = qsa("[data-scene-interactive]");
  const { gsap } = getDependencies();
  const canUsePointer = window.matchMedia?.("(pointer: fine)").matches;

  if (!scenes.length || !canUsePointer || prefersReducedMotion()) return { enabled: false };

  scenes.forEach((scene) => {
    let frame = 0;
    let targetX = 72;
    let targetY = 45;

    const render = () => {
      frame = 0;
      scene.style.setProperty("--scene-x", `${targetX}%`);
      scene.style.setProperty("--scene-y", `${targetY}%`);
    };

    scene.addEventListener("pointermove", (event) => {
      const bounds = scene.getBoundingClientRect();
      targetX = Math.min(100, Math.max(0, ((event.clientX - bounds.left) / bounds.width) * 100));
      targetY = Math.min(100, Math.max(0, ((event.clientY - bounds.top) / bounds.height) * 100));
      if (!frame) frame = window.requestAnimationFrame(render);
    });

    scene.addEventListener("pointerenter", () => {
      scene.classList.add("is-scene-active");
      gsap?.to(scene, { "--scene-glow": 1, duration: 0.45, ease: "power2.out" });
    });

    scene.addEventListener("pointerleave", () => {
      scene.classList.remove("is-scene-active");
      targetX = 72;
      targetY = 45;
      render();
      gsap?.to(scene, { "--scene-glow": 0, duration: 0.55, ease: "power2.out" });
    });
  });

  return { enabled: true, scenes: scenes.length };
}
