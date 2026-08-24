# 本地互動依賴

這些檔案是網站核心動畫所需的固定版本，從 jsDelivr 下載後納入專案，讓 GSAP、ScrollTrigger、ScrollToPlugin 與 Lenis 不再依賴外部 CDN 才能啟動。

| 檔案 | 版本 | 來源 | 授權 |
| --- | --- | --- | --- |
| `gsap.min.js` | GSAP 3.12.5 | https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js | GreenSock Standard License |
| `ScrollTrigger.min.js` | GSAP 3.12.5 | https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js | GreenSock Standard License |
| `ScrollToPlugin.min.js` | GSAP 3.12.5 | https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollToPlugin.min.js | GreenSock Standard License |
| `lenis.min.js` | Lenis 1.1.20 | https://cdn.jsdelivr.net/npm/lenis@1.1.20/dist/lenis.min.js | MIT |

Font Awesome 已另行放在 `css/vendor/fontawesome/` 與 `css/vendor/webfonts/`，僅提供裝飾性圖示；網站執行時不需要連線到外部 CDN。
