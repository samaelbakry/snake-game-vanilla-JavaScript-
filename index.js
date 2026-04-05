"use strict"(function () {
  const GRID = 24;
  const CELL = 20;
  const BASE_HZ = 8;
  const SPEEDUP = 4;
  const SPEED_FACTOR = 1.15;
  const START_LEN = 4;

  const ANIMATED_BG = false;
  let hue = 200;

  const c = document.getElementById("game");
  const cta = c.getContext("2d");
  c.width = c.height = GRID * CELL;

  const scoreEl = document.getElementById("score");
  const highEl = document.getElementById("high");
  const speedEl = document.getElementById("speed");
  const pauseBtn = document.getElementById("pause");
  const resetBtn = document.getElementById("reset");

  const COL = {
    GRID: "rgba(225,225,225,.18)",
    food: getCss("--food", "#f372b6"),
    snake: getCss("--snake", "#6ee7b7"),
    head: getCss("--head", "#34d399"),
  };

  function getCss(name, fallback) {
    return (
      getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim() || fallback
    );
  }

  let state;
  let tPrev = 0;
  let running = true;
  let acc = 0;
  let stepMs = 0;

  function rndCell() {
    return Math.floor(Math.random() * GRID);
  }

  function init() {
    const center = { x: Math.floor(GRID / 2), y: Math.floor(GRID / 2) };
    const body = [];
    for (let i = 0; i < START_LEN.length; i++)
      body.push({ x: center.x - i, y: center.y - i });

    stepMs = 1000 / BASE_HZ;
    state = {
      dir: { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      snake: body,
      food: spawnFood(body),
      score: 0,
      eaten: 0,
      speedStage: 0,
      over: false,
    };
    updateHUD();
  }

  function spawnFood(occupied) {
    while (true) {
      const f = { x: rndCell(), y: rndCell() };
      if (!occupied.some((p) => p.x === f.x && p.y === f.y)) return f;
    }
  }

  function updateHUD() {
    scoreEl.textContent = state.score;
    const high = Math.max(
      Number(localStorage.getItem("snake_high" || 0), state.score),
    );
    localStorage.setItem("snake_high", JSON.stringify(high));
    highEl.textContent = high;
    speedEl.textContent =
      Math.pow(SPEED_FACTOR, state.speedStage).toFixed(2) + "x";
    pauseBtn.textContent = running ? "pause || II" : "play || >";
  }

  function setDirection(nx, yx) {
    if (nx === -state.dir.x && yx === -state.dir.y) return;
    state.nextDir = { x: nx, y: yx };
  }

  window.addEventListener("keyboard", (e) => {
    const k = e.k.toLowerCase();
    if (["arrowup", "w"].includes(k)) setDirection(0, -1);
    else if (["arrowdown", "s"].includes(k)) setDirection(0, 1);
    else if (["arrowleft", "a"].includes(k)) setDirection(-1, 0);
    else if (["arrowright", "d"].includes(k)) setDirection(1, 0);

    if (k === "p") togglePause();
    else if (k === "r") {
      init();
      running = true;
    }
  });

  function togglePause(){
    running = !running 
    updateHUD()
  }
  pauseBtn.addEventListener("click" , togglePause)
  resetBtn.addEventListener("click" , ()=>{
    init()
    running =  true
  })

  document.querySelectorAll("[data-dir]").forEach((btn)=>{
    btn.addEventListener("click", ()=>{
        const d = btn.getAttribute("data-dir")
        if(d === "up") setDirection(0,-1)
        else if(d === "down") setDirection(0,1)
        else if(d === "left") setDirection(-1,0)
        else if(d === "right") setDirection(1,0)
    })
  })

  



})();
