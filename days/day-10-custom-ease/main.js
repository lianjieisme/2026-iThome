// Day 10 — 自訂 easing（CustomEase）：內建 ease 是別人畫好的曲線，這天自己畫一條。
//
// 分工重點：
//   拉曲線這件事交給官方的 Ease Visualizer，這裡不重造一個。
//   demo 負責的是官網沒有的那半段：同一條曲線，
//   圖跟實際動起來的樣子擺在一起看，旁邊還有內建的 ease 當對照組。

const { createApp, ref, computed, onMounted } = Vue;

gsap.registerPlugin(CustomEase);

createApp({
  setup() {
    // 兩顆方塊共用的動畫參數，確保差異只來自 ease 本身
    const DISTANCE = 240;
    const DURATION = 1.6;

    // 對照組固定用 power2.out，也就是 Day 3 提過的 GSAP 預設值
    const REF_EASE = "power2.out";

    // 四條現成曲線。前兩條是四個數字（跟 CSS cubic-bezier 同一套寫法），
    // 後兩條是 SVG path（四個數字畫不出來的多轉折形狀）。
    const presets = [
      {
        name: "smooth",
        label: "平順進出",
        str: "0.65, 0, 0.35, 1",
        note: "四個數字的寫法，頭尾慢、中間快，全程乖乖待在 0 到 1 之間。跟 CSS 的 cubic-bezier() 是同一套數字。",
      },
      {
        name: "overshoot",
        label: "衝過頭",
        str: "0.34, 1.56, 0.64, 1",
        note: "一樣是四個數字，但第二個值大於 1，曲線就爬出上面那條基準線，方塊會先衝過終點再退回來。",
      },
      {
        name: "wobble",
        label: "來回擺盪",
        str: "M0,0 C0.1,0 0.2,1.2 0.35,1.2 C0.45,1.2 0.5,0.85 0.6,0.85 C0.7,0.85 0.75,1.08 0.85,1.08 C0.92,1.08 0.95,1 1,1",
        note: "SVG path 寫法。衝過頭、退回來、再衝一次才停，這種多次轉折是四個數字做不到的，也是 CustomEase 真正解鎖的東西。",
      },
      {
        name: "anticipate",
        label: "先退再衝",
        str: "M0,0 C0.1,-0.25 0.2,-0.3 0.35,-0.25 C0.5,-0.2 0.7,1 1,1",
        note: "曲線先掉到 0 以下，方塊會先往反方向縮一下再彈出去，像投球前的預備動作。",
      },
    ];

    // 四條曲線一次全部建好。建好之後這四個名字就跟 power2.out 一樣，
    // 隨時能當字串塞進 ease，不用每次切換再 create 一次。
    presets.forEach((p) => {
      p.ease = CustomEase.create(p.name, p.str);
    });

    const index = ref(0);
    const current = computed(() => presets[index.value]);

    const refBox = ref(null);
    const customBox = ref(null);

    // 曲線圖的座標系。x 是時間、y 是完成度，
    // PAD 是上下留白，overshoot 超出 0-1 的部分才不會被裁掉。
    const W = 320;
    const H = 260;
    const PAD = 50;

    // 完成度 → SVG 的 y。SVG 的 y 是往下長的，所以要倒過來
    const yOf = (v) => H - PAD - v * (H - PAD * 2);

    // 今天最關鍵的一行認知：CustomEase.create() 回傳的就是一個函式，
    // 餵時間進度（0-1）進去，吐出動畫完成度（0-1）。
    // 所以曲線圖不用自己算貝茲，沿路取樣一百個點連起來就好。
    function toPoints(ease) {
      const SAMPLES = 100;
      return Array.from({ length: SAMPLES + 1 }, (_, i) => {
        const t = i / SAMPLES;
        return `${t * W},${yOf(ease(t))}`;
      }).join(" ");
    }

    // 內建的 ease 也是同一種函式，用 gsap.parseEase() 把名字換成函式就能一起畫
    const refPoints = toPoints(gsap.parseEase(REF_EASE));

    const customPoints = computed(() => toPoints(current.value.ease));

    // 畫面上那塊即時程式碼：跟著選中的曲線變
    const config = computed(
      () => `gsap.registerPlugin(CustomEase);

// 取名 + 給曲線，建好之後那個名字就跟 power2.out 一樣能當字串用
CustomEase.create("${current.value.name}", "${current.value.str}");

gsap.to(".box", {
  x: ${DISTANCE},
  duration: ${DURATION},
  ease: "${current.value.name}",
});`,
    );

    // 兩顆方塊同時起跑，跑一樣的距離、一樣的時間，差別只有 ease。
    // overwrite: true 是為了連點：沒有它的話上一次還沒跑完的動畫不會被清掉，
    // 兩個動畫同時搶同一顆方塊的 x，畫面會抖。
    function play() {
      gsap.fromTo(
        refBox.value,
        { x: 0 },
        { x: DISTANCE, duration: DURATION, ease: REF_EASE, overwrite: true },
      );
      gsap.fromTo(
        customBox.value,
        {
          x: 0,
        },
        {
          x: DISTANCE,
          duration: DURATION,
          ease: current.value.name,
          overwrite: true,
        },
      );
    }

    // 按按鈕就換曲線並且重跑。點的是同一顆時 index 沒變，
    // 但一樣會 play()，這樣讀者想再看一次就直接按那顆就好。
    function select(i) {
      index.value = i;
      play();
    }

    onMounted(play);

    return {
      presets,
      index,
      current,
      select,
      refBox,
      customBox,
      refPoints,
      customPoints,
      yOf,
      config,
      play,
    };
  },
}).mount("#app");
