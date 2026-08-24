// 透過資料屬性提供可選的 Scroll Snap 區塊，不強迫任何頁面採用固定分頁。
export function initScrollSnap() {
  document.documentElement.dataset.scrollSnap = "proximity";
  return { mode: "css-proximity" };
}
