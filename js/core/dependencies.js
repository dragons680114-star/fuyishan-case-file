// 讀取外部工具狀態，所有功能模組都能在 CDN 失效時安全降級。
export function getDependencies() {
  return Object.freeze({
    gsap: window.gsap ?? null,
    scrollTrigger: window.ScrollTrigger ?? null,
    scrollTo: window.ScrollToPlugin ?? null,
    lenis: window.Lenis ?? null,
    fontAwesome: Boolean(document.querySelector(".fa-solid, .fa-regular, .fa-brands")),
  });
}

export function publishDependencyStatus() {
  const dependencies = getDependencies();
  const available = [dependencies.gsap, dependencies.scrollTrigger, dependencies.lenis].filter(Boolean).length;

  if (dependencies.gsap) {
    const plugins = [dependencies.scrollTrigger, dependencies.scrollTo].filter(Boolean);
    if (plugins.length) dependencies.gsap.registerPlugin(...plugins);
  }

  document.documentElement.dataset.animationRuntime = available === 3 ? "enhanced" : "native";

  return dependencies;
}
