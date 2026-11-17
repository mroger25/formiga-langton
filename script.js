(() => {
  "use strict";

  /* ---------- Configuração ---------- */
  const COLS = 200,
    ROWS = 200; // tamanho do tabuleiro (quadrados)

  const COR_APAGADO = "#0b1016";
  const COR_ACESO = "#e8eef5";
  const COR_FORMIGA = "#ff3b3b";

  // Direções: 0 = cima, 1 = direita, 2 = baixo, 3 = esquerda
  const DX = [0, 1, 0, -1];
  const DY = [-1, 0, 1, 0];

  /* ---------- Estado ---------- */
  const canvas = document.getElementById("cv");
  const ctx = canvas.getContext("2d", { alpha: false });

  let CELL = 4; // pixels por quadrado
  let grid; // Uint8Array: 0 = apagado, 1 = aceso
  let ant; // { x, y, dir }
  let steps = 0;
  let running = false;

  /* ---------- Dimensionamento ---------- */
  function computeCell() {
    const maxW = Math.min(800, window.innerWidth - 48);
    const maxH = window.innerHeight - 200;
    CELL = Math.max(2, Math.floor(Math.min(maxW, maxH) / COLS));
    canvas.width = COLS * CELL;
    canvas.height = ROWS * CELL;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
  }

  /* ---------- Desenho ---------- */
  function pintarFundo() {
    ctx.fillStyle = COR_APAGADO;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Repinta um único quadrado conforme o estado dele
  function pintarQuadrado(x, y) {
    ctx.fillStyle = grid[y * COLS + x] ? COR_ACESO : COR_APAGADO;
    ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
  }

  function desenharFormiga() {
    ctx.fillStyle = COR_FORMIGA;
    ctx.fillRect(ant.x * CELL, ant.y * CELL, CELL, CELL);
  }

  // Redesenho completo (usado no reset e no resize)
  function repintarTudo() {
    pintarFundo();
    ctx.fillStyle = COR_ACESO;
    for (let y = 0; y < ROWS; y++) {
      const base = y * COLS;
      for (let x = 0; x < COLS; x++) {
        if (grid[base + x]) ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
    }
    desenharFormiga();
  }

  /* ---------- As duas regras ---------- */
  function passo() {
    const i = ant.y * COLS + ant.x;

    if (grid[i] === 0) {
      // REGRA 1: quadrado apagado -> vira à direita, acende, anda
      ant.dir = (ant.dir + 1) & 3;
      grid[i] = 1;
    } else {
      // REGRA 2: quadrado aceso -> vira à esquerda, apaga, anda
      ant.dir = (ant.dir + 3) & 3;
      grid[i] = 0;
    }

    // repinta o quadrado que a formiga acabou de deixar
    pintarQuadrado(ant.x, ant.y);

    // anda para frente (com wrap-around: o tabuleiro é um toro)
    ant.x = (ant.x + DX[ant.dir] + COLS) % COLS;
    ant.y = (ant.y + DY[ant.dir] + ROWS) % ROWS;

    steps++;
  }

  /* ---------- Loop principal ---------- */
  const speedEl = document.getElementById("speed");
  const speedVal = document.getElementById("speedVal");
  const statsEl = document.getElementById("stats");
  const playBtn = document.getElementById("play");
  const resetBtn = document.getElementById("reset");

  speedEl.addEventListener("input", () => {
    speedVal.textContent = speedEl.value;
  });

  function updateStats() {
    statsEl.textContent = "passos: " + steps.toLocaleString("pt-BR");
  }

  function loop() {
    if (running) {
      const n = Number(speedEl.value);
      for (let k = 0; k < n; k++) passo();
      desenharFormiga(); // desenha a formiga uma vez por frame
      updateStats();
    }
    requestAnimationFrame(loop);
  }

  /* ---------- Controles ---------- */
  function reset() {
    running = false;
    playBtn.textContent = "Iniciar";
    grid = new Uint8Array(COLS * ROWS);
    ant = { x: COLS >> 1, y: ROWS >> 1, dir: 0 };
    steps = 0;
    pintarFundo();
    desenharFormiga();
    updateStats();
  }

  playBtn.addEventListener("click", () => {
    running = !running;
    playBtn.textContent = running ? "Pausar" : "Continuar";
  });

  resetBtn.addEventListener("click", reset);

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      playBtn.click();
    }
    if (e.key.toLowerCase() === "r") reset();
  });

  /* ---------- Resize ---------- */
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      computeCell();
      repintarTudo();
    }, 150);
  });

  /* ---------- Início ---------- */
  computeCell();
  reset();
  requestAnimationFrame(loop);
})();
