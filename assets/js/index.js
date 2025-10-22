const mclick = document.getElementById("mclick");
const mping = document.getElementById("mping");
const mwin = document.getElementById("mwin");
function isAppleDevice() {
  return /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);
}

function playClick() {
  if (isAppleDevice()) return;
  mclick.pause();
  mclick.currentTime = 0;
  mclick.play();
}

function playPing() {
  if (isAppleDevice()) return;
  mping.pause();
  mping.currentTime = 0;
  mping.play().catch(() => {});
}
if (window.innerWidth < 300 || window.innerHeight < 300) {
  const canvas = document.getElementById("plinkoCanvas");
  if (canvas) canvas.style.display = "none";

  const msg = document.createElement("div");
  msg.style.color = "red";
  msg.style.position = "absolute";
  msg.style.fontSize = "16px";
  msg.style.width = "100%";
  msg.style.top = "100px";
  msg.style.padding = "0px 70px";
  msg.style.textAlign = "center";
  msg.style.marginTop = "20px";
  msg.textContent = "Screen too small for Plinko game.";
  document.body.appendChild(msg);

  throw new Error("Screen too small for Plinko game.");
}

const RiskLevel = { LOW: "LOW", MEDIUM: "MEDIUM", HIGH: "HIGH" };
(function () {
  const historyList = document.getElementById("historyList");

  if (!historyList.hasChildNodes()) {
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "empty-history history-item empty";
    emptyDiv.textContent = "Empty History";
    historyList.appendChild(emptyDiv);
  }

  window.addToHistory = function (bet, winAmount, odd) {
    const emptyDiv = historyList.querySelector(".history-item.empty");
    if (emptyDiv) {
      historyList.removeChild(emptyDiv);
    }

    const isWin = winAmount >= bet;

    const div = document.createElement("div");
    div.className = "history-item " + (isWin ? "win" : "lose");
    div.innerHTML = `
        <div><strong>Odds:</strong> ${odd.toFixed(2)}x</div>
        <div><strong>Bet Amount:</strong> $${bet.toFixed(2)}</div>
        <div><strong class='lose-text'>${
          isWin ? "Win Amount" : "Amount"
        }:</strong> ${
      isWin ? "$" + winAmount.toFixed(2) : winAmount.toFixed(2)
    }</div>
        <div class="time">${new Date().toLocaleTimeString()}</div>
      `;
    historyList.prepend(div);
  };
})();

const binPayouts = {
  8: {
    LOW: [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6],
    MEDIUM: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
    HIGH: [29, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 29],
  },
  9: {
    LOW: [5.6, 2, 1.6, 1, 0.7, 0.7, 1, 1.6, 2, 5.6],
    MEDIUM: [18, 4, 1.7, 0.9, 0.5, 0.5, 0.9, 1.7, 4, 18],
    HIGH: [43, 7, 2, 0.6, 0.2, 0.2, 0.6, 2, 7, 43],
  },
  10: {
    LOW: [8.9, 3, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 3, 8.9],
    MEDIUM: [22, 5, 2, 1.4, 0.6, 0.4, 0.6, 1.4, 2, 5, 22],
    HIGH: [76, 10, 3, 0.9, 0.3, 0.2, 0.3, 0.9, 3, 10, 76],
  },
  11: {
    LOW: [8.4, 3, 1.9, 1.3, 1, 0.7, 0.7, 1, 1.3, 1.9, 3, 8.4],
    MEDIUM: [24, 6, 3, 1.8, 0.7, 0.5, 0.5, 0.7, 1.8, 3, 6, 24],
    HIGH: [120, 14, 5.2, 1.4, 0.4, 0.2, 0.2, 0.4, 1.4, 5.2, 14, 120],
  },
  12: {
    LOW: [10, 3, 1.6, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 1.6, 3, 10],
    MEDIUM: [33, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 4, 11, 33],
    HIGH: [170, 24, 8.1, 2, 0.7, 0.2, 0.2, 0.2, 0.7, 2, 8.1, 24, 170],
  },
  13: {
    LOW: [8.1, 4, 3, 1.9, 1.2, 0.9, 0.7, 0.7, 0.9, 1.2, 1.9, 3, 4, 8.1],
    MEDIUM: [43, 13, 6, 3, 1.3, 0.7, 0.4, 0.4, 0.7, 1.3, 3, 6, 13, 43],
    HIGH: [260, 37, 11, 4, 1, 0.2, 0.2, 0.2, 0.2, 1, 4, 11, 37, 260],
  },
  14: {
    LOW: [7.1, 4, 1.9, 1.4, 1.3, 1.1, 1, 0.5, 1, 1.1, 1.3, 1.4, 1.9, 4, 7.1],
    MEDIUM: [58, 15, 7, 4, 1.9, 1, 0.5, 0.2, 0.5, 1, 1.9, 4, 7, 15, 58],
    HIGH: [420, 56, 18, 5, 1.9, 0.3, 0.2, 0.2, 0.2, 0.3, 1.9, 5, 18, 56, 420],
  },
  15: {
    LOW: [15, 8, 3, 2, 1.5, 1.1, 1, 0.7, 0.7, 1, 1.1, 1.5, 2, 3, 8, 15],
    MEDIUM: [88, 18, 11, 5, 3, 1.3, 0.5, 0.3, 0.3, 0.5, 1.3, 3, 5, 11, 18, 88],
    HIGH: [620, 83, 27, 8, 3, 0.5, 0.2, 0.2, 0.2, 0.2, 0.5, 3, 8, 27, 83, 620],
  },
  16: {
    LOW: [
      16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16,
    ],
    MEDIUM: [
      110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110,
    ],
    HIGH: [
      1000, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 1000,
    ],
  },
};

function interpolateRgb(from, to, length) {
  return Array.from({ length }, (_, i) => {
    return {
      r: Math.round(from.r + ((to.r - from.r) / (length - 1)) * i),
      g: Math.round(from.g + ((to.g - from.g) / (length - 1)) * i),
      b: Math.round(from.b + ((to.b - from.b) / (length - 1)) * i),
    };
  });
}
function getBinColors(rowCount) {
  const binCount = rowCount + 1;
  const isEven = binCount % 2 === 0;
  const halfLen = Math.ceil(binCount / 2);
  const red = { r: 255, g: 0, b: 63 };
  const yellow = { r: 255, g: 192, b: 0 };
  const redShadow = { r: 166, g: 0, b: 4 };
  const yellowShadow = { r: 171, g: 121, b: 0 };
  const bg = interpolateRgb(red, yellow, halfLen).map(
    (c) => `rgb(${c.r},${c.g},${c.b})`
  );
  const shadow = interpolateRgb(redShadow, yellowShadow, halfLen).map(
    (c) => `rgb(${c.r},${c.g},${c.b})`
  );
  const bgFull = [...bg, ...[...bg].reverse().slice(isEven ? 0 : 1)];
  const shFull = [...shadow, ...[...shadow].reverse().slice(isEven ? 0 : 1)];
  return { background: bgFull, shadow: shFull };
}

function getRandomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function updateBetButtonState() {
  const v = parseFloat(betInput.value);
  betBtn.disabled = isNaN(v) || v <= 0 || v > commonStore.balance;
}
const commonStore = {
  balance: 100.0,
  setBalance(v) {
    this.balance = v;
    updateBalanceText();
    updateBetButtonState();
  },
};
const plinkoStore = {
  betAmount: 0,
  rowCount: 16,
  riskLevel: RiskLevel.MEDIUM,
  multiplier: 0,
  history: [],
  setBetAmount(v) {
    this.betAmount = v;
  },
  setRowCount(v) {
    this.rowCount = v;
  },
  setRiskLevel(v) {
    this.riskLevel = v;
  },
  setMultiplier(v) {
    this.multiplier = v;
    document.getElementById("multiplier").textContent = v;
  },
  addGameResult(bet, mult) {
    this.history.unshift({
      bet,
      mult,
      ts: new Date().toLocaleTimeString(),
    });
    const size = window.innerWidth < 992 ? 5 : 12;
    if (this.history.length > size) this.history.pop();

    const h = document.getElementById("history");
    const div = document.createElement("div");
    div.className = "mitem";
    div.textContent = mult + "x";
    div.style.background = mult < 1 ? "#444444" : "#00e701";
    div.style.color = mult < 1 ? "#fff" : "#000";
    h.prepend(div);
    if (h.children.length > size) {
      h.removeChild(h.lastChild);
    }
  },
};

function disableControls() {
  riskSelect.disabled = true;
  rowSelect.disabled = true;
}

function enableControlsIfNoBalls() {
  const balls = Matter.Composite.allBodies(engine.engine.world).filter(
    (body) =>
      body.collisionFilter &&
      body.collisionFilter.category === PlinkoEngine.BALL_CATEGORY
  );
  if (balls.length === 0) {
    riskSelect.disabled = false;
    rowSelect.disabled = false;
  }
}

function renderBinsRow(rowCount, riskLevel, binsWidthPercent = 1) {
  const container = document.getElementById("binsContainer");
  container.innerHTML = "";
  const payouts = binPayouts[rowCount][riskLevel];
  const colors = getBinColors(rowCount);
  const inner = document.createElement("div");
  inner.className = "bins-inner";
  inner.style.width = binsWidthPercent * 100 + "%";

  payouts.forEach((p, i) => {
    const b = document.createElement("div");
    b.style.backgroundColor = colors.background[i];
    b.style.color = "#000";

    b.className = "bin";
    b.textContent = p < 100 ? p + "×" : p;
    inner.appendChild(b);
  });

  container.appendChild(inner);
}

let mWidth, mHeight;
function updateSize() {
  const el = document.getElementById("m-con-p");
  mWidth = el.clientWidth;
  mHeight = el.clientHeight - 100;
}
updateSize();
window.addEventListener("load", updateSize);
window.addEventListener("resize", updateSize);
class PlinkoEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.engine = Matter.Engine.create({ timing: { timeScale: 1.3 } });
    Matter.Events.on(this.engine, "afterUpdate", () => {
      Matter.Composite.allBodies(this.engine.world).forEach((body) => {
        if (
          body.collisionFilter &&
          body.collisionFilter.category === PlinkoEngine.BALL_CATEGORY
        ) {
          const speed = Math.hypot(body.velocity.x, body.velocity.y);

          if (speed < 0.15) {
            Matter.Body.setVelocity(body, {
              x: (Math.random() - 0.5) * 2,
              y: -1.5,
            });
          }
        }
      });
    });
    this.render = Matter.Render.create({
      engine: this.engine,
      canvas: this.canvas,
      options: {
        width: 760,
        height: 570,
        background: "transparent",
        wireframes: false,
      },
    });
    this.runner = Matter.Runner.create();
    this.pins = [];
    this.walls = [];
    this.pinsLastRowXCoords = [];
    this.rowCount = plinkoStore.rowCount;
    this.riskLevel = plinkoStore.riskLevel;
    this.betAmount = plinkoStore.betAmount;
    this.sensor = null;
    this.placePinsAndWalls();
    this.sensor = Matter.Bodies.rectangle(
      this.canvas.width / 2,
      this.canvas.height + 10,
      this.canvas.width,
      10,
      { isSensor: true, isStatic: true, render: { visible: false } }
    );
    Matter.Composite.add(this.engine.world, this.sensor);
    Matter.Events.on(this.engine, "collisionStart", (e) => {
      e.pairs.forEach((pair) => {
        const a = pair.bodyA,
          b = pair.bodyB;

        if (a === this.sensor) {
          this.handleBallEnterBin(b);
          playPing();
          return;
        } else if (b === this.sensor) {
          this.handleBallEnterBin(a);
          playPing();
          return;
        }

        const isBallA =
          a.collisionFilter?.category === PlinkoEngine.BALL_CATEGORY;
        const isBallB =
          b.collisionFilter?.category === PlinkoEngine.BALL_CATEGORY;
        const isPinA =
          a.collisionFilter?.category === PlinkoEngine.PIN_CATEGORY;
        const isPinB =
          b.collisionFilter?.category === PlinkoEngine.PIN_CATEGORY;

        if ((isBallA && isPinB) || (isBallB && isPinA)) {
          playPing();
        }
      });
    });
  }

  static WIDTH = mWidth;
  static HEIGHT = mHeight;
  static PADDING_X = window.innerWidth < 992 ? 40 : 52;
  static PADDING_TOP = 36;
  static PADDING_BOTTOM = 28;
  static PIN_CATEGORY = 0x0001;
  static BALL_CATEGORY = 0x0002;

  start() {
    Matter.Render.run(this.render);
    Matter.Runner.run(this.runner, this.engine);
  }
  stop() {
    Matter.Render.stop(this.render);
    Matter.Runner.stop(this.runner);
  }

  get pinDistanceX() {
    const lastRowPinCount = 3 + this.rowCount - 1;
    return (
      (this.canvas.width - PlinkoEngine.PADDING_X * 2) / (lastRowPinCount - 1)
    );
  }
  get pinRadius() {
    const size = window.innerWidth < 992 ? 0.9 : 1.9;
    const base = (24 - this.rowCount) / size;
    if (window.innerWidth < 1100) {
      return base * 0.5;
    }

    return base * 1.5;
  }

  placePinsAndWalls() {
    const PADDING_X = PlinkoEngine.PADDING_X;
    const PADDING_TOP = PlinkoEngine.PADDING_TOP;
    const PADDING_BOTTOM = PlinkoEngine.PADDING_BOTTOM;
    if (this.pins.length) Matter.Composite.remove(this.engine.world, this.pins);
    if (this.walls.length)
      Matter.Composite.remove(this.engine.world, this.walls);
    this.pins = [];
    this.walls = [];
    this.pinsLastRowXCoords = [];

    for (let row = 0; row < this.rowCount; row++) {
      const rowY =
        PADDING_TOP +
        ((this.canvas.height - PADDING_TOP - PADDING_BOTTOM) /
          (this.rowCount - 1)) *
          row;
      const rowPaddingX =
        PADDING_X + ((this.rowCount - 1 - row) * this.pinDistanceX) / 2;
      for (let col = 0; col < 3 + row; col++) {
        const colX =
          rowPaddingX +
          ((this.canvas.width - rowPaddingX * 2) / (3 + row - 1)) * col;
        const pin = Matter.Bodies.circle(colX, rowY, this.pinRadius, {
          isStatic: true,
          render: {
            fillStyle: "#fff",
          },

          friction: 0,
          frictionStatic: 0,
          collisionFilter: {
            category: PlinkoEngine.PIN_CATEGORY,
            mask: PlinkoEngine.BALL_CATEGORY,
          },
        });
        this.pins.push(pin);
        if (row === this.rowCount - 1) this.pinsLastRowXCoords.push(colX);
      }
    }
    Matter.Composite.add(this.engine.world, this.pins);

    const firstPinX = this.pins[0].position.x;
    const leftWallAngle = Math.atan2(
      firstPinX - this.pinsLastRowXCoords[0],
      this.canvas.height - PADDING_TOP - PADDING_BOTTOM
    );
    const leftWallX =
      firstPinX -
      (firstPinX - this.pinsLastRowXCoords[0]) / 2 -
      this.pinDistanceX * 0.25;

    const leftWall = Matter.Bodies.rectangle(
      leftWallX,
      this.canvas.height / 2,
      10,
      this.canvas.height,
      { isStatic: true, angle: leftWallAngle, render: { visible: false } }
    );
    const rightWall = Matter.Bodies.rectangle(
      this.canvas.width - leftWallX,
      this.canvas.height / 2,
      10,
      this.canvas.height,
      {
        isStatic: true,
        angle: -leftWallAngle,
        render: { visible: false },
      }
    );
    this.walls.push(leftWall, rightWall);
    Matter.Composite.add(this.engine.world, this.walls);

    this._binsWidthPercentage =
      (this.pinsLastRowXCoords[this.pinsLastRowXCoords.length - 1] -
        this.pinsLastRowXCoords[0]) /
      PlinkoEngine.WIDTH;
    renderBinsRow(this.rowCount, this.riskLevel, this._binsWidthPercentage);
  }

  updateRowCount(newCount) {
    if (newCount === this.rowCount) return;
    Matter.Composite.allBodies(this.engine.world).forEach((body) => {
      if (
        body.collisionFilter &&
        body.collisionFilter.category === PlinkoEngine.BALL_CATEGORY
      ) {
        Matter.Composite.remove(this.engine.world, body);
      }
    });
    this.rowCount = newCount;
    this.placePinsAndWalls();
  }

  dropBall() {
    const currentBalance = commonStore.balance;
    const bet = plinkoStore.betAmount;
    if (currentBalance < bet || bet <= 0) {
      console.warn("invalid bet");
      return;
    }
    commonStore.setBalance(Math.max(0, currentBalance - bet));
    disableControls();

    const ballRadius =
      window.innerWidth < 1100 ? this.pinRadius * 1.4 : this.pinRadius * 1.4;
    const ballOffsetRangeX = this.pinDistanceX * 0.8;

    const img = new Image();
    img.src = "./assets/img/boll.png";
    img.onload = () => {
      const ball = Matter.Bodies.circle(
        getRandomBetween(
          this.canvas.width / 2 - ballOffsetRangeX,
          this.canvas.width / 2 + ballOffsetRangeX
        ),
        0,
        ballRadius,
        {
          restitution: 0.8,
          friction: 0.5,
          frictionAir: 0.04,
          collisionFilter: {
            category: PlinkoEngine.BALL_CATEGORY,
            mask: PlinkoEngine.PIN_CATEGORY,
          },
          render: {
            sprite: {
              texture: "./assets/img/boll.png",
              xScale: (ballRadius * 2) / img.width,
              yScale: (ballRadius * 2) / img.height,
            },
          },
        }
      );
      ball._betAmount = bet;
      Matter.Composite.add(this.engine.world, ball);
    };
  }

  handleBallEnterBin(ball) {
    const binIndex = this.pinsLastRowXCoords.findLastIndex(
      (pinX) => pinX < ball.position.x
    );
    if (binIndex !== -1 && binIndex < this.pinsLastRowXCoords.length - 1) {
      const multiplier = binPayouts[this.rowCount][this.riskLevel][binIndex];
      const ballBet = ball._betAmount || plinkoStore.betAmount;
      plinkoStore.setMultiplier(multiplier);
      const winnings = ballBet * multiplier;
      const newBal = commonStore.balance + winnings;
      commonStore.setBalance(newBal);
      plinkoStore.addGameResult(ballBet, multiplier);
      document.getElementById("lastWin").textContent =
        "$" + winnings.toFixed(2);
      addToHistory(ballBet, winnings, multiplier);
      if (multiplier > 1) {
        mwin.pause();
        mwin.currentTime = 0;
        mwin.play();
      }
    }
    const bins = document.querySelectorAll(".bin");
    const binDiv = bins[binIndex];
    if (binDiv) {
      binDiv.classList.add("animate-hit");
      setTimeout(() => {
        binDiv.classList.add("done");
        setTimeout(() => {
          binDiv.classList.remove("animate-hit", "done");
        }, 150);
      }, 150);
    }
    Matter.Composite.remove(this.engine.world, ball);
    enableControlsIfNoBalls();
  }

  get binsWidthPercentage() {
    return this._binsWidthPercentage || 1;
  }
  getMultipliers() {
    return binPayouts[this.rowCount][this.riskLevel];
  }
}

const canvas = document.getElementById("plinkoCanvas");
const engine = new PlinkoEngine(canvas);
engine.start();

function updateBalanceText() {
  document.getElementById("balanceText").textContent =
    "$" + commonStore.balance.toFixed(2);
}
updateBalanceText();
renderBinsRow(plinkoStore.rowCount, plinkoStore.riskLevel);

const betInput = document.getElementById("betInput");
const halfBtn = document.getElementById("halfBtn");
const doubleBtn = document.getElementById("doubleBtn");
const betBtn = document.getElementById("betBtn");
const riskSelect = document.getElementById("riskSelect");
const rowSelect = document.getElementById("rowSelect");

betInput.addEventListener("input", (e) => {
  const v = parseFloat(e.target.value);

  if (!isNaN(v)) {
    plinkoStore.setBetAmount(v);
  } else {
    plinkoStore.setBetAmount(0);
  }

  if (isNaN(v) || v <= 0 || v > commonStore.balance) {
    betBtn.disabled = true;
  } else {
    betBtn.disabled = false;
  }
});
halfBtn.addEventListener("click", () => {
  if (plinkoStore.betAmount > 0) {
    const newA = (plinkoStore.betAmount / 2).toFixed(2);
    plinkoStore.setBetAmount(parseFloat(newA));
    betInput.value = newA;
    betBtn.disabled =
      parseFloat(newA) <= 0 || parseFloat(newA) > commonStore.balance;
  }
  if (parseFloat(newA) <= commonStore.balance) {
    plinkoStore.setBetAmount(parseFloat(newA));
    betInput.value = newA;
  }
});
doubleBtn.addEventListener("click", () => {
  if (plinkoStore.betAmount > 0) {
    const newA = (plinkoStore.betAmount * 2).toFixed(2);
    if (parseFloat(newA) <= commonStore.balance) {
      plinkoStore.setBetAmount(parseFloat(newA));
      betInput.value = newA;
      betBtn.disabled =
        parseFloat(newA) <= 0 || parseFloat(newA) > commonStore.balance;
    } else {
    }
  }
});

riskSelect.addEventListener("change", (e) => {
  plinkoStore.setRiskLevel(e.target.value);
  engine.riskLevel = e.target.value;
  renderBinsRow(
    plinkoStore.rowCount,
    plinkoStore.riskLevel,
    engine.binsWidthPercentage
  );
});
rowSelect.addEventListener("change", (e) => {
  const rc = parseInt(e.target.value, 10);
  plinkoStore.setRowCount(rc);
  engine.updateRowCount(rc);
  renderBinsRow(rc, plinkoStore.riskLevel, engine.binsWidthPercentage);
});

betBtn.addEventListener("click", () => {
  playClick();
  const bet = plinkoStore.betAmount;
  if (!bet || bet <= 0) {
    return;
  }
  if (bet > commonStore.balance) {
    return;
  }
  engine.dropBall();
});

function renderHistory() {
  const h = document.getElementById("history");

  plinkoStore.history.forEach((it) => {
    const div = document.createElement("div");
    div.className = "mitem";
    div.textContent = it.mult;
    h.appendChild(div);
  });
}

if (!Array.prototype.findLastIndex) {
  Array.prototype.findLastIndex = function (predicate) {
    for (let i = this.length - 1; i >= 0; i--) {
      if (predicate(this[i], i, this)) return i;
    }
    return -1;
  };
}

document.getElementById("multiplier").textContent = "$";
document.getElementById("lastWin").textContent = "$";
function ShowHistory() {
  const element = document.getElementById("m-con-history");
  element.classList.add("m-show");
}

function HideHistory() {
  const element = document.getElementById("m-con-history");
  element.classList.remove("m-show");
}

window.addEventListener("resize", () => {
  canvas.width = document.getElementById("conAnimation").offsetWidth;
  canvas.height = document.getElementById("conAnimation").offsetHeight;
  maxHeight = canvas.height * 0.55;
});

document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("keydown", (e) => {
  if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) {
    e.preventDefault();
  }
});

let lastTouchTime = 0;

document.addEventListener(
  "touchend",
  function (e) {
    const now = Date.now();
    const timeSinceLastTouch = now - lastTouchTime;

    const isButton = e.target.closest("#betBtn") || e.target.closest(".mbtn");
    if (!isButton && timeSinceLastTouch < 300) {
      e.preventDefault();
      e.stopPropagation();
    }

    lastTouchTime = now;
  },
  { passive: false }
);
