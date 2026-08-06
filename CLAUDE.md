# CLAUDE.md｜iThome 鐵人賽 2026（GSAP / Three.js 動畫養成）

30 天動畫技術系列：每天一篇文章（`article.md`）＋一個能跑的 demo。最高優先是「準時發文、不斷賽」。

## 指路表（細節都在別的檔，這裡只指路，不重抄）

| 想知道什麼 | 看這個檔 |
| --- | --- |
| 30 天規劃、每天主題與取捨邏輯 | `30days.md` |
| 資料夾慣例、命名、commit 訊息、怎麼跑 demo | `README.md` |
| 為什麼這樣設計（純 HTML+CDN、每天自足） | `docs/adr/0001-per-day-standalone-html-cdn.md` |
| 文章骨架（每段附提示） | `days/_template/article.md` |

## 分工與硬規則

- **Git 一律使用者本人操作**（add / commit / push / branch 等）。要 commit 時把指令和 commit 訊息寫在回覆裡給他貼，不要代跑。詳見記憶 `git-user-does-it`。
- **分工**：`index.html` / `main.js` / `style.css` 和 `article.md` 由我起草 → 使用者審 → 使用者自己貼去 iThome、自己 commit。
- **宣告完成前先驗證**：demo 至少確認能用 Live Server 打開、該動的東西真的會動。無法驗證就明說「未實測」，並列出使用者該自己檢查什麼。
- **不確定就查，查不到就標註**，不要編造 GSAP / Three.js 的 API、參數、檔名。

## 開新一天的必問清單（開資料夾前，先問使用者這 4 題）

1. **主題 slug**：`day-XX-slug` 的 slug 要用什麼？
2. **demo 驗收點**：這天要讓讀者「看到什麼在動」才算成功？
3. **要不要破預設**：預設原生 CSS + vanilla JS。這天需不需要 Tailwind CDN 或 Vue？（例：Day 14、18、24）
4. **跟前一天怎麼接**：前言要複習什麼、小結預告要接到哪裡？

## 寫文章 SOP（一整天流程）

1. **對答案**：先跑完上面的必問清單。
2. **做 demo**：複製 `days/_template/` → 改名 `day-XX-slug` → 寫 demo → Live Server 驗過。
3. **寫稿**：照 `_template/article.md` 的五段結構（前言 → 概念是什麼 → 怎麼做 → 線上 demo → 小結）寫，遇到小白會踩的地方順手標 `🕳️ 小提醒`。
4. **自檢**：五段齊全、語氣對、一次只主打一個重點、demo 連結格式正確。
5. **交件**：給使用者審 → 他貼文、他 commit。

## 語氣規則

**基準：照 `days/day-01-hello-box/article.md` 和 `days/day-02-to-from-set/article.md` 的口吻寫**（這兩篇是語氣範本，模仿它們最準）。另加 4 條明文：

1. **固定五段結構**（同上）。
2. **第一人稱、口語、可用顏文字**（哈囉開場、對照表收尾那種親切感）。
3. **一次只主打一個重點**，其他屬性 / 用法留給後面的天，別一篇塞爆。
4. **結尾預告寫軟**，不寫死篇名，避免之後調順序打臉。

> emoji / 顏文字**每段最多 1-2 個**。這種語氣模仿最容易用力過猛變浮誇，寧可少不要多。
