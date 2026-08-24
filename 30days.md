# iThome 鐵人賽 30 天規劃：GSAP / Three.js 動畫技術養成

> 定位：純技術導向，不臨摹特定站台設計，每天聚焦一個明確的技術點。
> 讀者假設：對動畫「完全新手」也能跟上，Day 1 從零起跑（GSAP 是什麼、怎麼裝、讓一個方塊動起來）。
> 目標：GSAP 深度優先（求職 JD 的必要門檻），Three.js 深度其次（agency 差異化亮點）。
> 求職方向：動畫／互動／創意類前端（agency 或品牌官網）。
> 每日時間預算：2-3 小時（20-30 分鐘研究 + 80-100 分鐘實作 + 40-50 分鐘寫文章）。

---

## 開篇（Day 1）

| Day | 主題                          | 內容重點                                                         |
| --- | ----------------------------- | -------------------------------------------------------------- |
| 1   | GSAP 是什麼 + 第一個會動的東西 | 動畫在做什麼、GSAP 解決什麼問題、如何安裝（CDN / npm）、「Hello Box」讓方塊從左移到右，先拿到「它真的動了」的成就感 |

## Phase 1｜GSAP 核心基礎（Day 2-10）

| Day | 主題                                | 內容重點                                                       |
| --- | ----------------------------------- | -------------------------------------------------------------- |
| 2   | `.to()` / `.from()` / `.set()` 基礎 | 三種基礎方法的差異，動畫地基                                   |
| 3   | Easing 視覺化比較                   | 內建 ease 家族（linear、power、elastic、bounce、back）並排比較 |
| 4   | Stagger I：一維群組動畫             | 數字型 stagger、`each` vs `amount`、`from: "start"/"center"/"edges"/"end"/"random"`，控制「一排」元素的間隔與起跑方向 |
| 5   | Stagger II：grid 網格波浪           | `stagger: { grid: [rows, cols], axis, from }`，把一維排序換成二維，做出從中心擴散的波浪效果 |
| 6   | Timeline 串接 + position parameter  | `.timeline()`、`"-=0.3"` 等時間重疊語法                        |
| 7   | Hover 互動基礎                      | 使用者觸發動畫，而非自動播放                                   |
| 8   | Magnetic 滑鼠跟隨                   | `gsap.quickTo()`，高頻率更新動畫的效能寫法                     |
| 9   | 文字逐字進場                        | JS 拆字 + stagger，打字機/逐字浮現效果原理                     |
| 10  | 自訂 easing（CustomEase 外掛）      | cubic-bezier 手感控制                                          |

## Phase 2｜GSAP 進階控制 + ScrollTrigger + SVG（Day 11-22）

| Day | 主題                                | 內容重點                                                        |
| --- | ----------------------------------- | --------------------------------------------------------------- |
| 11  | 動畫是一台播放器（操控）            | 心智模型：`gsap.to()` 回傳的東西是可操控的播放器。三組內容：`timeScale`（速度倍率，本身也能被 tween）、`progress()`（getter／setter 兩用，是 Day 15 scrub 的直接前置）、`seek()` + label（按秒數／書籤跳位）；加上四個 callback（`onStart`／`onUpdate`／`onComplete`／`onReverseComplete`）。`play`／`reverse` 因 Day 7 已用過，一句話帶過。`onUpdate` 每幀跑一次的成本，是 Day 22 效能的伏筆 |
| 12  | 怎麼把動畫停掉（終止）              | 主軸是「單位是誰」：`tween.kill()` 砍那一條、`gsap.killTweensOf(el)` 砍整個元素（會連坐）、`overwrite` 的 `false`／`true`／`"auto"` 三值差異。從 Day 7 真的踩過的連坐坑切入：我只想停 A，為什麼 B 也停了。並用一節對比 `pause` / `kill` / `revert` 三者的差別（值會不會還原），`revert()` 的完整用法留到 Day 21 |
| 13  | 循環動畫：一輪              | 原規劃的「循環 70%／工具箱 30%」兩段沒有因果，改收成單一心智模型**一輪**，五個屬性都是在調一輪的某個面向：`repeat`（主打 `repeat: 2` 播三次的計數坑）、`yoyo`、`repeatDelay`、`keyframes`（主打陣列式，百分比式一段對照，屬性陣列式不教）、`repeatRefresh` + `random`（不加就不會重抽，這是後半段存在的理由）。收尾一節淺講 `gsap.utils`：`clamp`（還 Day 8 magnetic 用過沒解釋的債）、`mapRange`、`toArray`、`wrap`（Day 28 跑馬燈回收）。demo 是單舞台加五個開關，用輪數指示燈驗證計數坑。「一輪」這個詞已寫進 `CONTEXT.md` |
| 14  | ScrollTrigger 基礎                  | `trigger`、`start`、`end`、`toggleActions`。立一個觀念：ScrollTrigger 不是捲動動畫 API，而是把捲動狀態接到動畫生命週期的橋 |
| 15  | ScrollTrigger 進階：pin + scrub     | 建立「捲動位置 → 動畫進度」的對應                              |
| 16  | ScrollTrigger 實務：refresh、動態高度與多元素 | refresh 當主角、`batch()` 降為配角。主講什麼情況下版面高度會變、為什麼要 `ScrollTrigger.refresh()`：圖片載入、字型載入、DOM 動態生成、元件 mount、accordion 展開、RWD 換版 |
| 17  | ScrollTrigger 實戰：捲動敘事區塊 + Lenis 平滑捲動 | 前 17 天第一個像作品的成果，把 timeline／stagger／ease／pin／scrub／callback 串起來，可直接搬進 portfolio。收尾加上 Lenis 讓整頁捲動變滑順（原 Day 27 併入，見下方調整紀錄）。ScrollToPlugin（導覽列點擊捲到區塊）只當配角示範，不要變三主題 |
| 18  | SVG 畫線動畫（搭 GSAP）             | 不只教怎麼做出畫線，要把 `stroke-dasharray` → `stroke-dashoffset` → GSAP 改數值的原理鏈講通 |
| 19  | Flip：版面切換動畫                  | `Flip.getState()` → 改 DOM → `Flip.from()` 的四步流程；實作 grid 重排與清單篩選（篩選最有感：一般 DOM 會直接跳位，Flip 會讓元素飛過去） |
| 20  | Draggable + Inertia                 | 定位成「從動畫進入直接操作」：drag、bounds、snap、drag events、慣性。MotionPath 降到結尾速覽一段，不硬塞 |
| 21  | Vue × GSAP：動畫清理與響應式        | 三個並列主軸，各自吃一節：① `gsap.context()` + `ctx.revert()`，元件 unmount 時整包收掉（`revert()` 的語意 Day 12 已鋪過，這天講元件層級怎麼用）；② `contextSafe()`，處理 event handler 裡才建立的動畫（mount 時建的會被 context 收，click 之後才建的不會）；③ `matchMedia()` + `prefers-reduced-motion`。跟 Day 12 分工：Day 12 手動收拾單條動畫，這天是元件層級整包 revert |
| 22  | 動畫效能                            | 先建立 rendering pipeline（JS → Style → Layout → Paint → Composite），再解釋為什麼 `left`／`top`／`width`／`height` 會觸發 layout 而 `transform`／`opacity` 不會，接 `will-change` 與不要濫用、layout thrashing。DevTools Performance 只示範最小的一件事，完整 profiling 列為延伸 |

## Phase 3｜Three.js 深度線（Day 23-27）

> 定位：非 GSAP 的部分只攻「一個」典範學到底。選 Three.js，3D 在 agency 是真差異化，比 Canvas/Pixi 更有「哇」效果。

| Day | 主題                      | 內容重點                                                    |
| --- | ------------------------- | ----------------------------------------------------------- |
| 23  | Three.js 場景 + 第一個物體 | scene／camera／renderer、座標系（X／Y／Z 與 `position`／`rotation`／`scale`）、`BoxGeometry` + 材質、render loop（`requestAnimationFrame` → `renderer.render`）、resize 處理（`camera.aspect`、`updateProjectionMatrix`、`setSize`）。當天就看得到一顆 3D 方塊。座標系與 render loop 是 Day 25、26 的前提，這天一定要立起來 |
| 24  | 燈光與陰影                | 小白最常「東西全黑」的坑，單獨一天講清楚。AmbientLight／DirectionalLight／PointLight／HemisphereLight 各碰一下不用深入，核心觀念是很多材質沒有光源就是全黑 |
| 25  | Three.js + GSAP 整合      | 用剛學的 GSAP 動 `position`／`rotation`／`scale`／camera，履歷差異化亮點。延伸一段 ScrollTrigger 控制相機或 3D 物件 |
| 26  | 讓 3D 可互動：OrbitControls + Raycaster | 明確切兩段。Part 1 先讓讀者能玩（rotate／zoom／pan／damping，開 damping 要在 loop 裡 `controls.update()`）；Part 2 Raycaster，重點解釋為什麼 `clientX`／`clientY` 不能直接餵給 Raycaster，要先換算成 NDC，數學不用深入 |
| 27  | 小整合：可互動 3D 場景    | 自己拼一個小場景（GSAP + Three.js），驗收所學 + portfolio 素材。GLTFLoader 只介紹不教完整流程：教學用 `BoxGeometry` 學原理、實務通常載 `.glb`，當成下一階段的指路 |

## Phase 4｜收尾（Day 28-30）

> Day 28 原本是彈性日，現已改為正式排程的 agency 常見整合技巧，30 天每天都有指定內容。斷賽風險改由賽外配套的存稿策略吸收。

| Day | 主題                          | 內容重點                                                     |
| --- | ----------------------------- | ------------------------------------------------------------ |
| 28  | 無縫跑馬燈                    | 文字／logo 橫向無限循環，接縫看不出來，agency 網站常見。回收 Day 13 的 `repeat: -1` 與 `gsap.utils.wrap`，做真正的無縫接軌而不是 CSS 跑馬燈。infinite／seamless／hover 暫停／速度控制／RWD 這幾項挑 2 到 3 個做深就好 |
| 29  | 小白踩坑大全                  | 30 天遇過的坑總整理：裝套件失敗、路徑錯、Three.js 東西全黑、忘了清 event listener / 動畫、ScrollTrigger 高度沒重算……對讀者超實用、也好寫。**素材隨手記在 `docs/day-29-踩坑備忘.md`，寫這天時從那邊挑** |
| 30  | 30 天回顧 + 技術地圖總結      | 主體做成「下一階段路線圖」：GSAP 分支（timeline／ScrollTrigger／SVG／Flip／Draggable／Vue 整合／效能）→ Three.js 分支（相機／光影／互動／GLTF／GSAP 整合）→ 下一步（shader、WebGL、3D asset workflow、page transition、portfolio）。原本佔一整天的 Anime.js 比較收斂成其中一小段「GSAP 不是唯一選擇」 |

---

## 取捨邏輯備忘

- **JD 分層**：GSAP/Anime.js 屬於「熟練運用」的必要門檻；Three.js 屬於「基本開發經驗」的加分項 → GSAP 天數不砍，非 GSAP 部分只攻 Three.js 一個典範學到底。
- **小白起跑坡道**：Day 1 不直接丟 API，先補「GSAP 是什麼 + 安裝 + Hello Box」，避免完全新手在第一天就卡死。
- **Stagger 拆兩天（Day 4-5）**：一維（間隔 + 起跑方向）和 grid 二維排序是兩個不同的心智模型，塞一天會破「一次一重點」。拆成 Day 4（一維）＋ Day 5（grid 波浪），各自吃飽。回收位置的方式見下面 Day 11-30 的三條調整。
- **ScrollTrigger 加碼**：agency／品牌官網作品九成的「哇」都是 scroll-driven，是面試最容易被要求現場展示的能力 → 特別加一天 Day 17 實戰，產出可直接放進 portfolio。SVG 畫線（Day 18）常搭 ScrollTrigger，歸在 GSAP 區而非廣度區。
- **只攻 Three.js（深度 > 廣度）**：對完全新手，連續吞多種繪圖典範=樣樣稀。因此非 GSAP 部分集中火力在 Three.js（Day 23-27，含「燈光與陰影」獨立一天，這是小白最大的坑）。
- **被砍掉的部分**：Matter.js 物理引擎；GLSL Shader（難度陡）；Canvas 2D、粒子系統、Pixi.js（對「只攻 Three.js」的小白是岔路）；SVG filter（偏進階，CP 值低）；WebGPU、React Three Fiber。定位就是 GSAP 當主武器、Three.js 當差異化，不追求「30 天把動畫技術都碰過」。
- **Vue 專屬亮點**：Day 21（`gsap.context()` + `contextSafe()` + `matchMedia`）是履歷差異化重點，多數人會用 GSAP，但不一定懂得在框架元件生命週期中正確清理動畫。這天破例排三個並列主軸（一般是一天一重點），因為三者是同一個「元件裡的動畫怎麼管」的問題，拆開反而斷。篇幅會明顯比平常長，demo 做成一個能切換 mount／unmount 的元件、三節共用同一個場景，不要各做一個。
- **reduced-motion 併進 Day 21（2026-08-12 決定）**：`prefers-reduced-motion` 和 RWD 斷點本來就是同一顆 `gsap.matchMedia()`，官方文件同一段講完，寫法只差 `mm.add()` 的條件物件多一行，拆兩天等於同一個 API 講兩次。**不要把效能那天（Day 22）整天砍掉**：transform/opacity only 是動畫效能的根本原理（也是 agency 面試會問的），撐得起一天，塞進 Day 29 條列會浪費。

### Day 11-30 調整（2026-08-17 決定）

- **砍掉「GSAP vs Anime.js」整天**：那是觀點文不是技術文，成本高（同效果要寫兩套）收穫低，又卡在 SVG → 外掛 → 清理 → 效能這條技術線中間斷節奏。改成 Day 30 路線圖裡的一小段。回收 1 天。
- **Three.js 前兩天合併**：原規劃第一天只跑空場景，讀者忙一小時看到一片黑，違反 Day 1 立下的「當天就要看到東西在動」。scene 三件組和第一顆 mesh 同一天講完才有成就感。回收 1 天。
- **回收的 2 天用在**：新增「循環動畫與工具箱」（現 Day 13）、Flip 從速覽獨立成一天（現 Day 19）。
- **為什麼補循環與工具箱那天**：`repeat` / `yoyo` / `repeatDelay` 是 Day 2 等級的基礎，原規劃 30 天竟然完全沒排到，無限循環、呼吸效果、loading 動畫全靠這組；`gsap.utils` 也是天天用（Day 8 的 `main.js` 已經用了 `clamp` 卻沒解釋，讀者看 demo 會卡）；`keyframes` 讓單一元素多段變化不用開 timeline。這天還負責埋 `wrap`，Day 28 跑馬燈直接回收，形成前埋後收。
- **Day 11 改成補完而非初次介紹**：Day 7 的 hover demo 就已經在用 paused timeline + `play()` / `reverse()`，照原規劃到 Day 11 才正式講會像在複習。改成主打 `timeScale` / `progress()` / `seek()` / callback，再加原本整份規劃都沒有的 `kill()` / `killTweensOf()` / `overwrite`，從 Day 7 真的踩過的元素連坐坑切入（見 `docs/day-29-踩坑備忘.md` 第 1 條）。
- **refresh 那天改定位（現 Day 16）**：原標題「batch + refresh 陷阱」會讓人以為主題是 `batch()`，但實務上真正會咬人的是動態高度沒重算。改成 refresh 當主角、batch 降配角。
- **Flip 獨立一天**：原本 Draggable + Flip + MotionPath 擠一天，Flip 只分到三分之一。Flip 是 GSAP 最有記憶點也最常被面試問的功能，撐得起一天；剩下 Draggable + Inertia 一天，MotionPath 降到結尾速覽。
- **取消彈性日**：改為正式排程（Lenis 平滑捲動、無縫跑馬燈），30 天每天都有指定內容。代價是沒有斷賽緩衝，因此賽外配套的存稿策略要加碼（見下）。
- **Lenis 的技術修正**：`scrollerProxy()` 不是 Lenis 的必備配置。Lenis 預設驅動原生 window scroll，官方整合只需要 `lenis.on("scroll", ScrollTrigger.update)` + 把 `lenis.raf` 掛進 `gsap.ticker` + `lagSmoothing(0)`；`scrollerProxy()` 是自訂 scroll container 才用得到，寫成必備會誤導讀者。

### Day 11 拆成兩天、Lenis 併入 Day 17（2026-08-17 決定，晚於上一節）

- **Day 11 拆成 Day 11（操控）+ Day 12（終止）**：原本一天要塞「控制位置 + callback + 終止」三組，實際估算落在 9000 到 10000 字，等於 Day 8 那種份量，而且中段會有明顯接縫（讀者讀到一半發現換主題了）。拆成兩天後各約 5000 到 5500 字，兩天都回到「一次只主打一個重點」，不必破例。
- **兩天的分工**：Day 11 是「動畫是一台播放器」，`timeScale` / `progress()` / `seek()` + label / 四個 callback 全在這天（callback 不拆，它們是同一個設定物件裡的四個 key，拆兩天等於同一個概念講兩次）。Day 12 是「怎麼把動畫停掉」，主軸是**單位是誰**：`kill()` 砍一條、`killTweensOf()` 砍整個元素、`overwrite` 三值。
- **`revert()` 提前到 Day 12 露臉**：`kill()` 最反直覺的是元素會卡在動畫演到一半的位置，講清楚它就必須回答「那能不能還原」。因此 Day 12 用一節對比 `pause` / `kill` / `revert` 的差別，Day 21 不再重講語意，直接進元件層級用法。不這樣做的話，讀者到 Day 21 會把 `revert()` 誤認成另一種 kill。
- **總數必須剛好 30，所以合併一天**：把原 Day 27（Lenis 平滑捲動）併進捲動敘事實戰（現 Day 17）當收尾。理由是 Lenis 與 ScrollTrigger 的整合碼實際只有六行，本來就撐不起一天；而捲動敘事那天本來就是一整頁捲動的作品，最後補上整頁滑順捲動是天然的收尾，不是硬湊。
- **考慮過但沒選的合併方式**：Day 29 踩坑 + Day 30 回顧合併（否決：那兩天好寫是刻意的，是體力最低時的軟著陸保險）；Day 27 Lenis + Day 28 跑馬燈合併（否決：技術上毫無關聯，會變縫合怪）。
- **重編號的連鎖影響**：原 Day 12 到 26 整段往後推一天變成 13 到 27，Three.js 區塊變成 Day 23-27，**Day 28、29、30 編號不變**。已寫的 Day 1-10 十篇文章完全不受影響，因為語氣規則第 4 條（結尾預告寫軟、不寫死篇名）讓它們沒有任何一處寫死後面的天數。
- **時間怎麼分配（更新）**：最該加深的是 Day 17、21、22、25、26；次一級是 Day 11、12。其餘維持既有水準即可。

## 賽外配套（不佔 30 天，但決定成敗）

- **開賽前先存 5-7 篇稿**：優先囤 Day 1-5（開篇、`.to/.from`、easing、stagger 一維＋grid），這些最好寫。開賽即有安全庫存，某天出事直接發存稿，不斷賽。**彈性日取消後就沒有天數可退，所以庫存要比原本抓的 3-5 篇再拉高**，另外 Three.js 段落（Day 23-27）debug 最耗時，有餘裕就提前預做。
- **賽後 1-2 週打磨 portfolio 大作**：這 30 天定位為「技術彈藥庫」，本身不主打完整作品；賽後另開一個專案，用學到的技巧（尤其 ScrollTrigger + Three.js）打磨 1 個能拿去 agency 面試的代表作，補上作品缺口。
