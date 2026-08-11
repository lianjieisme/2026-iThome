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
