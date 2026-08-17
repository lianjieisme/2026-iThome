# iThome 鐵人賽 2026｜GSAP / Three.js 動畫技術養成

30 天動畫技術系列的文章原稿與實作 demo。規劃見 [30days.md](./30days.md)。

## 資料夾結構

```
.
├── 30days.md                  ← 30 天規劃
├── README.md                  ← 你正在看的這份
├── docs/
│   └── adr/                   ← 架構決策紀錄（為什麼這樣做）
│       └── 0001-per-day-standalone-html-cdn.md
└── days/
    ├── _template/             ← 範本夾，開新的一天複製這個
    │   ├── article.md         ← 文章骨架（每段附提示怎麼填）
    │   ├── index.html
    │   ├── main.js
    │   └── style.css
    ├── day-01-hello-box/      ← 每天一夾，文章 + demo 放一起
    │   ├── article.md         ← 文章原稿（寫好貼去 iThome）
    │   ├── index.html         ← 實作 demo（用 Live Server 打開就跑）
    │   ├── main.js
    │   └── style.css
    ├── day-02-to-from-set/
    └── ...
```

## 慣例（每天照抄）

- **命名**：`day-XX-主題slug`，天數補零（`01` 不是 `1`），排序才不會亂。
- **每天完全自足**：每個 day 夾自己一份 `style.css`，不共用 `/assets`。任何一天單獨搬走 / 丟 CodePen 都能直接跑。
- **開新的一天**：複製 `days/_template/` 整夾 → 改名成 `day-XX-主題slug` → 從骨架開始填。
- **樣式 / 框架**：預設原生 CSS + vanilla JS；版面複雜的天可用 Tailwind CDN，Day 21 用 Vue 示範動畫清理（理由見 [ADR 0001](./docs/adr/0001-per-day-standalone-html-cdn.md)）。

## Commit 訊息慣例（Conventional Commits）

格式：`prefix: 簡短描述（英文、祈使句）`。每天寫完通常一個 commit 就好。

| Prefix      | 用在什麼                  | 例子                                           |
| ----------- | ------------------------- | ---------------------------------------------- |
| `feat:`     | 新增功能 / 新的一天 demo  | `feat: add Day 2 to/from/set demo`             |
| `docs:`     | 只改文件 / 文章           | `docs: write Day 1 article`                    |
| `chore:`    | 設定 / 雜項 / 建置        | `chore: initialize project`                    |
| `fix:`      | 修 bug                    | `fix: correct ScrollTrigger refresh on Day 15` |
| `refactor:` | 重構既有 code（功能不變） | `refactor: tidy Day 8 magnetic logic`          |
| `style:`    | 只動排版 / 格式           | `style: format Day 3 css`                      |

## 怎麼跑 demo（本機）

用 VS Code 的 **Live Server** 擴充套件，對著某天的 `index.html` 按右鍵 → Open with Live Server。

## 怎麼給讀者看（線上）

推到 GitHub 後開 **GitHub Pages**，每天的 demo 會有網址：
`https://你的帳號.github.io/repo名/days/day-01-hello-box/`
文章裡貼這個連結，讀者點開就看到活的 demo。

> Three.js 那幾天（Day 23-27）用 CDN + `<script type="importmap">` 引入，一樣不需要 build 工具。
