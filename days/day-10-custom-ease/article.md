# Day 10：自訂 easing（CustomEase）

## 前言

哈囉大家～歡迎回到「人要可愛，網頁也要動感迷人系列」的 Day10。

我們之前在玩 ease 的時候，都只有使用 GSAP 內建的那幾款，但其實也可以自己畫出想要的感覺喔！
今天的文章內容，就是要來跟大家分享怎麼創造出想要的 ease ✏️

## ease 到底長什麼形狀？

在 Day3 的時候有提過，ease 是一個從時間 t（0→1）對應到進度 p（0→1）的函式
函式聽起來很抽象，但它畫成圖之後其實非常直觀：

- **橫軸是時間**：0 是動畫剛開始，1 是時間到
- **縱軸是完成度**：0 是還在原地，1 是抵達終點

所以每一種 ease 都是一條從左下角 `(0, 0)` 走到右上角 `(1, 1)` 的線，差別只在過程的曲線怎麼設計。

簡單來說，可以用這三件事來判別：

- 線**越陡**，代表那一刻跑得越快。
- 線**越平**，代表那一刻幾乎停著不動。
- 線**爬出上面那條基準線**（完成度超過 1），代表衝過頭了，等一下得退回來。

拿這三句話回頭看 Day3 的範例應該就可以很明確了，`power2.out` 為什麼是先快後慢？因為它的線一開始很陡、後面越來越平。`back.out` 為什麼會回彈？因為它的線先爬到 1 上面再掉回來。

所謂內建的 ease，就是 GSAP 事先畫好、取好名字的一批曲線，而 **CustomEase 就是交給你自己來定義。**

## 怎麼做

### 先把外掛載進來

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/CustomEase.min.js"></script>
```

> 🕳️ 小提醒：外掛一定要放在 gsap 本體後面，順序反了會找不到東西。

### 三個步驟

```js
gsap.registerPlugin(CustomEase);

// 取一個名字 + 給它一條曲線
CustomEase.create("myEase", "0.65, 0, 0.35, 1");

gsap.to(".box", { x: 240, duration: 1.6, ease: "myEase" });
```

註冊、取名，建好之後 `myEase` 就跟 `power2.out` 一樣，是一個到處都能塞的字串。

### 寫法一：先來看看這四個數字

`"0.65, 0, 0.35, 1"` 這四個數字，就是 CSS `cubic-bezier()` 的那四個數字。
四個數字可以分成兩個控制點：`(x1, y1)` 和 `(x2, y2)`。還有一個重點 **y 值可以超過 1**，一超過曲線就爬出基準線，方塊就會衝過頭再退回來：

```js
CustomEase.create("overshoot", "0.34, 1.56, 0.64, 1");
```

要怎麼調到自己想要的手感？推薦大家可以去 [cubic-bezier.com](https://cubic-bezier.com/) 玩看看，兩個控制點拉一拉，而且還有兩條曲線可以比對。

### 寫法二：SVG path

四個數字只能畫一段曲線，做不出上上下下來回好幾次的形狀。想要那種的話，我們就要改使用 SVG path。

```js
CustomEase.create(
  "wobble",
  "M0,0 C0.1,0 0.2,1.2 0.35,1.2 C0.45,1.2 0.5,0.85 0.6,0.85 C0.7,0.85 0.75,1.08 0.85,1.08 C0.92,1.08 0.95,1 1,1",
);
```

這一大串漏漏等的東西當然不是手寫的，剛剛那個 cubic-bezier.com 只給四個數字，產不出 path，所以這種形狀要回頭找 GSAP 官方的 [Ease Visualizer](https://gsap.com/docs/v3/Eases/CustomEase)。

### 兩條規矩

不管用哪種寫法，曲線都要遵守這兩個規則：

1. 一定要從 `(0, 0)` 出發、在 `(1, 1)` 收尾。
2. x 只能往右走，時間不能倒退。至於 y，可以超過 1 或掉到 0 以下。

> 🕳️ 小提醒：`create()` 第一個參數是名字。名字重複不會報錯，會直接蓋掉前一條，尤其別取成 `power1` 這種內建 ease 的名字。

## 線上 demo

我準備了四條現成的曲線，兩條是四個數字、兩條是 SVG path。每按一顆按鈕左邊的曲線圖會換線，中間兩顆方塊會同時起跑，灰色那顆固定跑 `power2.out` 當對照組。

👉 https://lianjieisme.github.io/2026-iThome/days/day-10-custom-ease/

<!-- 圖（建議用 GIF）：按過四顆按鈕，讓曲線圖跟兩顆方塊的差異一起入鏡，特別是「衝過頭」和「先退再衝」那兩條。發文時在 iThome 上傳 -->

## 延伸：不想自己畫的話

同一個家族還有兩個外掛，是別人先幫你畫好、你只要調參數的版本：

```js
gsap.registerPlugin(CustomEase, CustomWiggle, CustomBounce);

// 抖動
CustomWiggle.create("myWiggle", { wiggles: 6, type: "easeOut" });
gsap.to(".box", { rotation: 15, duration: 1, ease: "myWiggle" });

// 彈跳
CustomBounce.create("myBounce", { strength: 0.6 });
gsap.to(".ball", { y: 300, duration: 2, ease: "myBounce" });
```

⚠️ 兩件事要注意：

- 這兩個外掛都靠 CustomEase 才跑得動，script 要放在它後面。
- **wiggle 是抖完回原位，不是抖到定位。** 一般的 ease 最後停在 1，也就是你寫的那個值；但 wiggle 的曲線最後回到 0。所以上面那行的 `rotation: 15` 不是「轉到 15 度」，而是「左右各抖 15 度」，抖完角度會歸零。

## 小結

| 想做的事             | 用什麼                          | 白話                     |
| -------------------- | ------------------------------- | ------------------------ |
| 自己定義一條 ease    | `CustomEase.create(名字, 曲線)` | 建好之後名字就能當字串用 |
| 調一般的加速減速     | 四個數字 `"0.65, 0, 0.35, 1"`   | 去 cubic-bezier.com 拖   |
| 做出多次來回的形狀   | SVG path `"M0,0 C… 1,1"`        | 去 Ease Visualizer 拖    |
| 讓動畫衝過終點再回來 | 把 y 值畫到 1 以上              | 曲線爬出基準線就是衝過頭 |
| 懶得畫抖動 / 彈跳    | `CustomWiggle` / `CustomBounce` | 別人畫好的，只要調參數   |

到目前為止我們的動畫都是寫下去就一路跑完，中間插不了手。但如果想讓它暫停、倒轉、或是放慢兩倍呢？下一篇來玩玩看，我們下篇見 👋
