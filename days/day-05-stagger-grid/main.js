// Day 05 — Stagger grid 網格波浪（Vue 版）
// 昨天的 stagger 是「一排」（一維）。今天把方塊排成 8×8 網格，
// 加上 grid + from，讓進場順序從一條線變成二維的水波擴散。
// 一樣用 Vue 3（CDN）管按鈕狀態，stagger 本體交給 GSAP。

const { createApp, ref, computed, onMounted } = Vue;

createApp({
  setup() {
    // 狀態一：水波要從哪裡開始擴散
    const from = ref("center"); // center / edges / start / random
    // 狀態二：要不要只沿單一軸掃（配角，預設「無」= 同心圓水波）
    const axis = ref(""); // "" = 無 / "x" / "y"

    // 按鈕選項（用 v-for 生出來，不用手刻一顆顆）
    const froms = ["center", "edges", "start", "random"];
    const axes = [
      { value: "", label: "無" },
      { value: "x", label: "x" },
      { value: "y", label: "y" },
    ];

    // 畫面上顯示的設定文字（跟著狀態即時更新）
    // 選了 x / y 才把 axis 這個 key 補進字串，「無」保持乾淨
    const config = computed(() => {
      const axisPart = axis.value ? `, axis: "${axis.value}"` : "";
      return `stagger: { grid: [8, 8], from: "${from.value}"${axisPart}, amount: 0.9 }`;
    });

    // 用目前設定跑一次 grid stagger 動畫
    function play() {
      gsap.set(".cell", { scale: 0.3, opacity: 0 }); // 先歸位到「進場前」

      const staggerVars = {
        grid: [8, 8], // ← 今天的主角：告訴 GSAP 這是 8 列 8 欄的網格
        from: from.value, // 從哪個點開始往外算距離
        amount: 0.9, // 整組總共鋪開 0.9 秒
      };
      if (axis.value) staggerVars.axis = axis.value; // 有選 x / y 才塞

      gsap.to(".cell", {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
        stagger: staggerVars,
      });
    }

    // 換起點 / 換掃描軸：改狀態 + 重播（active 樣式交給 :class 自動處理）
    function pickFrom(f) {
      from.value = f;
      play();
    }
    function pickAxis(a) {
      axis.value = a;
      play();
    }

    // 等 Vue 把 64 個 .cell 渲染進 DOM 之後，才跑第一次動畫
    onMounted(play);

    return { from, axis, froms, axes, config, play, pickFrom, pickAxis };
  },
}).mount("#app");
