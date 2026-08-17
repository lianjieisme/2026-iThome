# ADR 0001：每天獨立、純 HTML + CDN、Git + GitHub Pages

- 狀態：已採用
- 日期：2026-08-04

## 背景

鐵人賽要連續 30 天、每天一篇文章 + 一個實作 demo。作者對動畫是完全新手，主力 Vue，最高優先是「準時發文、不斷賽」。需要決定檔案結構與 demo 的執行 / 託管方式。

## 決策

1. **每天一個獨立小專案，純 HTML + CDN**：每個 `days/day-XX-slug/` 夾有自己的 `index.html`，用 `<script src="cdn…gsap">` 引入，Live Server 開就跑。不建共用的 Vite/Vue 專案。
2. **文章原稿與 code 同夾**：`article.md` 跟 demo 放在同一個 day 夾。
3. **命名 `day-XX-slug`、天數補零**。
4. **每天完全自足**：不抽共用 `/assets`，每天自己一份樣式。
5. **Git repo + GitHub Pages**：版本控制兼存稿備份；demo 直接用 Pages 託管，文章貼連結。
6. **樣式預設原生 CSS**：demo 的靜態外觀預設用原生 CSS。版面較複雜的天（如 Day 16 捲動敘事、Day 28 跑馬燈）可選用 **Tailwind CDN**（一行引入、免 build）。不建 Tailwind build。
7. **預設不用框架（vanilla JS）**：GSAP / Three.js 皆為 vanilla，預設不引入 Vue/Vite。**例外**：Day 20（`gsap.context()` + `contextSafe()` + `matchMedia`）主題本身就是「動畫在框架元件生命週期中正確清理」，該天（可能加 Day 24 Three.js 整合）用小型 Vue 環境示範，這是履歷差異化亮點。

## 為什麼不選共用 Vite/Vue 專案

Vite 多入口設定、build 失敗、路徑問題對完全新手是致命的坑，一卡就可能拖累當天發文。純 HTML/CDN「能跑」的確定性遠比「工程漂亮」重要。這也呼應內容定位——每天技術點各自獨立，檔案結構與內容結構一致。

## 取捨與後果

- ✅ 零建置、每天可獨立跑 / 獨立分享、對小白最無痛。
- ✅ GitHub Pages 免費託管所有 demo，省下重複複製到 CodePen；commit 紀錄本身是求職佐證。
- ⚠️ 每天樣式有少量重複（可接受，換來獨立性）。
- ⚠️ Three.js（Day 22-26）需用 CDN + import map，稍微多一點設定，但仍不需要 build 工具。
- ⚠️ 需具備基本 `git add/commit/push`——對小白有門檻，但屬轉職必備，早練有益。
- ✅ 原生 CSS / vanilla 為主，是因為文章在教「動畫」不是排版或框架：`.box { width: 100px }` 比一串 utility class 或元件生命週期更能讓讀者聚焦動畫本身。Tailwind / Vue 只在「該天主題真的需要」時才登場。
