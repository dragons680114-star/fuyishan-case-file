# Content Contract｜Markdown / PPT 接入規格

網站現在以語意化 HTML 作為內容層，GSAP 元件只讀取 `data-*` 屬性與既有文字，不應在動畫程式中生成案件文案。

## Section 掛載規則

每個 Section 必須具備：

```html
<section id="section-id" data-section="section-name" data-section-name>
  <!-- HTML 文案與資料 -->
</section>
```

對應的 JavaScript 放在 `js/components/sections/section-name.js`，只負責：

- 查找目前 section 內的節點。
- 建立 GSAP / ScrollTrigger 動畫。
- 讀取 HTML 已存在的 `data-target`、`data-parallax` 等設定。
- 在資料不存在時維持靜態可讀狀態。

## 數據規則

- 金額、百分比、天數、週轉率必須先從 Markdown 或 PPT 轉錄，再寫入 HTML。
- 來源簡報中的「預期」、「可能」、「目標」不能改寫成既定事實。
- Dashboard 的 counter 僅能動畫化既有 `data-target`，不可在 JavaScript 內新增數值。
- 比較條的寬度可透過 `style="--bar-scale: 72%"` 呈現來源數據，但旁邊必須保留可讀文字。

## 影像規則

- 任何背景圖都不可放入標題、數據、字幕、Logo 或其他必要文字。
- 影像僅作為氣氛與空間；所有訊息由 HTML 提供。
- Hero 與 Ending 使用 `[data-ai-background]` 掛載點，現有素材位於 `assets/background/hero-production.png` 與 `assets/background/ending-release.png`。
- Evidence 視覺可使用 `.evidence-visual--butter`、`.evidence-visual--packaging`、`.evidence-visual--ghost`，但新影像需放入 `assets/background/` 或 `assets/images/`，並於文件記錄來源。

## PPT 轉網站建議流程

1. 先抽取每張投影片的主張、數據、條件語氣與來源備註。
2. 依 Storyboard 合併重複內容，不照投影片版面搬運。
3. 把文字與數據放入 `index.html` 的對應 section。
4. 只在 section component 中加入互動，不把內容寫入動畫程式。
5. 以 Desktop、Tablet、Mobile 三個寬度檢查閱讀順序與 overflow。
