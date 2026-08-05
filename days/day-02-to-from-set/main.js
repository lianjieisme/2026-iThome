// Day 02 — .to / .from / .set / .fromTo
// 目標：四顆方塊並排，各用一個方法，按「重播」一眼看出四者差異。
// 只動 opacity + y（+ duration），差異純粹來自「方法本身」。

function playAll() {
  // 先把四顆歸位到同一個基準（瞬間、不動畫），這樣每次重播都能公平對照。
  gsap.set(".box", { y: 0, opacity: 1 });

  // .set()：瞬間套用、不動畫。跟隔壁 .to() 同一個終點，但它是「瞬間跳過去」。
  // （實務上常拿來設定「動畫開演前的初始狀態」）
  gsap.set("#box-set", { y: 120 });

  // .to()：從「現在的樣子」動到「指定的樣子」。往下滑 120px。
  gsap.to("#box-to", { y: 120, duration: 1 });

  // .from()：從「指定的樣子」動回「現在的樣子」。這裡從上方、透明淡入。
  gsap.from("#box-from", { y: -120, opacity: 0, duration: 1 });

  // .fromTo()：起點、終點都自己指定。從上方透明 → 動到下方不透明。
  gsap.fromTo(
    "#box-fromto",
    { y: -120, opacity: 0 }, // 起點
    { y: 120, opacity: 1, duration: 1 }, // 終點
  );
}

// 一進頁面先跑一次
playAll();

// 重播鈕：每次點擊都重新觸發四個動畫
document.querySelector("#replay").addEventListener("click", playAll);
