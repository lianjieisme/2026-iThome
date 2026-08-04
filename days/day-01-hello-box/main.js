// Day 01 — Hello Box
// 目標：讓一個方塊從左移到右，確認「GSAP 真的動了」。

// 這行就是 GSAP 最基本的動畫：把 .box 在 1 秒內往右移動 300px。
gsap.to(".box", {
  x: 300,
  duration: 1,
});

// TODO（換新的一天時，清掉上面、寫這天的實作）
