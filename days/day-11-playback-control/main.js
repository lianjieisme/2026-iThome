// Day 11 — 動畫控制：gsap.timeline() 回傳的東西是一台播放器，這天學怎麼操作它。
//
// 分工重點：
//   timeline 本身跟所有 GSAP 呼叫都是 vanilla，讀者可以整段抄走用在任何專案。
//   Vue 只負責畫面上那些滑桿、按鈕、即時數字，不碰動畫邏輯。

const { createApp, ref, computed, onMounted } = Vue;

createApp({
  setup() {
    // 三段各 1 秒，總長 3 秒。寫成常數是因為即時面板要拿它換算秒數
    const SEG = 1;
    const TOTAL = SEG * 3;

    // 三個 label 的名字與時間點。畫面上的跳位鈕跟進度條刻度都吃這份資料，
    // 這樣改動畫段落時只要改這裡，不用兩邊對
    const labels = [
      { name: "移動", time: 0 },
      { name: "旋轉", time: 1 },
      { name: "變色", time: 2 },
    ];

    const box = ref(null);

    // 畫面用的狀態
    const progress = ref(0);
    const speed = ref(1);
    const isPlaying = ref(false);
    const logs = ref([]);
    const lastAction = ref("tl.play();");

    // timeline 本體。存成變數是今天的前提：
    // 沒存起來就沒有東西可以下指令，動畫寫下去就只能一路跑完
    let tl = null;
    let logId = 0;

    // 事件面板。onUpdate 一秒觸發六十次，記進來會瞬間洗版，所以它不進 log，
    // 改成去驅動上面那個 progress 數字
    function log(name, note) {
      logs.value.unshift({ id: logId++, name, note });
      if (logs.value.length > 5) logs.value.pop();
    }

    function buildTimeline() {
      const timeline = gsap.timeline({
        paused: true,
        // 從靜止變成在跑的那一刻。從頭播、倒帶、restart 都算，所以不只觸發一次
        onStart: () => log("onStart", "從靜止變成在跑的那一刻"),
        // 每一幀都會進來一次，拿它把內部進度同步到畫面上
        onUpdate: () => {
          progress.value = timeline.progress();
        },
        // 跑到底之後明確 pause()。不加這行的話 timeline 會停在
        // 「沒暫停、只是無事可做」的狀態，之後 seek() 跳過去會立刻又自己跑掉
        onComplete: () => {
          timeline.pause();
          isPlaying.value = false;
          log("onComplete", "正向跑到底才會觸發");
        },
        onReverseComplete: () => {
          timeline.pause();
          isPlaying.value = false;
          log("onReverseComplete", "倒帶回到起點觸發的是這個，不是 onComplete");
        },
      });

      timeline
        .addLabel(labels[0].name)
        .to(box.value, { x: 280, duration: SEG, ease: "power2.out" })
        .addLabel(labels[1].name)
        .to(box.value, { rotation: 360, duration: SEG, ease: "power1.inOut" })
        .addLabel(labels[2].name)
        .to(box.value, {
          scale: 1.5,
          backgroundColor: "#f472b6",
          duration: SEG,
          ease: "back.out(1.7)",
        });

      return timeline;
    }

    function doPlay() {
      // 已經跑到底的話 play() 沒東西可播，要 restart 才會從頭來
      if (tl.progress() === 1) return doRestart();
      tl.play();
      isPlaying.value = true;
      lastAction.value = "tl.play();";
    }

    function doPause() {
      tl.pause();
      isPlaying.value = false;
      lastAction.value = "tl.pause();";
    }

    function doReverse() {
      tl.reverse();
      isPlaying.value = true;
      lastAction.value = "tl.reverse(); // 倒著播，連 ease 也倒";
    }

    function doRestart() {
      tl.restart();
      isPlaying.value = true;
      lastAction.value = "tl.restart();";
    }

    // 拖進度條：一定要先 pause()，否則播放頭被搬過去之後，
    // 下一幀它還是會自己往前跑，手放開就跑掉了
    function scrub(e) {
      const value = Number(e.target.value);
      tl.pause();
      isPlaying.value = false;
      tl.progress(value);
      lastAction.value = `tl.pause();\ntl.progress(${value.toFixed(3)});`;
    }

    function setSpeed(e) {
      const value = Number(e.target.value);
      speed.value = value;
      // 給參數 = 寫入。不給參數的 tl.timeScale() 才是讀出來
      tl.timeScale(value);
      lastAction.value = `tl.timeScale(${value});`;
    }

    // 跳到某個 label。第二個參數 false 是關鍵：
    // seek() 的 suppressEvents 預設是 true，不傳的話 onUpdate 不會觸發，
    // 方塊跳過去了但畫面上的數字會卡在原地，看起來像壞掉
    function jump(name) {
      tl.seek(name, false);
      lastAction.value = `tl.seek("${name}", false);`;
      log("seek", `跳到 label「${name}」，播放狀態不變`);
    }

    const config = computed(
      () => `// 存成變數，之後才有東西可以下指令
const tl = gsap.timeline({
  paused: true,
  onStart:  () => log("onStart"),
  onUpdate: () => bar.style.width = tl.progress() * 100 + "%",
  onComplete:        () => log("onComplete"),
  onReverseComplete: () => log("onReverseComplete"),
});

tl.addLabel("移動")
  .to(box, { x: 280, duration: 1, ease: "power2.out" })
  .addLabel("旋轉")
  .to(box, { rotation: 360, duration: 1, ease: "power1.inOut" })
  .addLabel("變色")
  .to(box, { scale: 1.5, backgroundColor: "#f472b6", duration: 1, ease: "back.out(1.7)" });

// 你剛剛按的那一下
${lastAction.value}`,
    );

    onMounted(() => {
      tl = buildTimeline();
      // 一進來就先跑一次，不用等使用者按才看得到東西動
      doPlay();
    });

    return {
      TOTAL,
      labels,
      box,
      progress,
      speed,
      isPlaying,
      logs,
      config,
      doPlay,
      doPause,
      doReverse,
      doRestart,
      scrub,
      setSpeed,
      jump,
    };
  },
}).mount("#app");
