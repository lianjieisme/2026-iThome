# Day 09：文字逐字進場（拆字 + stagger）

## 前言

哈囉大家～歡迎回到「人要可愛，網頁也要動感迷人系列」的 Day9。

我們在 Day4 跟 Day5 的時候有學了 stagger，可以讓一排方塊或是一片網格依序進場，不過那個前提是 **畫面上本來就有一堆元素**，stagger 才有東西可以錯開時間。

但假如今天是想讓一個字一個字依序進場呢？這時候就要使用 **拆字** 這個方法～

## 拆字在做什麼？

因為在 GSAP 的世界裡，它 **動的是元素，不是文字內容**，所以我們需要先做「拆開」這個動作。

```html
<p class="text">文字也能一個一個進場</p>
```

舉例，上面對瀏覽器而言就只是一個 `<p>`，裡面的十個字是一整塊，沒有一個字是可以單獨被抓出來動的。

所以逐字進場的第一步，要先把一整串文字換成一堆各自獨立的元素，通常會是一個字包一個 `<span>`。

接下來就按照 stagger 的寫法惹，之前已經教過！

## 拆字該怎麼做？

### 自己動手拆

最直覺的寫法就是把字串切開再組回去 ⬇️

```js
el.innerHTML = el.textContent
  .split("") // 先拆開
  .map((c) => `<span class="char">${c}</span>`)
  .join(""); // 上面組成<span>後再組起來

gsap.from(el.querySelectorAll(".char"), {
  opacity: 0,
  y: 24,
  stagger: 0.04,
  duration: 0.5,
  ease: "power2.out",
});
```

五行就有逐字浮現了。不過這裡藏了兩個新手很容易卡住的地方。

> ⚠️ 第一點：`<span>` 要記得補上 `display: inline-block`
>
> 因為 `<span>` 預設是 `display: inline`，而 **inline 元素沒辦法吃到 transform**，少了這一行，`y: 24` 就不會有效果，畫面上只剩淡入而已。
>
> ```css
> .char {
>   display: inline-block;
> }
> ```
>
> 我在 demo 裡做了一個開關可以現場關掉，可以看看有加跟沒有加的差異。

> ⚠️ 第二點：拆字前，原始文字會先閃一下
>
> JS 要等 DOM 有東西才會開始拆，所以總會有一瞬間，畫面上是還沒拆的完整句子，拆完後動畫才開始跑，視覺上看起來像是閃了一下（這個現象叫 FOUC）。
>
> 解法就是要先用 CSS 把它藏起來，拆完再由 GSAP 打開：
>
> ```css
> .text {
>   visibility: hidden;
> }
> ```
>
> ```js
> gsap.set(el, { visibility: "visible" });
> ```

另外，如果你有使用自訂字型，拆字要先等字型載入完再做唷！不然會導致字體變形、位置跑掉。關鍵字是 `document.fonts.ready`，今天先記著，有需要再去查。

### 手動拆會漏掉的東西

在 demo 裡，我有規劃一句中文、句尾擺一個 emoji，另一個是一句英文、塞進很窄的容器，結果發生了以下兩個問題 💥

第一個 👉 **中文那句的 🎬 emoji 沒辦法正常顯示，變成兩個問號。** 原因是因為 JS 的字串是 UTF-16，emoji 佔了兩個編碼單位，`split("")` 剛好從中間把它切成兩半，兩半各自都不是合法字元。

第二個 👉 **英文那句的單字從中間斷開了。** 每個字母都變成獨立的 inline-block 之後，瀏覽器就可以在任何兩個字母之間換行，於是畫面上就出現了 `singl` 換行 `e` 這種東西。

那該怎麼解決這個問題咧？讓我們繼續看下去 ✌️

### 交給官方外掛 SplitText 🎉

好消息～GSAP 從 3.13 開始，可以免費使用 SplitText 了！

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/SplitText.min.js"></script>
```

```js
gsap.registerPlugin(SplitText);

const split = SplitText.create(".text", { type: "words, chars" });

gsap.from(split.chars, {
  opacity: 0,
  y: 24,
  stagger: 0.04,
  duration: 0.5,
  ease: "power2.out",
});
```

版本記得要 3.13 以上！

`type` 給 `words, chars` 是同時拆詞和字，chars 是拿來一個字一個字跑動畫的對象，words 則是包在外面、用來保護英文不要從中間斷開。
拿到的 `split.chars` 就是一個元素陣列，再加入 stagger 的屬性，剩下的就跟 Day4 所學得差不多了，而且 SplitText 產生的元素自己就帶了 `display: inline-block`，非常滴貼心 💛

### 兩種做法對照

還有一些沒講到的地方，補充在這邊：

| 會遇到的狀況                        | 自己 `split("")`         | SplitText                                |
| ----------------------------------- | ------------------------ | ---------------------------------------- |
| emoji 或特殊字元                    | 壞掉變成問號             | 正常處理                                 |
| 巢狀標籤（例如句子裡有 `<strong>`） | 連角括號都當成字元拆掉   | 有 `deepSlice`、`ignore` 可以擋          |
| 螢幕閱讀器                          | 沒處理，會一個字一個字唸 | 預設自動補 `aria-label` 跟 `aria-hidden` |
| 字型載入後要重新拆                  | 要自己接                 | 開 `autoSplit: true`                     |

> 順帶一提，SplitText 會改寫 DOM，所以在 Vue、React 這種元件會被收掉的環境裡，離場時要還原，方法叫 `split.revert()`。今天的 demo 是單頁、元素不會消失所以用不到。之後會有一天專門講動畫要怎麼收拾。

## 線上 demo

上排是自己拆的版本、下排是交給 SplitText，中英文各一組並排，動畫參數兩排一模一樣，所以看到的差異來自拆字的方式。

下面還有一個開關，可以把手動拆字的 `display: inline-block` 關掉，大家可以看看位移是怎麼失效的。

👉 https://lianjieisme.github.io/2026-iThome/days/day-09-split-text/

<!-- 圖（建議用 GIF）：先讓四塊一起跑一次逐字浮現，再把 inline-block 開關切掉重播，上排不動、下排照常。發文時在 iThome 上傳 -->

## 小結

今天其實只學了一件事，就是如果要做到拆字的效果，要先把文字拆成元素 💡

| 想做的事             | 用什麼                  | 白話                           |
| -------------------- | ----------------------- | ------------------------------ |
| 讓文字能被逐字動畫   | 拆成一個字一個元素      | 先有元素，才有 stagger         |
| 手動拆完不會動       | `display: inline-block` | inline 元素吃不到 transform    |
| 拆之前閃一下         | 先 `visibility: hidden` | 拆完再由 GSAP 打開             |
| 不想自己處理邊界情況 | `SplitText.create()`    | emoji、斷字、aria 都幫你顧好   |
| 英文不要從單字中間斷 | `type: "words, chars"`  | 詞包著字，換行只會發生在詞之間 |

拆字的部分搞定了，不過你可能會發現，同樣一組 stagger 參數，換個 ease 整個氣質就不一樣。內建的 ease 家族有時候還是不夠用，那能不能自己畫一條？我們下篇見～ 👋
