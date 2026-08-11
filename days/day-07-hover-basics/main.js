// Day 07 — Hover 互動基礎：三顆按鈕切換 basic / overwrite / timeline 三種寫法。

const { createApp, ref, computed, onMounted } = Vue;

const REST = { scale: 1, backgroundColor: "#38bdf8" };
const ENTER = { scale: 1.4, backgroundColor: "#4ade80" };
// 進場慢、離場快：故意的，讓 basic 的「鬼影」現形（詳見文章）。
const ENTER_DUR = 1.6;
const LEAVE_DUR = 0.35;
const EASE = "power3.out";

createApp({
  setup() {
    // 目前選的寫法
    const mode = ref("basic");

    const modes = [
      { value: "basic", label: "基本" },
      { value: "overwrite", label: "overwrite" },
      { value: "timeline", label: "timeline" },
    ];

    // 每種寫法對應的處理程式碼（畫面上那塊會照這個顯示）
    const configs = {
      basic: `// 進場慢(1.6s)、離場快(0.35s)：故意的，讓鬼影現形
card.addEventListener("mouseenter", () => {
  gsap.to(card, { scale: 1.4, backgroundColor: "#4ade80", duration: 1.6, ease: "power3.out" });
});
card.addEventListener("mouseleave", () => {
  gsap.to(card, { scale: 1, backgroundColor: "#38bdf8", duration: 0.35, ease: "power3.out" });
});`,
      overwrite: `card.addEventListener("mouseenter", () => {
  gsap.to(card, { scale: 1.4, backgroundColor: "#4ade80", duration: 1.6, ease: "power3.out", overwrite: "auto" });
});
card.addEventListener("mouseleave", () => {
  gsap.to(card, { scale: 1, backgroundColor: "#38bdf8", duration: 0.35, ease: "power3.out", overwrite: "auto" });
});`,
      timeline: `// 每張卡各自建一條 paused timeline，存起來
const tl = gsap.timeline({ paused: true });
tl.to(card, { scale: 1.4, backgroundColor: "#4ade80", duration: 1.6, ease: "power3.out" });

card.addEventListener("mouseenter", () => tl.play());
card.addEventListener("mouseleave", () => tl.reverse()); // 倒著播，連 ease 也倒`,
    };

    const config = computed(() => configs[mode.value]);

    // 三張 GSAP 卡的 DOM，跟各自的 timeline（index 對應）
    let cards = [];
    const timelines = [];

    // 滑入（進場：慢）
    function onEnter(i) {
      const card = cards[i];
      switch (mode.value) {
        case "overwrite":
          gsap.to(card, {
            ...ENTER,
            duration: ENTER_DUR,
            ease: EASE,
            overwrite: "auto",
          });
          break;
        case "timeline":
          timelines[i].play();
          break;
        default: // basic：不加 overwrite，沒跑完的進場之後會復活變鬼影
          gsap.to(card, { ...ENTER, duration: ENTER_DUR, ease: EASE });
      }
    }

    // 滑出（離場：快）
    function onLeave(i) {
      const card = cards[i];
      switch (mode.value) {
        case "overwrite":
          gsap.to(card, {
            ...REST,
            duration: LEAVE_DUR,
            ease: EASE,
            overwrite: "auto",
          });
          break;
        case "timeline":
          timelines[i].reverse();
          break;
        default:
          gsap.to(card, { ...REST, duration: LEAVE_DUR, ease: EASE });
      }
    }

    // 幫一張卡建一條 paused timeline（進場：放大 + 變色）
    function makeTimeline(card) {
      const tl = gsap.timeline({ paused: true });
      tl.to(card, { ...ENTER, duration: ENTER_DUR, ease: EASE });
      return tl;
    }

    // 換寫法：把三張卡歸位，避免殘留上一個模式的狀態
    function pickMode(m) {
      mode.value = m;
      cards.forEach((card, i) => {
        gsap.killTweensOf(card); // 砍掉還沒跑完的 tween
        gsap.set(card, REST); // 視覺歸位
        //  killTweensOf 會連 timeline 裡的子動畫一起砍掉，所以要重建這條 timeline
        timelines[i] = makeTimeline(card);
      });
    }

    onMounted(() => {
      cards = Array.from(document.querySelectorAll(".card:not(.card--css)"));
      // 每張卡各自一條 paused timeline（不能共用一條）
      cards.forEach((card) => {
        timelines.push(makeTimeline(card));
      });
    });

    return { mode, modes, config, onEnter, onLeave, pickMode };
  },
}).mount("#app");
