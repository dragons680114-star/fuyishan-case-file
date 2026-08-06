# 績效謎案｜福義軒資金失蹤事件簿

這是一個以 HTML5、CSS3 與原生 JavaScript 建立的互動式 storytelling 網站。網站把「千萬資金奪還」作戰計畫重新編排成長頁面敘事，不沿用投影片版面，也不把任何文案繪製進背景圖片。

## 開始使用

本專案不依賴打包器，直接使用瀏覽器即可開啟：

1. 雙擊專案根目錄的 `start-server.bat`。
2. 啟動檔會自動啟動本機伺服器並開啟瀏覽器。
3. 如果瀏覽器沒有自動開啟，手動輸入 `http://127.0.0.1:4173/index.html`。
4. 不要從聊天訊息的檔案預覽卡直接開啟首頁；那只是檔案連結，不會啟動本機伺服器。
5. 若要替換 AI 背景，將無文字的圖片放入 `assets/background/`，再在對應 HTML 元素上替換背景路徑。

> 不建議直接雙擊 `index.html`：ES Module 的 `import` 在 `file://` 模式常被瀏覽器的安全政策阻擋。若沒有 Python，也可以用 VS Code 的 Live Server 擴充功能提供 HTTP 預覽。

## 目前內容來源

首頁內容根據以下來源簡報重組：

`D:\吳博\智慧生產\115年\8月\千萬資金奪還」作戰計畫.pptx`

簡報中的數據在頁面中以 HTML 文字呈現；沒有自行補造人物、事件、數字或結論。Dashboard 的數值保留「來源簡報的預期戰果」語意，避免誤讀為已驗證結果。

## 專案結構

```text
.
├─ index.html                 # 網站唯一入口；包含所有 section 的語意化 HTML
├─ css/
│  ├─ main.css                # CSS 模組匯入口
│  ├─ base/                   # reset、design tokens、文字基礎
│  ├─ layout/                 # container、shell、section 共用版面
│  ├─ components/             # Hero、Story、Evidence、Compare 等視覺元件
│  └─ utilities/              # 無障礙、motion preference 等工具類別
├─ js/
│  ├─ app.js                  # 應用程式組裝入口
│  ├─ core/                   # 設定、DOM、外部依賴狀態
│  ├─ components/              # loading、theme、transition、section components
│  │  └─ sections/             # 每個 Section 的獨立互動模組
│  └─ features/               # Lenis、ScrollTrigger、Scroll Snap 等跨頁功能
├─ assets/
│  ├─ background/             # 無文字 2.5D AI 背景圖；各主要段落皆有蛋捲／餅乾食品廠景
│  ├─ images/                 # 一般內容圖片
│  ├─ icons/                  # 自訂 SVG / 圖示資產
│  ├─ fonts/                  # 本地字型（若日後需要離線部署）
│  ├─ audio/                  # 音效或環境聲
│  ├─ video/                  # 影片素材
│  └─ lottie/                 # Lottie JSON 動畫
├─ docs/
│  ├─ STORYBOARD.md           # 網站敘事與來源投影片的重組對照
│  ├─ CONTENT-CONTRACT.md     # 後續 Markdown / PPT 內容接入規格
│  └─ IMAGE-SOURCES.md        # 背景素材清單、用途與產製約束
└─ .gitignore                 # 編輯器、快取與本地設定忽略規則
```

## 互動與動畫

- GSAP：所有內容進場、計數器、比較條、背景 Parallax 與頁面轉場。
- ScrollTrigger：section reveal、視差與 timeline rail。
- Lenis：桌面 smooth scroll；使用者偏好 reduced motion 時停用。
- Scroll Snap：各主章節使用 `y proximity`，不強迫使用者跳頁。
- Progress Navigation：固定於頁面頂端，顯示整頁閱讀進度。
- Dark / Light Mode：主題 token 切換並記錄於 localStorage。
- Evidence Cards：線索卡可展開資料、滑鼠微視差與 3D tilt；三張證據圖加入 2.5D 擬人化角色，讓奶油、包材與死庫存更容易理解。
- Timeline Controls：三階段作戰計畫可點擊跳轉並標示目前階段。
- Hero Pointer Depth：桌面滑鼠移動會改變文字與背景的景深位置。
- Product Scene Motion：蛋捲與餅乾場景會使用 GSAP 做慢速推近、滑入分層與滑鼠靠近鏡頭效果，讓背景像紀錄片鏡頭。
- 2.5D Product Cast：六張主要場景以同一套擬人化蛋捲、餅乾、包材與經營者角色串起故事，數字與簡報內容仍保留為 HTML。
- RWD：Desktop、Tablet、Mobile 皆有獨立斷點與排版調整。

## 後續接入內容的原則

請優先更新 `index.html` 的內容區塊與 `docs/CONTENT-CONTRACT.md`，不要把文案或數字硬編進圖片、Canvas 或動畫程式。背景圖片只負責氣氛與空間，所有可讀資訊必須保留在 HTML，確保 SEO、無障礙與日後 Markdown / PPT 轉換流程可維護。
