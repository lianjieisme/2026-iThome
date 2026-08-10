# Day 06：Timeline 串接動畫（用 position parameter 排時間軸）

## 前言

歡迎大家閱讀～這裡是「人要可愛，網頁也要動感迷人系列」的 Day6 🎉（先恭喜自己還未中斷：））

前面幾天我們玩的都是單一個動畫內部的變化，像 stagger 讓一排、一個網格的元素錯開時間進場，但真實的頁面通常沒這麼單純，常常是好幾個不同的動畫要接力上場。
例如：先讓標題滑進來，等它到位再讓副標淡出，最後一排卡片才依序冒出來。今天就要來認識負責把這一連串動畫串起來的工具，就是「timeline ⏱️」

## timeline 是什麼？解決什麼問題？

假設我要「A 移動，結束後 B 淡入，再來 C 放大」，在還不知道 timeline 的時候，只能靠 `delay` 自己算時間

```js
gsap.to(".a", { x: 100, duration: 1 });
gsap.to(".b", { opacity: 1, duration: 0.5, delay: 1 }); // 手動等 A 的 1 秒
gsap.to(".c", { scale: 2, duration: 0.5, delay: 1.5 }); // 手動等 A + B
```

問題來了，如果我把 A 的 `duration` 改成 `1.5`，後面每一個 `delay` 都要跟著重算，超麻煩＠＠

timeline 就是來解決這件事的～你可以把一個一個動畫交給它，它會自動幫你接力，預設是前一個跑完，下一個才開始，如下方範例

```js
const tl = gsap.timeline();
tl.to(".a", { x: 100, duration: 1 })
  .to(".b", { opacity: 1, duration: 0.5 }) // 自動接在 A 結束後
  .to(".c", { scale: 2, duration: 0.5 }); // 自動接在 B 結束後
```

現在改 A 的時間，後面全部自動順延，就不用再手算了～～

## 怎麼做

### 一、建立 timeline，然後一直 `.to()` 接下去

`gsap.timeline()` 會回傳一個 timeline 物件，接著用鏈式 `.to().to().to()` 把動畫一個一個排上去就好，預設一個接一個。

真正的重點是接下來的主角，怎麼控制它們的先後跟重疊。

### 二、position parameter：每個動畫的第三個參數

`.to()` 的第三個參數叫 position parameter，它決定了「這個動畫要從時間軸的哪裡開始」。雖然寫法看起來很多種，但其實都只是在對兩個基準點做加減：

- 基準點一，整條 timeline 目前的結尾：用 `+=`、`-=` 和絕對數字。
- 基準點二，上一個剛加進來的動畫：用 `<`、`>`。

搞懂這個寫法在對誰做加減，基本上就學會了（？）我們直接用今天 demo 的三步接力當例子，A 從左滑入、B 淡入、C 一排 stagger 進場。

**① 不給第三參數（預設）：一個接一個**

```js
const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.out" } });
tl.to(".box-a", { x: 0, autoAlpha: 1 })
  .to(".box-b", { y: 0, autoAlpha: 1 }) // 接在 A 結束後
  .to(".cell", { scale: 1, autoAlpha: 1, stagger: 0.12 }); // 接在 B 結束後
```

<!-- 📷 GIF：demo 的「排隊(預設)」，A → B → C 一個接一個 -->

接下來只要改 B、C 的第三個參數，就能換出不同時序。demo 上面那排按鈕做的就是這件事，每顆對應一種寫法：

**② 絕對數字（demo「絕對數字」）：把 B、C 釘在指定秒數**

```js
  .to(".box-b", { y: 0, autoAlpha: 1 }, 0.8) // 第 0.8 秒開始
  .to(".cell", { scale: 1, autoAlpha: 1, stagger: 0.12 }, 1.6); // 第 1.6 秒開始
```

<!-- 📷 GIF：demo 的「絕對數字」，B、C 被釘在固定秒數起跑 -->

**③ `-=`（demo「重疊(-=0.3)」）：比 timeline 結尾提前 0.3 秒，做出重疊**

```js
  .to(".box-b", { y: 0, autoAlpha: 1 }, "-=0.3")
  .to(".cell", { scale: 1, autoAlpha: 1, stagger: 0.12 }, "-=0.3");
```

<!-- 📷 GIF：demo 的「重疊(-=0.3)」，每格提前重疊，整段變緊湊 -->

**④ `+=`（demo「留空檔(+=0.5)」）：比 timeline 結尾再晚一點，中間留空檔**

```js
  .to(".box-b", { y: 0, autoAlpha: 1 }, "+=0.5")
  .to(".cell", { scale: 1, autoAlpha: 1, stagger: 0.12 }, "+=0.5");
```

<!-- 📷 GIF：demo 的「留空檔(+=0.5)」，每步中間有明顯停頓 -->

**⑤ `<`（demo「同時(<)」）：對齊上一個的起點，三格一起跑**

```js
  .to(".box-b", { y: 0, autoAlpha: 1 }, "<")
  .to(".cell", { scale: 1, autoAlpha: 1, stagger: 0.12 }, "<");
```

<!-- 📷 GIF：demo 的「同時(<)」，三格同時起跑 -->

實務上做重疊感最常用的就是 `-=`，想讓兩個動畫一起跑就用 `<`，另外，`<`、`>` 後面加數字也可以偏移，像 `"<0.2"` 是上一個起點再 +0.2 秒。

> 🕳️ 小提醒：`<` 看開頭、`>` 看結尾（箭頭開口朝左＝對齊起點，朝右＝對齊終點）。還有一個很容易搞混的地方，`-=` 對的是整條 timeline 的結尾，`<` 對的是上一個動畫。單純一個接一個時兩者結果一樣，但只要中間插過同時播放的動畫，兩個基準點就會分岔。

### 三、label：幫時間點取名字

動畫一多，一堆 `-=0.3` 會看不懂在對誰。這時可以在時間軸上插一支旗子，之後用旗子的名字對齊，比硬記秒數好讀很多。這就是 demo 的「label」按鈕在做的事：

```js
tl.to(".box-a", { x: 0, autoAlpha: 1 })
  .addLabel("second") // 在目前位置插一支叫 second 的旗子
  .to(".box-b", { y: 0, autoAlpha: 1 }, "second") // 從旗子的位置開始
  .to(".cell", { scale: 1, autoAlpha: 1, stagger: 0.12 }, "second+=0.4"); // 旗子之後 0.4 秒
```

<!-- 📷 GIF：demo 的「label」，B 對齊旗子、C 在旗子後 0.4 秒 -->

### 四、defaults：省掉一直重複的設定

timeline 裡每個動畫常常 `duration`、`ease` 都一樣，可以在建立時一次設好，子動畫自動繼承，不用每個都重寫：

```js
const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.out" } });
tl.to(".box-a", { x: 0, autoAlpha: 1 }) // 自動套 duration:0.5, ease:power2.out
  .to(".box-b", { y: 0, autoAlpha: 1 }); // 同上
```

> 🕳️ 小提醒：如果 timeline 上某一格本身是一個 stagger（一次動很多元素），這一格的長度不是只有 `duration`，而是 `stagger 攤開的時間 + duration`。所以後面用相對定位的動畫，會連 stagger 那段一起等，整個往後延。今天的 demo 裡 C 那排就是這種情況，你可以留意一下它讓整段變長了。

<!-- 📷 GIF：特寫 C 那排 stagger 一顆一顆進場，凸顯這一格比單顆長，整段被拉長 -->

## 線上 demo

這個 demo 是一條 timeline 串三步接力：A 從左滑入、B 淡入、C 一排 5 顆用 stagger 進場。上面六顆按鈕會切換不同的排法（最後一顆是 label），下方的程式碼會跟著即時更新，你可以直接對照換了寫法之後時序差在哪。

另外注意 C 那排是 stagger 進場，timeline 會等它整組跑完才算這一格結束，這就是上面小提醒講的效果 👀

<!-- 📷 圖片：demo 畫面截圖（A/B/C 三排 + 五顆模式按鈕 + 程式碼區），讓沒點連結的人也知道長怎樣 -->

👉 https://lianjieisme.github.io/2026-iThome/days/day-06-timeline/

## 小結

今天的重點：timeline 把好幾個動畫排上同一條時間軸，用 position parameter 精準控制先後跟重疊 🎬

| 想做的事     | 用什麼                   | 白話                      |
| ------------ | ------------------------ | ------------------------- |
| 建立時間軸   | `gsap.timeline()`        | 開一條軸來排動畫          |
| 一個接一個   | `.to().to()`             | 不給第三參數就自動排隊    |
| 提前重疊     | `"-=0.3"`                | 比 timeline 結尾早 0.3 秒 |
| 留一段空檔   | `"+=0.5"`                | 比 timeline 結尾晚 0.5 秒 |
| 兩個一起跑   | `"<"`                    | 對齊上一個動畫的起點      |
| 幫時間點命名 | `addLabel()`             | 插旗子，用名字對齊        |
| 共用設定     | `timeline({ defaults })` | 子動畫繼承 duration、ease |

到目前為止動畫都是自動播放，下篇來看看怎麼讓動畫改由使用者出手才觸發，我們明天見 👋
