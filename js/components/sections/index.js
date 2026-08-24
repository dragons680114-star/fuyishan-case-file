import { initCompareSection } from "./compare.js";
import { initDashboardSection } from "./dashboard.js?v=20260824-counterfix2";
import { initEndingSection } from "./ending.js";
import { initEvidenceSection } from "./evidence.js?v=20260807-finalinteract";
import { initHeroSection } from "./hero.js";
import { initStorySection } from "./story.js";
import { initTimelineSection } from "./timeline.js?v=20260807-selective";

// Section registry 讓每個章節可獨立測試、替換與重用。
export function initSectionComponents() {
  const sections = [
    ["hero", initHeroSection],
    ["story", initStorySection],
    ["evidence", initEvidenceSection],
    ["compare", initCompareSection],
    ["timeline", initTimelineSection],
    ["dashboard", initDashboardSection],
    ["ending", initEndingSection],
  ];

  return sections.map(([name, initializer]) => {
    try {
      return initializer();
    } catch (error) {
      console.error(`[sections] ${name} 初始化失敗，保留 HTML 靜態內容。`, error);
      return { name, mode: "static", failed: true };
    }
  });
}
