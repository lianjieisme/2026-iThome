// Day 14 — ScrollTrigger 基礎：trigger / start / end / toggleActions。
//
// 主軸是「橋」：ScrollTrigger 不產生動畫，它只決定什麼時候呼叫 Day 11 學過的
// 那些動詞（play / reverse / restart / pause / resume）。
//
// 分工重點：
//   所有 GSAP 呼叫都是 vanilla，讀者可以整段抄走。
//   Vue 只負責控制項、狀態燈、即時程式碼區。

// ScrollTrigger 是外掛，用之前一定要註冊，忘了寫動畫就不會動。
gsap.registerPlugin(ScrollTrigger);

const { createApp, ref, reactive, computed, watch, onMounted } = Vue;

createApp({
  setup() {
    const stageEl = ref(null);
    const boxEl = ref(null);

    // 面板上四個開關的當下值，改任何一個都會把舊的 ScrollTrigger 收掉再建一條新的
    const config = reactive({
      markers: true,
      start: "top 80%",
      end: "bottom center",
      toggleActions: "play none none reverse",
    });

    const startOptions = [
      "top bottom",
      "top center",
      "top 80%",
      "center center",
      "top top+=100px",
    ];

    const endOptions = [
      "bottom top",
      "bottom center",
      "bottom 20%",
      "top top",
      "+=300",
    ];

    const actionOptions = [
      "play none none none",
      "play none none reverse",
      "restart pause resume reverse",
    ];

    const actionDescMap = {
      "play none none none": "最常用的一組：進場播一次，之後怎麼捲都不再管它。",
      "play none none reverse":
        "進場播、往回捲出去就倒回來，來回捲會看到一來一往。",
      "restart pause resume reverse":
        "四格都用上：進場從頭播、越過 end 就暫停、倒回來繼續播、捲出 start 就倒轉。",
    };

    const actionDesc = computed(() => actionDescMap[config.toggleActions]);

    // 四顆狀態燈，對應 toggleActions 的四個位置
    const lights = reactive([
      { key: "enter", label: "onEnter", on: false, count: 0 },
      { key: "leave", label: "onLeave", on: false, count: 0 },
      { key: "enterBack", label: "onEnterBack", on: false, count: 0 },
      { key: "leaveBack", label: "onLeaveBack", on: false, count: 0 },
    ]);

    const timers = {};

    function resetLights() {
      lights.forEach((l) => {
        l.count = 0;
        l.on = false;
      });
    }

    function flash(key) {
      const light = lights.find((l) => l.key === key);
      if (!light) return;
      light.count += 1;
      light.on = true;
      clearTimeout(timers[key]);
      timers[key] = setTimeout(() => {
        light.on = false;
      }, 700);
    }

    // 動畫目前播到哪。pause 的時候這個數字會凍住，resume 之後繼續跑，
    // 這是 toggleActions 第二、三格唯一看得見的證據
    const progress = ref(0);
    const progressText = computed(
      () => Math.round(progress.value * 100) + "%",
    );

    // 只有窄螢幕用得到：收起面板讓出畫面給 markers
    const panelOpen = ref(true);

    let tw = null;

    // 面板下方那塊即時程式碼，跟真正跑的設定共用同一份來源
    const codeText = computed(() => {
      return [
        "gsap.registerPlugin(ScrollTrigger);",
        "",
        "gsap.fromTo(",
        '  ".box",',
        "  { x: -150, rotation: 0, autoAlpha: 0.15 },",
        "  {",
        "    x: 150,",
        "    rotation: 360,",
        "    autoAlpha: 1,",
        "    duration: 3,",
        '    ease: "none",',
        "    scrollTrigger: {",
        '      trigger: ".stage",',
        `      start: "${config.start}",`,
        `      end: "${config.end}",`,
        `      toggleActions: "${config.toggleActions}",`,
        `      markers: ${config.markers},`,
        "    },",
        "  }",
        ");",
      ].join("\n");
    });

    // 重建：舊的先收乾淨，再建新的。
    // tween.kill() 只砍 tween，掛在上面的 ScrollTrigger 要自己另外收，
    // 不收的話開關切幾次就會疊出一堆殭屍 trigger（markers 會愈畫愈多條）。
    function rebuild() {
      if (tw) {
        if (tw.scrollTrigger) tw.scrollTrigger.kill();
        tw.kill();
        tw = null;
      }

      // 把上一條動畫留在元素上的 inline style 清掉，回到 CSS 的原始狀態
      gsap.set(boxEl.value, { clearProps: "all" });

      // 換了設定就是換一組實驗，計數重新從零開始算
      resetLights();
      progress.value = 0;

      tw = gsap.fromTo(
        boxEl.value,
        { x: -150, rotation: 0, autoAlpha: 0.15 },
        {
          x: 150,
          rotation: 360,
          autoAlpha: 1,
          // 故意做得很長（3 秒）而且等速。
          // 短動畫在你捲過 end 之前就播完了，那樣 pause / resume 會完全看不出效果
          duration: 3,
          ease: "none",
          onUpdate: () => {
            progress.value = tw ? tw.progress() : 0;
          },
          scrollTrigger: {
            trigger: stageEl.value,
            start: config.start,
            end: config.end,
            toggleActions: config.toggleActions,
            markers: config.markers,
            onEnter: () => flash("enter"),
            onLeave: () => flash("leave"),
            onEnterBack: () => flash("enterBack"),
            onLeaveBack: () => flash("leaveBack"),
          },
        },
      );
    }

    function backToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    watch(config, rebuild);

    onMounted(() => {
      rebuild();

      // 頁面剛載入時字型、圖片還在陸續就位，版面高度會變，
      // ScrollTrigger 用還沒定案的高度算出來的 start / end 是不準的，
      // 甚至會誤判成已經進場過一次。
      // 所以 load 之後補叫一次 refresh，把 start / end 重算成正確的位置。
      // （為什麼版面會變、refresh 又該在什麼時候叫，是後面幾天的主題）
      if (document.readyState === "complete") {
        setTimeout(() => ScrollTrigger.refresh(), 300);
      } else {
        window.addEventListener(
          "load",
          () => setTimeout(() => ScrollTrigger.refresh(), 300),
          { once: true },
        );
      }

      // 每次版面重算（載入完成、視窗縮放）之後，如果人還停在頁面最頂端，
      // 那燈上的數字一定不是他自己捲出來的，是重算過程的誤判，歸零重來。
      ScrollTrigger.addEventListener("refresh", () => {
        if (window.scrollY === 0) setTimeout(resetLights, 60);
      });
    });

    return {
      stageEl,
      boxEl,
      config,
      startOptions,
      endOptions,
      actionOptions,
      actionDesc,
      lights,
      codeText,
      progress,
      progressText,
      panelOpen,
      backToTop,
    };
  },
}).mount("#app");
