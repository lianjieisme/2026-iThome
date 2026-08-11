# Day 29「小白踩坑大全」素材備忘

> 用途：30 天做 demo 時真的踩到的坑，隨手記在這裡累積。到 Day 29 再從中挑幾個好講的整理成文章，不用臨時對著空白發呆。
> 每條記：**坑是什麼 → 為什麼會發生 → 怎麼解**，最好附上是哪一天、哪個檔踩到的。

---

## 1. `gsap.killTweensOf(元素)` 會連 timeline 裡的子動畫一起砍掉

- **哪天踩到**：Day 7 hover 互動（`days/day-07-hover-basics/main.js`）。
- **坑是什麼**：demo 裡每張卡各自存了一條 paused timeline，切換寫法時我用 `gsap.killTweensOf(card)` 想清掉還沒跑完的動畫。結果切到 timeline 模式後，hover 完全沒反應。
- **為什麼會發生**：`killTweensOf(card)` 是「把這個元素身上所有的 tween 都砍掉」，而 timeline 內部那條 `tl.to(card, ...)` 也是一個 tween，所以會被一起砍。timeline 被掏空後（子動畫數量從 1 變 0），`play()` 就沒東西可播。
- **怎麼解**：砍完之後把那條 timeline 重建回來（抽一個 `makeTimeline(card)` helper，`onMounted` 跟切換時都用它）。或者一開始就別用 `killTweensOf` 這種「連坐」的清法，改用只針對當下臨時 tween 的方式。
- **可延伸的一般觀念**：GSAP 的 `killTweensOf` / `overwrite: true` 都是「以元素為單位」連坐，會誤傷同一元素上你想保留的動畫（例如常駐的 timeline）。想精準一點可以用 `overwrite: "auto"`（只砍屬性衝突且正在跑的），或把要保留的動畫跟臨時動畫分開管理。

---

## 2. 動畫「整個不動」，八成是 `requestAnimationFrame` 沒在跑

- **哪天踩到**：Day 8 magnetic（`days/day-08-magnetic/`）驗證時，在無頭 / 背景的預覽瀏覽器裡打開，magnetic 按鈕怎樣都不動。
- **坑是什麼**：所有 GSAP tween 都凍在起始值，`x` 永遠是 0，畫面完全沒動靜，但程式碼邏輯其實完全正確。
- **為什麼會發生**：GSAP 的動畫是靠瀏覽器的 `requestAnimationFrame`（rAF）一幀一幀推進的，GSAP 內部的時鐘叫 ticker。當分頁切到背景、或在無頭 / 不可見的環境下，瀏覽器會**暫停 rAF**，ticker 就不再前進（`gsap.ticker.frame` 卡在 0），於是每一條 tween 都停在原地。
- **怎麼解**：這通常不是程式碼的錯，回到正常的前景分頁就會動。要在這種環境驗證「邏輯對不對」，可以用 `gsap.updateRoot(時間)` 手動推進 GSAP 的全域時間，跳過對 rAF 的依賴。
- **可延伸的一般觀念**：發現動畫整個不動時，先確認 rAF 有沒有在跑（分頁是不是在背景、是不是無頭環境），再去懷疑自己的程式碼。
