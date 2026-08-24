// Day 13 — 循環動畫：repeat / yoyo / repeatDelay / keyframes / repeatRefresh。
//
// 主軸是「一輪」：五個開關全部都在調同一顆球的同一輪的某個面向。
//
// 分工重點：
//   所有 GSAP 呼叫都是 vanilla，讀者可以整段抄走。
//   Vue 只負責控制項、狀態顯示、即時程式碼區。

const { createApp, ref, reactive, computed, onMounted } = Vue;

createApp({
  setup() {
    const ballEl = ref(null);

    // 五個開關的當下值。改任何一個都會重建 tween
    const config = reactive({
      repeat: 2, // 預設就停在計數坑的畫面：設 2，指示燈會亮三格
      yoyo: false,
      repeatDelay: 0,
      keyframes: false,
      repeatRefresh: false,
    });

    const repeatOptions = [-1, 0, 1, 2, 3];

    const playedRounds = ref(0); // 已經「開始播」了幾輪
    const trails = ref([]); // 每一輪的落點，用來看 repeatRefresh 有沒有生效
    const ballX = ref(0);
    const running = ref(false);

    let tw = null;
    let peak = 0; // 這一輪跑到最遠的 x，輪結束時記進 trails

    // repeat 是 -1 就沒有固定格數，改用旁邊那顆 ∞ 表示
    const cellCount = computed(() =>
      config.repeat < 0 ? 0 : config.repeat + 1,
    );

    const roundsLabel = computed(() => {
      if (config.repeat < 0) return `已播 ${playedRounds.value} 輪（無限）`;
      return `已播 ${playedRounds.value} / 總共 ${config.repeat + 1} 輪`;
    });

    // 依照當下設定組出 tween 的 vars。
    // 這個物件就是畫面下方即時程式碼區顯示的東西，兩邊共用同一份來源
    function buildVars() {
      const vars = {
        ease: "power1.inOut",
        repeat: config.repeat,
        yoyo: config.yoyo,
        repeatDelay: config.repeatDelay,
        repeatRefresh: config.repeatRefresh,
      };

      if (config.keyframes) {
        // 一輪裡面跑三段：先橫move、再跳起來、最後落下並轉一圈。
        // keyframes 只能用在 to() 裡，每段自己帶 duration，會依序接起來
        vars.keyframes = [
          { x: "random(120, 380)", duration: 0.55 },
          { y: -46, duration: 0.25, ease: "power2.out" },
          { y: 0, rotation: "+=360", duration: 0.4, ease: "power2.in" },
        ];
      } else {
        vars.x = "random(120, 380)";
        vars.duration = 1.1;
      }

      return vars;
    }

    // 一輪結束時把這輪跑到的最遠位置記下來。
    // repeat: -1 會無限跑，所以要設上限，不然這個陣列會一直長大
    const TRAIL_MAX = 8;

    function commitTrail() {
      const x = Math.round(peak);
      if (x > 0) {
        trails.value.push(x);
        if (trails.value.length > TRAIL_MAX) trails.value.shift();
      }
      peak = 0;
    }

    function rebuild() {
      // 先把上一條收乾淨。Day 12 學到的順序：revert() 要在 kill() 之前，
      // 而且 revert 會連 GSAP 寫的 inline style 一起清掉，
      // 下一輪的起點才會是乾淨的 x: 0
      tw?.revert();
      tw = null;
      gsap.set(ballEl.value, { clearProps: "all" });

      playedRounds.value = 0;
      trails.value = [];
      ballX.value = 0;
      peak = 0;

      const vars = buildVars();

      tw = gsap.to(ballEl.value, {
        ...vars,
        onStart() {
          running.value = true;
          playedRounds.value = 1;
        },
        onUpdate() {
          const x = gsap.getProperty(ballEl.value, "x");
          ballX.value = Math.round(x);
          if (x > peak) peak = x;
        },
        // 每進新的一輪觸發一次。這就是指示燈往前亮的時機
        onRepeat() {
          commitTrail();
          playedRounds.value += 1;
        },
        onComplete() {
          commitTrail();
          running.value = false;
        },
      });
    }

    function setRepeat(value) {
      config.repeat = value;
      rebuild();
    }

    function setDelay(value) {
      config.repeatDelay = Number(value);
      rebuild();
    }

    function toggle(key) {
      config[key] = !config[key];
      rebuild();
    }

    // 即時程式碼區。把當下的 vars 印成人看得懂的樣子
    const codeText = computed(() => {
      const lines = ["gsap.to(box, {"];

      if (config.keyframes) {
        lines.push("  keyframes: [");
        lines.push('    { x: "random(120, 380)", duration: 0.55 },');
        lines.push('    { y: -46, duration: 0.25, ease: "power2.out" },');
        lines.push('    { y: 0, rotation: "+=360", duration: 0.4, ease: "power2.in" },');
        lines.push("  ],");
      } else {
        lines.push('  x: "random(120, 380)",');
        lines.push("  duration: 1.1,");
      }

      lines.push(`  repeat: ${config.repeat},`);
      if (config.yoyo) lines.push("  yoyo: true,");
      if (config.repeatDelay > 0)
        lines.push(`  repeatDelay: ${config.repeatDelay},`);
      if (config.repeatRefresh) lines.push("  repeatRefresh: true,");
      lines.push("});");

      const total =
        config.repeat < 0 ? "無限" : `${config.repeat + 1}`;
      lines.push("");
      lines.push(`// repeat: ${config.repeat} → 實際播 ${total} 輪`);

      return lines.join("\n");
    });

    const note = computed(() => {
      if (config.repeat === 0) {
        return "repeat: 0 就是不重複，只播一輪，跟不寫 repeat 一樣。";
      }
      if (!config.repeatRefresh) {
        return "現在 repeatRefresh 是關的：random 只在建立 tween 的當下抽一次，所以每一輪的落點都疊在同一個地方。把它打開再看一次。";
      }
      return "repeatRefresh 打開了：每跑完一輪，GSAP 會重新抽一次 random，所以落點會散開。注意官方文件寫的是每一輪完整循環重抽，yoyo 的回程不算。";
    });

    onMounted(rebuild);

    return {
      ballEl,
      config,
      repeatOptions,
      cellCount,
      playedRounds,
      roundsLabel,
      trails,
      ballX,
      running,
      codeText,
      note,
      setRepeat,
      setDelay,
      toggle,
      rebuild,
    };
  },
}).mount("#app");
