// Day 12 — 怎麼把動畫停掉：kill / killTweensOf / overwrite。
//
// 主軸是「砍動畫，單位是誰」：那一條、那個元素、還是那些衝突的屬性。
//
// 分工重點：
//   所有 GSAP 呼叫都是 vanilla，讀者可以整段抄走。
//   Vue 只負責按鈕、狀態顯示、即時程式碼區。

const { createApp, ref, reactive, computed, onMounted } = Vue;

createApp({
  setup() {
    const DIST = 380; // 球要跑的距離
    const DUR = 4; // 跑完要幾秒，故意慢，才來得及在半路處置它

    // ---------- 舞台一：四種停法 ----------

    // 每顆球一種下場。用 reactive 是因為 el 跟 inline 都要在畫面上跟著變
    const balls = reactive([
      {
        key: "none",
        label: "什麼都不做",
        desc: "對照組，讓它跑完",
        el: null,
        tween: null,
      },
      {
        key: "pause",
        label: "pause()",
        desc: "停住，但動畫還活著",
        el: null,
        tween: null,
      },
      {
        key: "kill",
        label: "kill()",
        desc: "整條移除，救不回來",
        el: null,
        tween: null,
      },
      {
        key: "revert",
        label: "revert()",
        desc: "移除，而且把 inline style 清掉",
        el: null,
        tween: null,
      },
    ]);

    balls.forEach((b) => (b.inline = ""));

    const lastAction = ref("// 按按鈕看看");

    // 把四顆球身上的 inline style 抄到畫面。
    // 這是今天最關鍵的觀察窗：kill 之後 transform 還在，revert 之後會變空的
    function syncStyles() {
      balls.forEach((b) => {
        b.inline = b.el ? b.el.style.transform : "";
      });
    }

    function startAll() {
      balls.forEach((b) => {
        // 上一輪可能留下還活著或已經死掉的 tween，先確保它不再影響這顆球
        b.tween?.kill();
        // 每一輪都先把元素洗乾淨再重來，兩個理由：
        // ① to() 是從「現在的位置」起跑，上一輪停在半路的球會殘留 inline style，
        //    不清的話四顆的起點不一致
        // ② 起點乾淨，待會 revert() 才會把 transform 還原成真正的空字串，
        //    下面那個觀察窗才看得出 kill 跟 revert 差在哪
        gsap.set(b.el, { clearProps: "all" });
        b.tween = gsap.to(b.el, {
          x: DIST,
          duration: DUR,
          ease: "none",
          onUpdate: syncStyles,
        });
      });
      lastAction.value = `// 四顆球同時起跑，先把上一輪的殘留洗掉
balls.forEach((b) => {
  gsap.set(b.el, { clearProps: "all" });
  b.tween = gsap.to(b.el, { x: ${DIST}, duration: ${DUR}, ease: "none" });
});`;
      syncStyles();
    }

    function applyAll() {
      const [none, pause, kill, revert] = balls;
      // none 不動它
      pause.tween?.pause();
      kill.tween?.kill();
      revert.tween?.revert();
      syncStyles();

      lastAction.value = `// 同一個瞬間，四顆球各自遭遇一種停法
// 什麼都不做 → 繼續跑
pauseBall.tween.pause();   // 停住，之後 play() 還能續播
killBall.tween.kill();     // 移除，play() 不會有反應，但 inline style 還在
revertBall.tween.revert(); // 移除 + 把 GSAP 寫的 inline style 清掉，所以彈回起點`;
    }

    function resumeAll() {
      // 對四顆通通呼叫 play()。只有 pause 那顆會真的動起來，
      // 被 kill / revert 的那兩條已經不存在了，呼叫它們不會有事發生
      balls.forEach((b) => b.tween?.play());
      syncStyles();
      lastAction.value = `// 對四顆通通 play()
balls.forEach((b) => b.tween.play());
// 只有 pause 那顆會繼續跑，kill 跟 revert 的已經死了`;
    }

    // ---------- 舞台二：overwrite 三值 ----------

    const duoBall = ref(null);
    const mode = ref("auto");
    const rotating = ref(false);
    const duoX = ref(0);

    const modes = [
      { value: false, label: "false（預設）" },
      { value: true, label: "true" },
      { value: "auto", label: '"auto"' },
    ];

    const MODE_INFO = {
      false: {
        desc: "誰都不砍",
        note: "兩條動畫同時搶同一個 x，畫面會抖，這就是 Day 7 那個鬼影的來源。旋轉不受影響。",
      },
      true: {
        desc: "同元素的全砍",
        note: "新 tween 一建立就把這顆球身上所有動畫砍光，包括跟它毫無關係的旋轉。這就是連坐。",
      },
      auto: {
        desc: "只砍屬性衝突的",
        note: "只砍掉正在跑、而且同樣在動 x 的那條。旋轉動的是 rotation，不衝突，所以活下來了。",
      },
    };

    const modeKey = computed(() => String(mode.value));
    const modeLabel = computed(
      () => modes.find((m) => m.value === mode.value).label,
    );
    const modeDesc = computed(() => MODE_INFO[modeKey.value].desc);
    const modeNote = computed(() => MODE_INFO[modeKey.value].note);

    let moveTween = null;
    let spinTween = null;

    // 「旋轉還活著嗎」要問元素，不能問那條 tween 自己。
    // 被 overwrite 砍掉的 tween，拿舊 reference 去問 isActive() 還是會回答 true，
    // 因為它自己的時間軸確實還在範圍內，它只是已經被從排程裡拔掉了。
    // gsap.getTweensOf(元素) 問的是「這個元素身上現在還掛著哪些活的 tween」，才是真相
    function isSpinAlive() {
      return gsap
        .getTweensOf(duoBall.value)
        .some((t) => "rotation" in t.vars);
    }

    // 重置場景：球回原點，重新掛上「移動」跟「旋轉」兩條動畫
    function resetDuo() {
      moveTween?.revert();
      spinTween?.revert();
      gsap.set(duoBall.value, { x: 0, rotation: 0 });

      moveTween = gsap.to(duoBall.value, {
        x: DIST,
        duration: DUR,
        ease: "none",
        onUpdate: () => {
          duoX.value = Math.round(gsap.getProperty(duoBall.value, "x"));
        },
      });

      // 這條跟 x 沒有任何關係，它是用來當「連坐」的證人
      spinTween = gsap.to(duoBall.value, {
        rotation: 360,
        duration: 2,
        ease: "none",
        repeat: -1,
      });
      rotating.value = true;
    }

    function pickMode(value) {
      mode.value = value;
      resetDuo();
      lastAction.value = `// 換成 overwrite: ${JSON.stringify(value)}，場景重置
// 球身上現在有兩條動畫：x 位移 + rotation 旋轉`;
    }

    function fire() {
      // 新 tween 只動 x，完全沒碰 rotation。
      // 但 overwrite: true 是以「元素」為單位，所以連旋轉都會被砍掉
      gsap.to(duoBall.value, {
        x: 0,
        duration: 1,
        ease: "power2.out",
        overwrite: mode.value,
        onUpdate: () => {
          duoX.value = Math.round(gsap.getProperty(duoBall.value, "x"));
          rotating.value = isSpinAlive();
        },
        onComplete: () => {
          rotating.value = isSpinAlive();
        },
      });

      lastAction.value = `// 這條新 tween 只動 x，沒碰 rotation
gsap.to(ball, {
  x: 0,
  duration: 1,
  overwrite: ${JSON.stringify(mode.value)},
});
// ${MODE_INFO[modeKey.value].note}`;
    }

    const config = computed(() => lastAction.value);

    onMounted(() => {
      startAll();
      resetDuo();
    });

    return {
      balls,
      startAll,
      applyAll,
      resumeAll,
      duoBall,
      mode,
      modes,
      modeLabel,
      modeDesc,
      modeNote,
      rotating,
      duoX,
      pickMode,
      fire,
      config,
    };
  },
}).mount("#app");
