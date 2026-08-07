// Day 04 — Stagger 一維群組動畫（Vue 版）
// 主題還是 GSAP 的 stagger：一排方塊「錯開時間」依序進場。
// 這次用 Vue 3（CDN）管按鈕狀態，UI 接線交給反應式 + v-for + :class，
// stagger 本體照舊。（二維的 grid 波浪留給下一天）

const { createApp, ref, computed, onMounted } = Vue;

createApp({
  setup() {
    // 兩個狀態，按鈕點下去就是改它們
    const from = ref("start"); // start / center / end / edges / random
    const mode = ref("each"); // each（固定間隔）或 amount（總時間攤分）

    // 按鈕選項（用 v-for 生出來，不用手刻一顆顆）
    const froms = ["start", "center", "end", "edges", "random"];
    const modes = [
      { value: "each", label: "each 0.12（固定間隔）" },
      { value: "amount", label: "amount 0.8（總時間攤分）" },
    ];

    // stagger 設定物件：from / mode 一變，computed 自動重算
    const staggerConfig = computed(() =>
      mode.value === "amount"
        ? { amount: 0.8, from: from.value }
        : { each: 0.12, from: from.value }
    );

    // 畫面上顯示的設定文字（跟著狀態即時更新）
    const config = computed(() =>
      mode.value === "amount"
        ? `stagger: { amount: 0.8, from: "${from.value}" }`
        : `stagger: { each: 0.12, from: "${from.value}" }`
    );

    // 用目前設定跑一次 stagger 動畫
    function play() {
      gsap.set(".box", { opacity: 0, y: 40 }); // 先歸位到「進場前」
      gsap.to(".box", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: staggerConfig.value, // ← 今天的主角
      });
    }

    // 換方向 / 換模式：改狀態 + 重播（active 樣式交給 :class 自動處理）
    function pickFrom(f) {
      from.value = f;
      play();
    }
    function pickMode(m) {
      mode.value = m;
      play();
    }

    // 等 Vue 把 .box 用 v-for 渲染進 DOM 之後，才跑第一次動畫
    onMounted(play);

    return { from, mode, froms, modes, config, play, pickFrom, pickMode };
  },
}).mount("#app");
