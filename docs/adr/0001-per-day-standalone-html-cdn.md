# ADR 0001：每天獨立、純 HTML + CDN、Git + GitHub Pages

- 狀態：已採用
- 日期：2026-08-04
- 修訂：2026-08-17（第 7 條改寫，見下方「2026-08-17 修訂：Vue 從例外變預設」）

## 背景

鐵人賽要連續 30 天、每天一篇文章 + 一個實作 demo。作者對動畫是完全新手，主力 Vue，最高優先是「準時發文、不斷賽」。需要決定檔案結構與 demo 的執行 / 託管方式。

## 決策

1. **每天一個獨立小專案，純 HTML + CDN**：每個 `days/day-XX-slug/` 夾有自己的 `index.html`，用 `<script src="cdn…gsap">` 引入，Live Server 開就跑。不建共用的 Vite/Vue 專案。
2. **文章原稿與 code 同夾**：`article.md` 跟 demo 放在同一個 day 夾。
3. **命名 `day-XX-slug`、天數補零**。
4. **每天完全自足**：不抽共用 `/assets`，每天自己一份樣式。
5. **Git repo + GitHub Pages**：版本控制兼存稿備份；demo 直接用 Pages 託管，文章貼連結。
6. **樣式預設原生 CSS**：demo 的靜態外觀預設用原生 CSS。版面較複雜的天（如 Day 17 捲動敘事、Day 28 跑馬燈）可選用 **Tailwind CDN**（一行引入、免 build）。不建 Tailwind build。
7. **動畫一律 vanilla GSAP，demo 的控制介面用 Vue CDN**：GSAP / Three.js 的程式碼本身永遠是 vanilla，不包成 composable、不藏進元件，讀者複製貼上就能用在任何專案。但 demo 頁面上的控制項（模式切換鈕、滑桿、即時數值、程式碼對照區）用 Vue 3 CDN 的 `createApp` + `ref` 寫。**例外**：Day 21 的 Vue 不是工具而是主題本身（`gsap.context()` + `contextSafe()` + `matchMedia` 講的就是動畫在元件生命週期裡怎麼管），那天會用到 `onMounted` / `onUnmounted` 和元件的 mount / unmount 切換。

## 為什麼不選共用 Vite/Vue 專案

Vite 多入口設定、build 失敗、路徑問題對完全新手是致命的坑，一卡就可能拖累當天發文。純 HTML/CDN「能跑」的確定性遠比「工程漂亮」重要。這也呼應內容定位——每天技術點各自獨立，檔案結構與內容結構一致。

## 取捨與後果

- ✅ 零建置、每天可獨立跑 / 獨立分享、對小白最無痛。
- ✅ GitHub Pages 免費託管所有 demo，省下重複複製到 CodePen；commit 紀錄本身是求職佐證。
- ⚠️ 每天樣式有少量重複（可接受，換來獨立性）。
- ⚠️ Three.js（Day 23-27）需用 CDN + import map，稍微多一點設定，但仍不需要 build 工具。
- ⚠️ 需具備基本 `git add/commit/push`——對小白有門檻，但屬轉職必備，早練有益。
- ✅ 原生 CSS 為主，是因為文章在教「動畫」不是排版：`.box { width: 100px }` 比一串 utility class 更能讓讀者聚焦動畫本身。Tailwind 只在版面真的複雜的天才登場。

## 2026-08-17 修訂：Vue 從例外變預設

原本第 7 條寫的是「預設不引入 Vue，只有 Day 21 例外」。實際盤點 demo 後發現，**Day 4 到 Day 10 連續七天都用了 Vue**，只有 Day 1-3 是純 vanilla。規則從第四天就沒在遵守了。

會偏離不是懶惰，是這些 demo 的性質變了。Day 1-3 的 demo 是「看方塊動」，沒有互動；Day 4 之後幾乎每天都要切換模式、拖滑桿、即時顯示參數、同步顯示對應的程式碼片段。這些用 vanilla 寫會多出大量 `querySelector` 和手動 `textContent` 的雜訊，那些雜訊跟當天要教的 GSAP 毫無關係，卻會佔掉 `main.js` 一半的篇幅，讀者打開檔案第一眼看到的是 DOM 操作而不是動畫。

因此把規則改成描述事實：**動畫是 vanilla，介面是 Vue**。這條界線比原本的「預設不用 Vue」更好守，也更誠實。

- ✅ 讀者從 `main.js` 抄走的 GSAP 程式碼永遠是 vanilla，不綁框架。
- ✅ 控制介面的程式碼量降低，當天的技術重點在檔案裡佔比更高。
- ⚠️ 讀者需要看得懂一點 `ref()` 和 `v-model`。可接受：那些程式碼不是教學重點，看不懂也不影響學 GSAP。
- ⚠️ Day 21 的 Vue 意義不同（是主題不是工具），寫那天時要在文章裡點明差別，否則讀者會問「Vue 前面早就用過了，為什麼這天叫 Vue 專題」。
