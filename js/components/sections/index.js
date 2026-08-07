import { initCompareSection } from "./compare.js";
import { initDashboardSection } from "./dashboard.js?v=20260807-counter2";
import { initEndingSection } from "./ending.js";
import { initEvidenceSection } from "./evidence.js?v=20260807-refine";
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
