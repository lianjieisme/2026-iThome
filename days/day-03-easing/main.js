// Day 03 — Easing 視覺化比較
// 目標：方塊都跑一樣的距離、花一樣的時間，差別只在「ease」——
//       也就是動畫從 A 到 B 的「手感」。分兩類對照：
//       數學型（純速度曲線）＋ 效果型（模擬物理）。

const TRAVEL = 320; // 每顆方塊要跑的距離（px），大家都一樣
const DURATION = 1.5; // 每顆花的時間（秒），大家也都一樣

function playAll() {
  // 先把所有方塊歸位到起點（瞬間、不動畫），每次重播才公平
  gsap.set(".box", { x: 0 });

  // 數學型：單調跑到終點、不會超出，差別只在「加速/減速的節奏與強度」
  gsap.to("#box-none", { x: TRAVEL, duration: DURATION, ease: "none" }); // 等速，白開水
  gsap.to("#box-power2", { x: TRAVEL, duration: DURATION, ease: "power2.out" }); // 預設值，自然減速
  gsap.to("#box-sine", { x: TRAVEL, duration: DURATION, ease: "sine.out" }); // 最柔、最不明顯
  gsap.to("#box-expo", { x: TRAVEL, duration: DURATION, ease: "expo.out" }); // 起步超猛、戲劇性

  // 效果型：不是純速度曲線，會衝過終點或反覆震盪
  gsap.to("#box-back", {
    x: TRAVEL,
    duration: DURATION,
    ease: "back.out(1.7)",
  }); // 衝過頭再拉回
  gsap.to("#box-elastic", {
    x: TRAVEL,
    duration: DURATION,
    ease: "elastic.out(1, 0.3)",
  }); // 像彈簧來回抖
  gsap.to("#box-bounce", { x: TRAVEL, duration: DURATION, ease: "bounce.out" }); // 像球落地彈跳
}

// 一進頁面先跑一次
playAll();

// 重播鈕：每次點擊重新觸發全部動畫
document.querySelector("#replay").addEventListener("click", playAll);
