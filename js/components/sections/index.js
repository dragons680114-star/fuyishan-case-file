import { initCompareSection } from "./compare.js";
import { initDashboardSection } from "./dashboard.js";
import { initEndingSection } from "./ending.js";
import { initEvidenceSection } from "./evidence.js";
import { initHeroSection } from "./hero.js";
import { initStorySection } from "./story.js";
import { initTimelineSection } from "./timeline.js";

// Section registry 讓每個章節可獨立測試、替換與重用。
export function initSectionComponents() {
  return [
    initHeroSection(),
    initStorySection(),
    initEvidenceSection(),
    initCompareSection(),
    initTimelineSection(),
    initDashboardSection(),
    initEndingSection(),
  ];
}
