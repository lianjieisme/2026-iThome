// Day 06 — Timeline 串接 + position parameter（Vue 版）
// 前幾天都是「單一動畫」內部的變化。今天把三個不同動畫（A 滑入、B 淡入、
// C 一排 stagger）串成一條 timeline，再用第三個參數（position parameter）
// 控制它們的先後與重疊。按鈕切換五種寫法，config 文字同步顯示對應程式碼。
// 一樣用 Vue 3（CDN）管按鈕狀態，timeline 本體交給 GSAP。

const { createApp, ref, computed, onMounted } = Vue;

createApp({
  setup() {
    // 目前選的 position parameter 模式
    const mode = ref("default");

    // 五種寫法（用 v-for 生按鈕，不用手刻一顆顆）
    const modes = [
      { value: "default", label: "排隊(預設)" },
      { value: "absolute", label: "絕對數字" },
      { value: "overlap", label: "重疊(-=0.3)" },
      { value: "gap", label: "留空檔(+=0.5)" },
      { value: "together", label: "同時(<)" },
      { value: "label", label: "label" },
    ];

    // 每個模式對應的程式碼片段（畫面上那塊會照這個顯示）
    const configs = {
      default: `tl.to(".box-a", { x: 0, autoAlpha: 1 })
  .to(".box-b", { y: 0, autoAlpha: 1 })
  .to(".cell", { scale: 1, autoAlpha: 1, stagger: 0.12 });`,
      absolute: `tl.to(".box-a", { x: 0, autoAlpha: 1 }, 0)
  .to(".box-b", { y: 0, autoAlpha: 1 }, 0.8)
  .to(".cell", { scale: 1, autoAlpha: 1, stagger: 0.12 }, 1.6);`,
      overlap: `tl.to(".box-a", { x: 0, autoAlpha: 1 })
  .to(".box-b", { y: 0, autoAlpha: 1 }, "-=0.3")
  .to(".cell", { scale: 1, autoAlpha: 1, stagger: 0.12 }, "-=0.3");`,
      gap: `tl.to(".box-a", { x: 0, autoAlpha: 1 })
  .to(".box-b", { y: 0, autoAlpha: 1 }, "+=0.5")
  .to(".cell", { scale: 1, autoAlpha: 1, stagger: 0.12 }, "+=0.5");`,
      together: `tl.to(".box-a", { x: 0, autoAlpha: 1 })
  .to(".box-b", { y: 0, autoAlpha: 1 }, "<")
  .to(".cell", { scale: 1, autoAlpha: 1, stagger: 0.12 }, "<");`,
      label: `tl.to(".box-a", { x: 0, autoAlpha: 1 })
  .addLabel("second")
  .to(".box-b", { y: 0, autoAlpha: 1 }, "second")
  .to(".cell", { scale: 1, autoAlpha: 1, stagger: 0.12 }, "second+=0.4");`,
    };

    const config = computed(() => configs[mode.value]);

    // 用目前模式建一條 timeline 重播
    function play() {
      // 先把三步都歸位到「進場前」
      gsap.set(".box-a", { x: -120, autoAlpha: 0 });
      gsap.set(".box-b", { y: 30, autoAlpha: 0 });
      gsap.set(".cell", { scale: 0, autoAlpha: 0 });

      // defaults：三個 tween 共用 duration / ease，不用每個重寫
      const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.out" } });

      switch (mode.value) {
        case "absolute":
          // 絕對數字：從 timeline 開頭（0 秒）算起的絕對時間
          tl.to(".box-a", { x: 0, autoAlpha: 1 }, 0)
            .to(".box-b", { y: 0, autoAlpha: 1 }, 0.8)
            .to(".cell", { scale: 1, autoAlpha: 1, stagger: 0.12 }, 1.6);
          break;
        case "overlap":
          // -=0.3：比 timeline 目前的結尾提早 0.3 秒，做出重疊
          tl.to(".box-a", { x: 0, autoAlpha: 1 })
            .to(".box-b", { y: 0, autoAlpha: 1 }, "-=0.3")
            .to(".cell", { scale: 1, autoAlpha: 1, stagger: 0.12 }, "-=0.3");
          break;
        case "gap":
          // +=0.5：比 timeline 目前的結尾再晚 0.5 秒，中間留一段空檔
          tl.to(".box-a", { x: 0, autoAlpha: 1 })
            .to(".box-b", { y: 0, autoAlpha: 1 }, "+=0.5")
            .to(".cell", { scale: 1, autoAlpha: 1, stagger: 0.12 }, "+=0.5");
          break;
        case "together":
          // "<"：對齊上一個動畫的起點，三步幾乎同時起跑
          tl.to(".box-a", { x: 0, autoAlpha: 1 })
            .to(".box-b", { y: 0, autoAlpha: 1 }, "<")
            .to(".cell", { scale: 1, autoAlpha: 1, stagger: 0.12 }, "<");
          break;
        case "label":
          // label：插一個有名字的時間點，再用「旗名+=偏移」對齊
          tl.to(".box-a", { x: 0, autoAlpha: 1 })
            .addLabel("second")
            .to(".box-b", { y: 0, autoAlpha: 1 }, "second")
            .to(".cell", { scale: 1, autoAlpha: 1, stagger: 0.12 }, "second+=0.4");
          break;
        default:
          // 預設：不給第三參數，一個接一個
          tl.to(".box-a", { x: 0, autoAlpha: 1 })
            .to(".box-b", { y: 0, autoAlpha: 1 })
            .to(".cell", { scale: 1, autoAlpha: 1, stagger: 0.12 });
      }
    }

    // 換模式：改狀態 + 重播（active 樣式交給 :class 自動處理）
    function pickMode(m) {
      mode.value = m;
      play();
    }

    // 等 Vue 把元素渲染進 DOM 之後，才跑第一次動畫
    onMounted(play);

    return { mode, modes, config, play, pickMode };
  },
}).mount("#app");
