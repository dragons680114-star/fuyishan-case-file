// 全域設定集中於此，避免元件散落硬編碼與彼此耦合。
export const APP_CONFIG = Object.freeze({
  storageKey: "interactive-web-framework-theme",
  loaderMinimumDuration: 650,
  transitionDuration: 360,
  progressUpdateEvent: "app:progress",
  readyEvent: "app:ready",
});
