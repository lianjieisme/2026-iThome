# iThome 鐵人賽 30 天規劃：GSAP / Three.js 動畫技術養成

> 定位：純技術導向，不臨摹特定站台設計，每天聚焦一個明確的技術點。
> 讀者假設：對動畫「完全新手」也能跟上——Day 1 從零起跑（GSAP 是什麼、怎麼裝、讓一個方塊動起來）。
> 目標：GSAP 深度優先（求職 JD 的必要門檻），Three.js 深度其次（agency 差異化亮點）。
> 求職方向：動畫／互動／創意類前端（agency 或品牌官網）。
> 每日時間預算：2-3 小時（20-30 分鐘研究 + 80-100 分鐘實作 + 40-50 分鐘寫文章）。

---

## 開篇（Day 1）

| Day | 主題                          | 內容重點                                                         |
| --- | ----------------------------- | -------------------------------------------------------------- |
| 1   | GSAP 是什麼 + 第一個會動的東西 | 動畫在做什麼、GSAP 解決什麼問題、如何安裝（CDN / npm）、「Hello Box」讓方塊從左移到右，先拿到「它真的動了」的成就感 |

## Phase 1｜GSAP 核心基礎（Day 2-9）

| Day | 主題                                | 內容重點                                                       |
| --- | ----------------------------------- | -------------------------------------------------------------- |
| 2   | `.to()` / `.from()` / `.set()` 基礎 | 三種基礎方法的差異，動畫地基                                   |
| 3   | Easing 視覺化比較                   | 內建 ease 家族（linear、power、elastic、bounce、back）並排比較 |
| 4   | Stagger 群組動畫                    | 數字型 stagger、`from: "center"` / `"edges"`、grid stagger     |
| 5   | Timeline 串接 + position parameter  | `.timeline()`、`"-=0.3"` 等時間重疊語法                        |
| 6   | Hover 互動基礎                      | 使用者觸發動畫，而非自動播放                                   |
| 7   | Magnetic 滑鼠跟隨                   | `gsap.quickTo()`，高頻率更新動畫的效能寫法                     |
| 8   | 文字逐字進場                        | JS 拆字 + stagger，打字機/逐字浮現效果原理                     |
| 9   | 自訂 easing（CustomEase 外掛）      | cubic-bezier 手感控制                                          |

## Phase 2｜GSAP 進階控制 + ScrollTrigger + SVG（Day 10-20）

| Day | 主題                                | 內容重點                                                        |
| --- | ----------------------------------- | --------------------------------------------------------------- |
| 10  | Timeline 控制方法與 callback        | `play/pause/reverse/timeScale/label`，做一個可控制的動畫播放器  |
| 11  | ScrollTrigger 基礎                  | `trigger`、`start`、`end`、`toggleActions`                      |
| 12  | ScrollTrigger 進階：pin + scrub     | 捲動進度綁定動畫進度                                            |
| 13  | ScrollTrigger batch + refresh 陷阱  | 多元素處理、動態內容高度重算                                    |
| 14  | ScrollTrigger 實戰：捲動敘事區塊    | 做一段完整的 scroll-driven 敘事（pin + scrub + 段落接力），可直接搬進 portfolio |
| 15  | SVG 畫線動畫（搭 GSAP）             | `stroke-dasharray` + `stroke-dashoffset`，捲動時線條逐漸畫出——GSAP/ScrollTrigger 的好夥伴 |
| 16  | GSAP 外掛速覽 I：Draggable          | 拖曳互動 + 慣性                                                 |
| 17  | GSAP 外掛速覽 II：Flip + MotionPath | 版面切換動畫、沿 SVG 路徑移動                                   |
| 18  | `gsap.context()` + `matchMedia`     | Vue 專案中動畫的正確清理與 RWD 響應式寫法                       |
| 19  | GSAP vs Anime.js 選型比較           | 同效果雙套件實作，語法/檔案大小/使用情境對照                    |
| 20  | 效能與無障礙                        | `will-change`、transform/opacity only、`prefers-reduced-motion` |

## Phase 3｜Three.js 深度線（Day 21-26）

> 定位：非 GSAP 的部分只攻「一個」典範學到底。選 Three.js——3D 在 agency 是真差異化，比 Canvas/Pixi 更有「哇」效果。

| Day | 主題                      | 內容重點                                                    |
| --- | ------------------------- | ----------------------------------------------------------- |
| 21  | Three.js 場景暖身         | scene / camera / renderer，3D 世界的「舞台」概念，跑出空場景 |
| 22  | 基礎幾何體與材質          | `BoxGeometry`/`SphereGeometry`，放進第一個看得到的物體      |
| 23  | 燈光與陰影                | 小白最常「東西全黑」的坑，單獨一天講清楚光源與陰影          |
| 24  | Three.js + GSAP 整合      | 用剛學的 GSAP 控制 3D 物件位置/旋轉——履歷差異化亮點         |
| 25  | 滑鼠互動（Raycaster）     | 偵測 hover 物件，讓 3D 可互動                               |
| 26  | 小整合：可互動 3D 場景    | 自己拼一個小場景（GSAP + Three.js），驗收所學 + portfolio 素材 |

## Phase 4｜收尾（Day 27-30）

> Day 27-28 是彈性日：主要當「補進度 / 休息」的斷賽保險；若進度正常，就寫下面預排的備用主題，不浪費也不會臨時對著空白發呆。

| Day | 主題                          | 內容重點                                                     |
| --- | ----------------------------- | ------------------------------------------------------------ |
| 27  | 彈性日 / Buffer ①            | 落後就補進度 / 休息。進度正常則寫備用主題：**絲滑平滑捲動**（Lenis + GSAP，做整頁滑順捲動的 agency 招牌手感；避開付費的 ScrollSmoother） |
| 28  | 彈性日 / Buffer ②            | 同上。進度正常則寫備用主題：**無縫跑馬燈**（文字/logo 橫向無限循環，接縫看不出來，agency 網站常見） |
| 29  | 小白踩坑大全                  | 30 天遇過的坑總整理：裝套件失敗、路徑錯、Three.js 東西全黑、忘了清 event listener / 動畫、ScrollTrigger 高度沒重算……對讀者超實用、也好寫 |
| 30  | 30 天回顧 + 技術地圖總結      | GSAP 全套整理、Three.js 學習路徑、之後往哪深入               |

---

## 取捨邏輯備忘

- **JD 分層**：GSAP/Anime.js 屬於「熟練運用」的必要門檻；Three.js 屬於「基本開發經驗」的加分項 → GSAP 天數不砍，非 GSAP 部分只攻 Three.js 一個典範學到底。
- **小白起跑坡道**：Day 1 不直接丟 API，先補「GSAP 是什麼 + 安裝 + Hello Box」，避免完全新手在第一天就卡死。
- **ScrollTrigger 加碼**：agency／品牌官網作品九成的「哇」都是 scroll-driven，是面試最容易被要求現場展示的能力 → 特別加一天 Day 14 實戰，產出可直接放進 portfolio。SVG 畫線（Day 15）常搭 ScrollTrigger，歸在 GSAP 區而非廣度區。
- **只攻 Three.js（深度 > 廣度）**：對完全新手，連續吞多種繪圖典範=樣樣稀。因此非 GSAP 部分集中火力在 Three.js（Day 21-26，含「燈光與陰影」獨立一天，這是小白最大的坑）。
- **被砍掉的部分**：Matter.js 物理引擎；GLSL Shader（難度陡）；Canvas 2D、粒子系統、Pixi.js（對「只攻 Three.js」的小白是岔路）；SVG filter（偏進階，CP 值低）。
- **兩個彈性日（Day 27-28）**：完全新手每篇都會超時、也更容易卡坑，需要比老手更多緩衝。定位是斷賽保險，但各預排一個「單篇、可獨立、agency 常用」的技術備用主題（平滑捲動 / 跑馬燈），進度正常時就寫，用不到就拿去補進度或多打磨作品。
- **Vue 專屬亮點**：Day 18（`gsap.context()` + `matchMedia`）是履歷差異化重點——多數人會用 GSAP，但不一定懂得在框架元件生命週期中正確清理動畫。

## 賽外配套（不佔 30 天，但決定成敗）

- **開賽前先存 3-5 篇稿**：優先囤 Day 1-4（開篇、`.to/.from`、easing、stagger），這些最好寫。開賽即有安全庫存，某天出事直接發存稿，不斷賽。
- **賽後 1-2 週打磨 portfolio 大作**：這 30 天定位為「技術彈藥庫」，本身不主打完整作品；賽後另開一個專案，用學到的技巧（尤其 ScrollTrigger + Three.js）打磨 1 個能拿去 agency 面試的代表作，補上作品缺口。
