# Day 07：Hover 互動基礎，把動畫的開關交給滑鼠

## 前言

哈囉大家！歡迎回到「人要可愛，網頁也要動感迷人系列」的 Day 7。

回想一下前六天，我們寫的每一個 `gsap.to()`，都是頁面一載入就自己跑起來，像自動播放一樣。那如何讓動畫改由使用者觸發呢？今天就要來講這件事！

## Hover 互動是什麼？其實只是換個時機呼叫動畫！

之前動畫都是載入就跑，而 hover 互動的核心概念就是：**等使用者的滑鼠來觸發**。

在網頁上，滑鼠移入、移出一個元素，瀏覽器會各自發出一個事件：

- `mouseenter`：滑鼠移進來的那一刻
- `mouseleave`：滑鼠移出去的那一刻

我們要做的就是在這兩個時機各自呼叫一段 GSAP 動畫，一個負責變大、一個負責變回來。

> 🕳️ 小提醒：是 `mouseenter` 不是 `mouseover`。`mouseover` 在你滑到元素裡面的子元素時會一直重複觸發，`mouseenter` 只在真正進出外框時觸發一次。做 hover 幾乎都用 `mouseenter` / `mouseleave` 。

等等，單純放大變色，不是靠純 CSS 的 `:hover` 一行就搞定了嗎？幹嘛還需要用 GSAP？

- **CSS `:hover`** 較適合單純的狀態切換（變色、放大這種一步到位的效果），不用寫任何 JS。
- **GSAP** 適合比較講究的互動，例如想細調 ease 手感、想在滑到一半時平順地反轉、想用 timeline 串好幾個效果...等等。

如果要做得比較複雜，就適合使用 GSAP！

## 怎麼做

我們從最單純的寫法開始，一層一層加上去。

### 第一層：最基本的 addEventListener

先拿到元素，綁上那兩個事件，各自呼叫一段動畫：

```js
const card = document.querySelector(".card");

card.addEventListener("mouseenter", () => {
  gsap.to(card, { scale: 1.12, backgroundColor: "#4ade80", duration: 0.3 });
});

card.addEventListener("mouseleave", () => {
  gsap.to(card, { scale: 1, backgroundColor: "#38bdf8", duration: 0.3 });
});
```

就這樣，滑上去放大變綠、滑開變回原本的藍。

### 第二層：快速進出會打架，用 overwrite 解

上面那個寫法有一個坑，就是當你 hover 了一次進場（此時開始放大），當它還沒跑完你就滑走，然後又 hover 了一次，舊的進場動畫不會消失，它會繼續在背景偷偷跑，然後把卡片又放大回去，看起來就會像卡到陰一樣 👻

<!-- 📷 GIF：切到「基本」模式快速進出讓卡片抖動，再切到 overwrite 變順的前後對比 -->

GSAP 的解法很乾脆，加一個 `overwrite: "auto"`：

```js
card.addEventListener("mouseenter", () => {
  gsap.to(card, {
    scale: 1.12,
    backgroundColor: "#4ade80",
    duration: 0.3,
    overwrite: "auto",
  });
});
```

`overwrite: "auto"` 的意思就是，我要動這個屬性之前，先把之前那些還沒跑完、又在動同一個屬性的舊動畫砍掉，這樣就不會卡頓感發生了！

<!-- 📷 GIF：再切到 overwrite 變順的前後對比 -->

### 第三層：一條 timeline 來回放，接昨天的 timeline

還有一種更主流、很多人實際在用的寫法，就是把進場動畫做成一條 timeline，先暫停，`mouseenter` 就 `play()`，`mouseleave` 就 `reverse()`：

```js
const tl = gsap.timeline({ paused: true });
tl.to(card, { scale: 1.12, backgroundColor: "#4ade80", duration: 0.3 });

card.addEventListener("mouseenter", () => tl.play());
card.addEventListener("mouseleave", () => tl.reverse());
```

好處是「離開」不用自己再寫一次反向動畫，`reverse()` 會沿著原路倒回去。而且同一條 timeline 自己來回，就不會打架，等於順便把第二層的問題也解掉了。

> 🕳️ 小提醒：`reverse()` 是把原本的動畫「倒著播」，會連 ease 也一起倒過來。進場是先快後慢（ease-out），倒著播回程就變成先慢後快，所以你會發現 demo 裡 timeline 卡片縮回去的手感，跟 basic / overwrite 的感覺不太一樣。

另外，timeline 這種寫法在一排好幾張卡片時，也有一個重點要注意，就是當一排有好幾張卡片時，timeline 要**每張卡各自建一條**，不能大家一起共用喔～因為每張卡片的進出都是獨立的，共用會互相干擾到。

## 線上 demo

<!-- 📷 圖片：demo 畫面截圖（3 張 GSAP 卡 + 1 張 CSS 卡 + 三顆模式按鈕 + 程式碼區），讓沒點連結的人也知道長怎樣 -->

大家可以看看「基本」的版本，滑上一張卡，趁它還在慢慢變大的時候就把滑鼠移開。你會看到它先縮回去，然後**自己又脹大回來**。

👉 https://lianjieisme.github.io/2026-iThome/days/day-07-hover-basics/

## 小結

今天把動畫的開關交到了使用者的滑鼠上 🖱️

| 想做的事         | 用什麼                          | 白話                             |
| ---------------- | ------------------------------- | -------------------------------- |
| 滑鼠移入時觸發   | `mouseenter`                    | 滑進來的那一刻                   |
| 滑鼠移出時觸發   | `mouseleave`                    | 滑出去的那一刻                   |
| 避免舊動畫復活   | `overwrite: "auto"`             | 砍掉沒跑完的舊動畫，免得它變鬼影 |
| 進場離開一組來回 | timeline `play()` / `reverse()` | 離開沿原路倒回，還不會打架       |
| 單純的狀態切換   | CSS `:hover`                    | 不用寫 JS，一步到位              |

我們下篇再見～～ 👋

<!-- 多米多羅再見梗圖 -->
