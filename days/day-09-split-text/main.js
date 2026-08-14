// Day 09 — 文字逐字進場：把一整串文字拆成一個一個元素，再套 stagger。
//
// 分工重點：
//   stagger 需要「一堆元素」，但文字只有一個元素，所以動畫之前得先製造元素。
//   上排自己用 split('') 拆，下排交給 SplitText，兩排跑一模一樣的動畫參數，
//   差別全部來自拆字方式本身。

const { createApp, ref, computed, watch, onMounted, nextTick } = Vue;

gsap.registerPlugin(SplitText);

createApp({
  setup() {
    // 今天唯一的觀念開關：手動拆出來的 span 要不要 display: inline-block
    const inlineBlock = ref(true);

    // 四塊文字的 DOM 參考。這些節點會被改寫，所以不能讓 Vue 去渲染內容
    const manualZh = ref(null);
    const manualEn = ref(null);
    const splitZh = ref(null);
    const splitEn = ref(null);

    // 四塊各自的字元陣列。純 DOM 元素，不要放進 reactive，不然 Vue 會去代理它。
    // 分開放是為了讓四塊同時起跑，串成一個陣列的話 stagger 會排隊排到天荒地老。
    const charSets = [];

    // 兩排共用的動畫參數，確保差異只來自拆字方式
    const TWEEN = { opacity: 0, y: 24, duration: 0.5, ease: "power2.out" };
    const STAGGER = 0.04;

    // 畫面上那塊即時程式碼：跟著開關變
    const config = computed(
      () => `// 上排：自己拆。span 預設是 inline，${inlineBlock.value ? "有" : "沒"}加 inline-block
el.innerHTML = el.textContent
  .split("")
  .map((c) => \`<span class="char">\${c}</span>\`)
  .join("");
// .char { display: ${inlineBlock.value ? "inline-block" : "inline"}; }

// 下排：交給外掛。同時拆 words 和 chars，英文才不會從單字中間斷開
const split = SplitText.create(el, { type: "words, chars" });

// 兩排一模一樣的動畫
gsap.from(chars, { opacity: 0, y: 24, stagger: ${STAGGER}, duration: 0.5, ease: "power2.out" });`,
    );

    // 手動拆字：把一整串文字換成一堆 span。
    // 空白刻意不包進 span，直接留原始空白字元：
    // 包起來的話寬度會被收掉，改用 &nbsp; 又會變成不可斷行空白，整行衝出容器。
    function splitByHand(el) {
      const text = el.textContent.trim();
      el.innerHTML = text
        .split("")
        .map((c) => (c === " " ? c : `<span class="char">${c}</span>`))
        .join("");
      return Array.from(el.querySelectorAll(".char"));
    }

    // 重播：四塊同時起跑，各自用同一組參數
    function playAll() {
      charSets.forEach((chars) => {
        gsap.from(chars, { ...TWEEN, stagger: STAGGER });
      });
    }

    onMounted(() => {
      // 上排：自己動手
      const manual = [splitByHand(manualZh.value), splitByHand(manualEn.value)];

      // 下排：交給外掛。type 同時給 words 和 chars，
      // 只拆 chars 的話英文會從單字中間換行（也可以改用 smartWrap: true）
      const zh = SplitText.create(splitZh.value, { type: "words, chars" });
      const en = SplitText.create(splitEn.value, { type: "words, chars" });

      charSets.push(...manual, zh.chars, en.chars);

      // 拆完才讓文字現身，避免拆字前的原始文字先閃一下（FOUC）
      gsap.set([manualZh.value, manualEn.value, splitZh.value, splitEn.value], {
        visibility: "visible",
      });

      playAll();
    });

    // 切換開關之後要重播，不然畫面靜止，看不出差在哪
    watch(inlineBlock, async () => {
      await nextTick();
      playAll();
    });

    return { inlineBlock, manualZh, manualEn, splitZh, splitEn, config, playAll };
  },
}).mount("#app");
