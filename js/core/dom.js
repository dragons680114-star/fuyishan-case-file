// DOM 小工具只負責查找與事件綁定，讓功能模組維持單一責任。
export function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

export function qsa(selector, scope = document) {
  return [...scope.querySelectorAll(selector)];
}

export function on(target, eventName, handler, options) {
  target?.addEventListener(eventName, handler, options);

  return () => target?.removeEventListener(eventName, handler, options);
}

export function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function isExternalUrl(url) {
  return url.origin !== window.location.origin;
}
