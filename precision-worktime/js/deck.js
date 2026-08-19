const slides = [...document.querySelectorAll("[data-slide]")];
const indexLabel = document.querySelector("[data-index]");
const dots = document.querySelector("[data-dots]");
let activeIndex = 0;

// 以可重複使用的中文資料控制各頁互動，不把現場資料與文案硬寫在事件裡。
const choiceContent = {
  planning: {
    experience: { label: "經驗法則", title: "估算會累積成現場壓力。", copy: "估算誤差、排程延遲與產能浪費，常讓大家一直很忙，卻難以確認真正的改善點。" },
    data: { label: "數據基準", title: "先有可比較的基準，才談得上改善。", copy: "可追溯、可比較、可改善，是用標準工時支持排程與產能討論的共同起點。" },
  },
  formula: {
    observe: { title: "先把作業如實看清楚。", copy: "觀測時間是取得基礎資料的起點；它不是最後可直接拿來排程的答案。" },
    rating: { title: "用評比係數回到正常速度。", copy: "正常時間 ＝ 觀測時間 × 評比係數。評比係數將不同作業速度調整成一致基準。" },
    allowance: { title: "再把必要的寬放納入標準。", copy: "標準時間 ＝ 正常時間 ＋ 寬放時間，讓基準更貼近真實工作條件。" },
  },
  unit: {
    people: { title: "人員直接完成的動作。", copy: "方法補充 [I]：例如取料、定位、包裝、檢查等，可視為觀察與改善的基本作業單元。" },
    machine: { title: "設備正在加工或等待的時間。", copy: "方法補充 [I]：把設備運轉與人工動作拆開，能避免兩者混在同一個工時判斷裡。" },
    regular: { title: "每一循環都會重複出現的動作。", copy: "方法補充 [I]：規律動作適合建立基準，再用實際觀測確認是否穩定。" },
    intermittent: { title: "不是每一循環都出現的動作。", copy: "方法補充 [I]：間歇動作要標記觸發條件，避免被忽略或被平均得失去意義。" },
  },
  allow: {
    physical: { title: "將必要的生理需求納入考量。", copy: "方法補充 [I]：寬放需依工作特性與長期觀察設定，不能用單次觀察或個人感受直接決定。" },
    fatigue: { title: "讓疲勞因素被合理看見。", copy: "方法補充 [I]：工作姿勢、重複性與環境條件都可能影響疲勞，應在長期觀察中辨識。" },
    work: { title: "把工作本身的必要條件算清楚。", copy: "方法補充 [I]：等待、清掃、換線等是否納入，需先說明其發生條件與觀察依據。" },
  },
  abnormal: {
    wrong: { title: "把異常一起算進去。", copy: "這會讓標準工時灌水，也讓真正需要優先改善的設備問題失去焦點。" },
    right: { title: "異常獨立成改善項目。", copy: "設備故障應個別記錄、分析與改善；正常寬放不應承接可被改善的異常。" },
  },
};

const stepContent = {
  define: { title: "把一次作業的起點與終點說清楚。", copy: "方法補充 [I]：先界定作業範圍、投入物、產出物與判定完成的條件，才有一致的觀測對象。" },
  execute: { title: "依同一套方法重複執行。", copy: "方法補充 [I]：觀察前先確認人員、工具、材料與設備狀態，避免把作業差異誤判為人的速度差異。" },
  confirm: { title: "讓現場一起確認這是合理做法。", copy: "方法補充 [I]：由主管與作業者回看動作與條件，確認第一版 SOP 是否真的能在現場執行。" },
};

const speedContent = {
  80: { title: "80%：速度偏慢。", copy: "原檔以 80% 表示慢速範例；評比係數用於把不同觀測速度調整回共同的正常基準。" },
  100: { title: "100%：正常速度。", copy: "正常時間 ＝ 觀測時間 × 評比係數。評比的目的是建立公平基準，不是比較誰做得快。" },
  120: { title: "120%：速度偏快。", copy: "原檔以 120% 表示快速範例；不能因個別速度較快，就直接把該觀測值當成全線標準。" },
};

function renderDots() {
  dots.replaceChildren();
  slides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `前往第 ${index + 1} 頁`);
    dot.setAttribute("aria-current", String(index === activeIndex));
    dot.addEventListener("click", () => goTo(index));
    dots.append(dot);
  });
}

function goTo(index) {
  activeIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, position) => slide.classList.toggle("is-active", position === activeIndex));
  indexLabel.textContent = String(activeIndex + 1).padStart(2, "0");
  renderDots();
}

function selectChoice(button) {
  const group = button.dataset.choiceGroup;
  const content = choiceContent[group]?.[button.dataset.choice];
  if (!content) return;
  const slide = button.closest("[data-slide]");
  slide.querySelectorAll(`[data-choice-group="${group}"]`).forEach((item) => {
    const selected = item === button;
    item.classList.toggle("is-selected", selected);
    item.setAttribute("aria-selected", String(selected));
  });
  const panel = slide.querySelector(`[data-choice-panel="${group}"]`);
  panel.querySelector("[data-choice-title]").textContent = content.title;
  panel.querySelector("[data-choice-copy]").textContent = content.copy;
  const label = panel.querySelector(".statement__label");
  if (label && content.label) label.textContent = content.label;
}

document.querySelectorAll("[data-choice]").forEach((button) => button.addEventListener("click", () => selectChoice(button)));

document.querySelectorAll("[data-step]").forEach((button) => {
  button.addEventListener("click", () => {
    const slide = button.closest("[data-slide]");
    const content = stepContent[button.dataset.step];
    slide.querySelectorAll("[data-step]").forEach((item) => item.classList.toggle("is-selected", item === button));
    slide.querySelector("[data-step-title]").textContent = content.title;
    slide.querySelector("[data-step-copy]").textContent = content.copy;
  });
});

document.querySelectorAll("[data-speed]").forEach((button) => {
  button.addEventListener("click", () => {
    const slide = button.closest("[data-slide]");
    const content = speedContent[button.dataset.speed];
    slide.querySelectorAll("[data-speed]").forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-selected", String(selected));
    });
    slide.querySelector("[data-speed-title]").textContent = content.title;
    slide.querySelector("[data-speed-copy]").textContent = content.copy;
  });
});

document.querySelector("[data-check]").addEventListener("click", (event) => {
  event.currentTarget.textContent = "已記下三件起步行動 ✓";
  document.querySelector("[data-check-status]").textContent = "下一步：和主管選定一個瓶頸製程，約定第一次工作抽樣的時間。";
});

document.querySelectorAll("[data-next]").forEach((button) => button.addEventListener("click", () => goTo(activeIndex + 1)));
document.querySelectorAll("[data-prev]").forEach((button) => button.addEventListener("click", () => goTo(activeIndex - 1)));
document.querySelector("[data-restart]").addEventListener("click", () => goTo(0));
document.addEventListener("keydown", (event) => {
  if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); goTo(activeIndex + 1); }
  if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); goTo(activeIndex - 1); }
  if (event.key === "Home") { event.preventDefault(); goTo(0); }
  if (event.key === "End") { event.preventDefault(); goTo(slides.length - 1); }
});

renderDots();
