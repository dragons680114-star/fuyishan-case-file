(() => {
  "use strict";

  const slides = [...document.querySelectorAll(".slide")];
  const pageDots = document.querySelector(".page-dots");
  const pageLabel = document.querySelector("#current-page");
  // 第 2 頁的實測題目與結果，均來自使用者提供的簡報資料。[U]
  const answers = [
    { code: "Q1", title: "想送長輩的傳統台式伴手禮餅乾，有推薦的品牌嗎？", recommendations: "郭元益、一福堂、俊美、連得堂、微熱山丘" },
    { code: "Q2", title: "有沒有包裝精緻、適合送禮的蛋捲品牌可以推薦？", recommendations: "海邊走走、竹香手工蛋捲、津氏手作蛋捲" },
    { code: "Q3", title: "想找少油少糖、口感比較健康的傳統餅乾零食，有推薦的品牌嗎？", recommendations: "竹香手工蛋捲、日韓系蘇打餅乾" }
  ];
  const layers = [
    ["找得到", "網站與產品頁能被搜尋系統順利讀取；這是最基本的存在感。"],
    ["資料夠多", "不只一頁產品名稱，而是有故事、用途、常見問題與可理解的資訊。"],
    ["對題目有關", "內容要能對上顧客的問題，例如：送誰、何時送、想要什麼特色。"],
    ["別人也信", "媒體、通路、顧客與創作者的自然提及，會讓品牌訊號更可信。"]
  ];
  // GEO 的白話補充，協助報告者依序解釋兩個概念。[I]
  const geoDetails = [
    ["SEO｜讓人找得到你", "把官網與產品頁整理清楚，讓搜尋引擎知道：你是誰、賣什麼、在哪裡可以找到你。"],
    ["GEO｜讓 AI 說得出你", "除了找得到，還要讓內容能回答問題：適合誰、什麼情境、為何值得選；再加上外部提及，AI 才更有線索整理進答案。"]
  ];
  // 第 8 頁的例子依使用者提供之 GEO 四層圖解整理。[U]
  const signalDetails = [
    ["對應 ① 存在性 ＋ ③ 語意相關性", "品牌和情境，要在網站上一起被說清楚。", "例如把「百年老字號」與「年節送禮」放在同一段品牌介紹中，AI 才容易把品牌連到送禮問題。"],
    ["對應 ③ 語意相關性", "商品的形式，要能直接回答顧客正在問的問題。", "例如禮盒化程度高、送禮感強，就能直接對應「送長輩」或「精緻伴手禮」的提問。"],
    ["對應 ② 廣度與可信度 ＋ ④ 權威信號", "被不同來源自然提起，訊號才會更完整。", "例如 PTT、部落格、媒體等獨立來源多次提及；若又被高權威來源引用，可信度會更高。"]
  ];
  // 第 10 頁以原始簡報的改善方向，整理成不涉及健康宣稱的說明例子。[U]
  const checkDetails = [
    ["為什麼會影響 AI？", "沒有明確禮盒資訊，就很難被連到「送禮」問題。", "如果產品名稱、照片與頁面只呈現單包零食，AI 很難判斷它是否適合當作精緻伴手禮。", "可補上：禮盒名稱、內容物、送禮對象與使用情境。"],
    ["為什麼會影響 AI？", "產品配方與健康說法，必須前後一致。", "若產品資訊有油脂、糖等配方，就不宜只用模糊的「健康」形容；AI 會依照可讀到的具體資料整理答案。", "可補上：如實標示成分與份量，並在確認後再描述適合的飲食情境。"],
    ["為什麼會影響 AI？", "通路名稱、規格與價格若難比較，顧客與 AI 都難理解。", "同品項在不同通路若名稱、容量或售價說法不一致，推薦時就缺少清楚依據。", "可補上：統一產品名稱、規格、建議售價與各通路說明。"]
  ];
  // 第 11 頁：把三種消費者提問轉成網站內容可回答的方向。[I]
  const scenarioQuestionDetails = [
    ["AI 需要看到", "送禮對象、禮盒內容與適合場合。", "不要只寫「蛋捲好吃」；可說明它是否有禮盒、適合送給誰、何時送最合適。"],
    ["AI 需要看到", "包裝形式、內容物與精緻感的具體描述。", "可以清楚列出禮盒外觀、口味組合、份數與送禮場合，讓「精緻」不只是形容詞。"],
    ["AI 需要看到", "可核對的成分、份量與產品特色。", "不要直接宣稱健康；應依實際資料寫明成分與規格，讓顧客自行判斷是否符合自己的飲食需求。"]
  ];
  // 第 13 頁：把行動方向落成可由團隊自行填入確認資料的工作方式。[I]
  const actionDetails = [
    ["立即做法", "先為每一項產品建立同一份固定欄位。", "欄位可先包含：適合誰、適合什麼場合、產品特色、規格與可購買的通路；依既有確認資料逐一填寫。"],
    ["立即做法", "用真實體驗，讓第三方幫忙補足信任訊號。", "可先整理一頁體驗重點，邀請適合的媒體、部落客或創作者自由試吃與分享；不要求未確認或誇大的說法。"],
    ["立即做法", "建立一張全通路對照表，再逐頁校對。", "針對同一產品比對：名稱、照片、規格、售價、庫存與產品定位；不同通路若有差異，要清楚說明原因。"]
  ];
  // 第 14 頁：示範可由團隊依真實產品資料改寫的內容開頭。[I]
  const contentExamples = [
    ["〈送長輩的伴手禮，怎麼挑才體面？〉", "「拜訪長輩前，先想想：這份禮是否方便分享、包裝是否得體、口味是否容易入口？」"],
    ["〈精緻蛋捲禮盒，挑選時先看這三件事〉", "「送禮前先確認：禮盒外觀、口味組合與內容份數；把選擇理由說清楚，送的人更安心。」"],
    ["〈想吃得較清爽？先從產品標示看起〉", "「每個人的飲食需求不同；購買前可先看成分、規格與份量，再依自己的需要選擇。」"]
  ];
  let current = 0;

  slides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `前往第 ${index + 1} 頁`);
    dot.addEventListener("click", () => showSlide(index));
    pageDots.append(dot);
  });
  const dots = [...pageDots.querySelectorAll("button")];

  function showSlide(next) {
    current = (next + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      const active = index === current;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    dots.forEach((dot, index) => dot.classList.toggle("is-current", index === current));
    pageLabel.textContent = String(current + 1).padStart(2, "0");
  }

  document.querySelectorAll("[data-direction]").forEach(button => {
    button.addEventListener("click", () => showSlide(current + (button.dataset.direction === "next" ? 1 : -1)));
  });
  document.querySelectorAll("[data-go]").forEach(button => button.addEventListener("click", () => showSlide(Number(button.dataset.go))));

  document.querySelectorAll(".evidence-tab").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.question);
      document.querySelectorAll(".evidence-tab").forEach(tab => {
        const selected = tab === button;
        tab.classList.toggle("is-selected", selected);
        tab.setAttribute("aria-selected", String(selected));
      });
      const answer = answers[index];
      document.querySelector("#question-code").textContent = answer.code;
      document.querySelector("#question-title").textContent = answer.title;
      document.querySelector("#question-recommendations").textContent = answer.recommendations;
      const panel = document.querySelector(".evidence-panel");
      panel.classList.remove("is-replaying");
      void panel.offsetWidth;
      panel.classList.add("is-replaying");
    });
  });

  document.querySelectorAll(".layer-button").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.layer);
      document.querySelectorAll(".layer-button").forEach(item => item.classList.toggle("is-selected", item === button));
      document.querySelector("#layer-title").textContent = layers[index][0];
      document.querySelector("#layer-description").textContent = layers[index][1];
    });
  });

  // 第 4 頁：需要時才展開競品案例，讓主畫面維持聚焦。[U]
  const compareTrigger = document.querySelector(".compare-trigger");
  const compareExample = document.querySelector(".compare-example");
  if (compareTrigger && compareExample) {
    compareTrigger.addEventListener("click", () => {
      const isOpen = compareExample.classList.toggle("is-open");
      compareTrigger.setAttribute("aria-expanded", String(isOpen));
      compareExample.setAttribute("aria-hidden", String(!isOpen));
    });
  }

  document.querySelectorAll(".geo-pill").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.geoDetail);
      document.querySelectorAll(".geo-pill").forEach(item => {
        const selected = item === button;
        item.classList.toggle("is-selected", selected);
        item.setAttribute("aria-selected", String(selected));
      });
      document.querySelector("#geo-detail-title").textContent = geoDetails[index][0];
      document.querySelector("#geo-detail-text").textContent = geoDetails[index][1];
      const detail = document.querySelector(".geo-detail");
      detail.classList.remove("is-replaying");
      void detail.offsetWidth;
      detail.classList.add("is-replaying");
    });
  });

  document.querySelectorAll(".signal-button").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.signal);
      document.querySelectorAll(".signal-button").forEach(item => {
        const selected = item === button;
        item.classList.toggle("is-selected", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      const detail = signalDetails[index];
      document.querySelector("#signal-layer").textContent = detail[0];
      document.querySelector("#signal-title").textContent = detail[1];
      document.querySelector("#signal-example").textContent = detail[2];
      const panel = document.querySelector(".signal-detail");
      panel.classList.remove("is-replaying");
      void panel.offsetWidth;
      panel.classList.add("is-replaying");
    });
  });

  document.querySelectorAll(".check-button").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.check);
      document.querySelectorAll(".check-button").forEach(item => {
        const selected = item === button;
        item.classList.toggle("is-selected", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      const detail = checkDetails[index];
      document.querySelector("#check-impact").textContent = detail[0];
      document.querySelector("#check-title").textContent = detail[1];
      document.querySelector("#check-example").textContent = detail[2];
      document.querySelector("#check-action").textContent = detail[3];
      const panel = document.querySelector(".check-detail");
      panel.classList.remove("is-replaying");
      void panel.offsetWidth;
      panel.classList.add("is-replaying");
    });
  });

  document.querySelectorAll(".scenario-question").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.scenarioQuestion);
      document.querySelectorAll(".scenario-question").forEach(item => {
        const selected = item === button;
        item.classList.toggle("is-selected", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      const detail = scenarioQuestionDetails[index];
      document.querySelector("#scenario-question-label").textContent = detail[0];
      document.querySelector("#scenario-question-title").textContent = detail[1];
      document.querySelector("#scenario-question-example").textContent = detail[2];
      const panel = document.querySelector(".scenario-question-detail");
      panel.classList.remove("is-replaying");
      void panel.offsetWidth;
      panel.classList.add("is-replaying");
    });
  });

  document.querySelectorAll(".action-button").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.action);
      document.querySelectorAll(".action-button").forEach(item => {
        const selected = item === button;
        item.classList.toggle("is-selected", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      const detail = actionDetails[index];
      document.querySelector("#action-step").textContent = detail[0];
      document.querySelector("#action-title").textContent = detail[1];
      document.querySelector("#action-example").textContent = detail[2];
      const panel = document.querySelector(".action-detail");
      panel.classList.remove("is-replaying");
      void panel.offsetWidth;
      panel.classList.add("is-replaying");
    });
  });

  document.querySelectorAll(".content-example-button").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.contentExample);
      document.querySelectorAll(".content-example-button").forEach(item => {
        const selected = item === button;
        item.classList.toggle("is-selected", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      const example = contentExamples[index];
      document.querySelector("#article-example").textContent = example[0];
      document.querySelector("#post-example").textContent = example[1];
      const panel = document.querySelector(".content-example-detail");
      panel.classList.remove("is-replaying");
      void panel.offsetWidth;
      panel.classList.add("is-replaying");
    });
  });

  document.addEventListener("keydown", event => {
    if (event.target.matches("button")) return;
    if (["ArrowRight", " ", "PageDown"].includes(event.key)) { event.preventDefault(); showSlide(current + 1); }
    if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); showSlide(current - 1); }
    if (event.key === "Home") { event.preventDefault(); showSlide(0); }
    if (event.key === "End") { event.preventDefault(); showSlide(slides.length - 1); }
  });

  document.querySelector("[data-fullscreen]").addEventListener("click", async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch (_) { /* 部分瀏覽器或內嵌檢視器可能不允許全螢幕。 */ }
  });
  showSlide(0);
})();
