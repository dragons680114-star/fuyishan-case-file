import { APP_CONFIG } from "../core/config.js";
import { qs } from "../core/dom.js";

function getStoredTheme() {
  try {
    return window.localStorage.getItem(APP_CONFIG.storageKey);
  } catch {
    return null;
  }
}

function getPreferredTheme() {
  const storedTheme = getStoredTheme();
  if (storedTheme === "light" || storedTheme === "dark") return storedTheme;

  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function saveTheme(theme) {
  try {
    window.localStorage.setItem(APP_CONFIG.storageKey, theme);
  } catch {
    // 儲存空間不可用時仍維持本次工作階段的主題切換。
  }
}

function applyTheme(theme, toggleButton, icon) {
  const isLight = theme === "light";

  document.documentElement.dataset.theme = theme;
  toggleButton?.setAttribute("aria-pressed", String(isLight));
  toggleButton?.setAttribute("aria-label", isLight ? "切換至深色模式" : "切換至亮色模式");

  if (icon) {
    icon.classList.toggle("fa-moon", !isLight);
    icon.classList.toggle("fa-sun", isLight);
  }
}

// 主題模組提供明暗模式與系統偏好同步，外部不需知道儲存細節。
export function initTheme() {
  const toggleButton = qs("[data-theme-toggle]");
  const icon = qs("[data-theme-icon]");
  let currentTheme = getPreferredTheme();

  applyTheme(currentTheme, toggleButton, icon);

  toggleButton?.addEventListener("click", () => {
    currentTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(currentTheme, toggleButton, icon);
    saveTheme(currentTheme);
  });

  // 只有使用者尚未做過明確選擇時，才跟隨系統主題變化。
  const mediaQuery = window.matchMedia?.("(prefers-color-scheme: light)");
  mediaQuery?.addEventListener("change", (event) => {
    if (getStoredTheme()) return;
    currentTheme = event.matches ? "light" : "dark";
    applyTheme(currentTheme, toggleButton, icon);
  });
}
