# Image Sources｜網站背景素材

這批背景圖使用 Codex 內建 image generation 產製，採用同一套「芝麻蛋捲金色＋烘焙餅乾暖色＋食品廠冷鋼」的 2.5D 擬人化電影感工業敘事方向。所有文字、數據與標題都保留在 HTML，圖片本身不包含可讀文字、Logo、UI 或水印。

## 已接入素材

| 檔案 | 使用位置 | 視覺任務 |
| --- | --- | --- |
| `assets/background/hero-eggroll-cookie-2p5d.webp` | Hero | 2.5D 蛋捲偵探與餅乾角色站在烤箱與產線旁，左側留白承接 HTML 標題 |
| `assets/background/evidence-butter.webp` | Evidence / Clue 01 | 冷藏庫中的奶油與高價原料凍結感 |
| `assets/background/evidence-packaging.webp` | Evidence / Clue 02 | 少量外箱與大量內袋的快慢失同步 |
| `assets/background/evidence-ghost-inventory.webp` | Evidence / Clue 03 | 深倉、長尾、幽靈庫存的空間感 |
| `assets/background/character-butter-detective.webp` | Evidence / Clue 01 角色層 | 2.5D 奶油偵探，將高價原料與凍結資金具象化 |
| `assets/background/character-packaging-race.webp` | Evidence / Clue 02 角色層 | 2.5D 快跑外箱與慢走內袋，將週轉落差具象化 |
| `assets/background/character-ghost-inventory.webp` | Evidence / Clue 03 角色層 | 2.5D 幽靈包材，將長尾庫存與空間代價具象化 |
| `assets/background/story-eggroll-cookie-line-2p5d.webp` | Story | 2.5D 蛋捲與餅乾食品廠員工在冷卻線上協作 |
| `assets/background/compare-eggroll-cookie-inventory-2p5d.webp` | Compare | 2.5D 成品角色快速流動，包材角色在倉庫裡停滯 |
| `assets/background/timeline-eggroll-cookie-packaging-2p5d.webp` | Timeline | 2.5D 蛋捲、餅乾與包裝角色在掃描與裝箱線同步交接 |
| `assets/background/dashboard-eggroll-cookie-factory-2p5d.webp` | Dashboard | 2.5D 經營者觀察蛋捲與餅乾生產現場，回到管理決策 |
| `assets/background/ending-eggroll-cookie-dispatch-2p5d.webp` | Ending | 2.5D 蛋捲與餅乾角色推著成品走向出貨，資金流重新向前 |

## Prompt 共通約束

- cinematic industrial editorial still
- deep navy shadow with restrained warm amber light
- wide horizontal composition with negative space for HTML overlay
- no text, no labels, no logos, no signs, no watermark, no UI, no numbers
- realistic material texture and premium website background quality
- recognizable sesame egg rolls and round baked cookies in real food-factory contexts
- premium 2.5D clay-and-paper depth with expressive anthropomorphic food characters

## 2.5D 角色與場景素材約束

- 角色只負責視覺隱喻，不承載任何數字、結論或可讀資料。
- 角色採用紙材／黏土般的 2.5D 景深，維持食品工廠的冷色與暖色對比。
- 六個主要食品廠背景使用同一套角色比例、材質與光線，確保滾動時像同一部互動動畫。
- 證據卡仍由 GSAP 做進場、視差與微幅 3D tilt；手機與 reduced-motion 模式不依賴滑鼠互動。

## 產製方式

使用內建 `image_gen` 工具模式生成後，將選定檔案複製到專案 `assets/background/`；未使用 CLI fallback，也沒有修改原始 PPT 或把文字繪製進圖片。
