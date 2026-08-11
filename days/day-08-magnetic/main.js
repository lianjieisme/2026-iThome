// Day 08 — Magnetic 滑鼠跟隨：用 gsap.quickTo() 做高頻率更新。
// 左邊「跟屁蟲」黏著滑鼠絕對位置；右邊「磁吸」朝滑鼠方向偏移一點、離開彈回。
//
// 分工重點：
//   連續跟隨(高頻) → quickTo，ease 用 power 系(穩定)。
//   離開回原點 → 一樣交給 quickTo 自己滑回 0，過衝的彈性改疊加在 scale 上，
//   位移跟縮放是不同屬性，不會互搶，quickTo 的 x/y 也就永遠不會被砍掉。

const { createApp, ref, reactive, computed, watch, onMounted, onUnmounted } =
  Vue;

createApp({
  setup() {
    // 磁吸的手感旋鈕（跟屁蟲固定參數當對照）
    const strength = ref(0.4); // 偏移比例：乘在 dx/dy 上，即時讀取，不用重建
    const duration = ref(0.6); // 追上去要多久：quickTo 建立時就固定，改了要重建
    const ease = ref("power3"); // 跟隨的尾勁
    const eases = ["power2", "power3", "power4"];

    // 磁吸按鈕當前的實際偏移量，秀在畫面上幫讀者「看見」相對位移
    const offset = reactive({ x: 0, y: 0 });

    // 畫面上那塊即時程式碼：數字會跟著旋鈕變
    const config = computed(
      () => `// 跟隨(高頻)：只建一次，之後每次滑鼠動只餵值，不重建
const xTo = gsap.quickTo(btn, "x", { duration: ${duration.value}, ease: "${ease.value}" });
const yTo = gsap.quickTo(btn, "y", { duration: ${duration.value}, ease: "${ease.value}" });

area.addEventListener("mousemove", (e) => {
  const r = btn.getBoundingClientRect();
  const dx = e.clientX - (r.left + r.width / 2);
  const dy = e.clientY - (r.top + r.height / 2);
  xTo(dx * ${strength.value}); // 只跟 ${Math.round(strength.value * 100)}%，不完全貼上去
  yTo(dy * ${strength.value});
});

// 離開：位置交給 quickTo 自己滑回 0，過衝疊在 scale（不同屬性，不會互搶）
area.addEventListener("mouseleave", () => {
  xTo(0);
  yTo(0);
  gsap.fromTo(btn, { scale: 1.12 }, { scale: 1, duration: 0.4, ease: "back.out(2)" });
});`,
    );

    // DOM refs
    const followArea = ref(null);
    const follower = ref(null);
    const magneticArea = ref(null);
    const magneticBtn = ref(null);

    // 跟屁蟲的 quickTo 函式，手感固定，只需要建一次
    let fxTo, fyTo;
    function buildFollow() {
      fxTo = gsap.quickTo(follower.value, "x", {
        duration: 0.4,
        ease: "power3",
      });
      fyTo = gsap.quickTo(follower.value, "y", {
        duration: 0.4,
        ease: "power3",
      });
    }

    // 磁吸的 quickTo 函式（duration / ease 變了要重建，所以放外層變數重新指派）
    // 注意：刻意用 let 存純變數，不包成 ref，因為不需要顯示在畫面上，
    // mousemove 一秒觸發上百次，沒必要多背響應式追蹤的開銷。
    let magXTo, magYTo;
    function buildMagnetic() {
      // quickTo 一次只綁一個屬性，所以 x / y 各建一個
      magXTo = gsap.quickTo(magneticBtn.value, "x", {
        duration: duration.value,
        ease: ease.value,
      });
      magYTo = gsap.quickTo(magneticBtn.value, "y", {
        duration: duration.value,
        ease: ease.value,
      });
    }

    // duration / ease 是 quickTo 建立時就固定的設定，只要任一個變了就重建。
    // HTML 那邊只管單純賦值（duration 用 @change、ease 用 @click），
    // 重建這件事統一交給這裡的 watch 處理，不用每個地方各自記得呼叫。
    watch([duration, ease], () => {
      buildMagnetic();
    });

    // 以下三個是給 HTML 的 @mousemove / @mouseleave 直接綁定用的樣板事件，
    // 取代原本在 onMounted 手動 addEventListener 的寫法。

    // 左邊跟屁蟲：直接飛到滑鼠在區塊內的位置（絕對位置）
    function onFollowMove(e) {
      const r = followArea.value.getBoundingClientRect();
      const half = 12; // 方塊半寬，對應 CSS .follower 的 24px
      // 用 clamp 把中心點夾在邊界內縮 half 的範圍，滑鼠貼邊時方塊也不會被裁掉一半
      const cx = gsap.utils.clamp(half, r.width - half, e.clientX - r.left);
      const cy = gsap.utils.clamp(half, r.height - half, e.clientY - r.top);
      fxTo(cx - half);
      fyTo(cy - half);
    }

    // 右邊磁吸：滑鼠在感應區移動
    function onMagneticMove(e) {
      const r = magneticBtn.value.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      magXTo(dx * strength.value);
      magYTo(dy * strength.value);
    }

    // 右邊磁吸：滑鼠離開感應區
    // 位置(x/y)交給 quickTo 自己平順滑回原點，過衝的彈性改疊加在 scale 上，
    // 兩邊動的是不同屬性，quickTo 的 x/y 永遠不會被外部 tween 砍掉。
    function onMagneticLeave() {
      magXTo(0);
      magYTo(0);
      // 從稍微放大的 1.12 彈回 1，back.out 讓它中途過衝一下再回正，做出 Q 彈的釋放感
      gsap.fromTo(
        magneticBtn.value,
        { scale: 1.12 },
        { scale: 1, duration: 0.4, ease: "back.out(2)" },
      );
    }

    let tickerFn;

    onMounted(() => {
      buildFollow();
      buildMagnetic();

      // 每幀讀一次磁吸按鈕的實際位移，更新畫面上的 x / y 數值
      tickerFn = () => {
        offset.x = Math.round(gsap.getProperty(magneticBtn.value, "x"));
        offset.y = Math.round(gsap.getProperty(magneticBtn.value, "y"));
      };
      gsap.ticker.add(tickerFn);
    });

    onUnmounted(() => {
      if (tickerFn) gsap.ticker.remove(tickerFn);
    });

    return {
      strength,
      duration,
      ease,
      eases,
      offset,
      config,
      followArea,
      follower,
      magneticArea,
      magneticBtn,
      onFollowMove,
      onMagneticMove,
      onMagneticLeave,
    };
  },
}).mount("#app");
