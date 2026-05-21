/* =========================
   Final result sequence
   ========================= */
function showFinalRankToast(rankInfo) {
  clearTimeout(state.rankToastTimeoutId);

  elements.rankToast.dataset.rankIndex = String(rankInfo.index);
  elements.rankToast.innerHTML = `
    <strong>${rankInfo.rank.grade}</strong>
    <span>${rankInfo.rank.title}</span>
  `;
  elements.rankToast.className = "rank-toast";
  void elements.rankToast.offsetWidth;
  elements.rankToast.classList.add("show");

  state.rankToastTimeoutId = setTimeout(() => {
    elements.rankToast.className = "rank-toast hidden";
    elements.rankToast.textContent = "";
  }, 2040);
}

function clearArenaCracksCanvas() {
  const canvas = elements.arenaCracksCanvas;
  const context = canvas.getContext("2d");

  context.clearRect(0, 0, canvas.width, canvas.height);
}

function getRankEffectPower(rankInfo) {
  return 1 + rankInfo.index * 0.25;
}

function getFinalSequenceTiming(rankInfo) {
  // Higher ranks keep the final showcase on screen a bit longer,
  // so S/SS/SSS do not feel rushed.
  const rankIndex = Math.max(0, rankInfo.index);

  return {
    impactDelay: FINAL_EFFECTS.impactDelayMs,
    resultDelay:
      FINAL_EFFECTS.resultBaseDelayMs +
      rankIndex * FINAL_EFFECTS.resultDelayPerRankMs,
    fieldStepDelay:
      FINAL_EFFECTS.fieldBaseStepDelayMs +
      rankIndex * FINAL_EFFECTS.fieldStepDelayPerRankMs,
    fieldDuration:
      FINAL_EFFECTS.fieldBaseDurationMs +
      rankIndex * FINAL_EFFECTS.fieldDurationPerRankMs,
    flashDuration:
      FINAL_EFFECTS.flashBaseDurationMs +
      rankIndex * FINAL_EFFECTS.flashDurationPerRankMs,
    scoreSparkDelay:
      FINAL_EFFECTS.scoreSparkBaseDelayMs +
      rankIndex * FINAL_EFFECTS.scoreSparkDelayPerRankMs,
  };
}

function hasOuterLightning(rankInfo) {
  return rankInfo.index >= 4;
}

function prepareArenaCracksCanvas() {
  const canvas = elements.arenaCracksCanvas;
  const shellRect = elements.arenaShell.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.round(canvasRect.width * ratio);
  canvas.height = Math.round(canvasRect.height * ratio);

  const context = canvas.getContext("2d");
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  return {
    context,
    width: canvasRect.width,
    height: canvasRect.height,
    arenaX: (canvasRect.width - shellRect.width) / 2,
    arenaY: (canvasRect.height - shellRect.height) / 2,
    arenaWidth: shellRect.width,
    arenaHeight: shellRect.height,
  };
}

function createFinalCracks(rankInfo) {
  // DOM cracks live inside the arena and are used for the final impact.
  elements.finalCracks.innerHTML = "";

  const width = elements.gameArea.clientWidth;
  const height = elements.gameArea.clientHeight;
  const power = getRankEffectPower(rankInfo);
  const crackCount = Math.max(
    1,
    Math.round(
      (12 + rankInfo.index * 3) * FINAL_EFFECTS.lightningCountScale,
    ),
  );
  const duration = Math.round(1050 * power);
  const delayMax = 0.18 * power;

  for (let index = 0; index < crackCount; index += 1) {
    const crack = document.createElement("span");
    const side = index % 4;
    let x = 0;
    let y = 0;
    let angle = 0;

    if (side === 0) {
      x = random(34, Math.max(35, width - 170));
      y = random(20, 54);
      angle = random(14, 160);
    } else if (side === 1) {
      x = random(Math.max(40, width - 136), Math.max(42, width - 48));
      y = random(52, Math.max(54, height - 130));
      angle = random(112, 248);
    } else if (side === 2) {
      x = random(42, Math.max(43, width - 180));
      y = random(Math.max(42, height - 64), Math.max(44, height - 28));
      angle = random(200, 342);
    } else {
      x = random(28, 82);
      y = random(52, Math.max(54, height - 132));
      angle = random(-68, 68);
    }

    const thickness =
      random(0.9, 1.4) * power * FINAL_EFFECTS.lightningWidthScale;
    const glowPower = power * 0.45;

    crack.className = "final-crack";
    crack.style.setProperty("--x", `${x.toFixed(2)}px`);
    crack.style.setProperty("--y", `${y.toFixed(2)}px`);
    crack.style.setProperty("--angle", `${angle.toFixed(2)}deg`);
    crack.style.setProperty(
      "--length",
      `${random(72, 176 * power).toFixed(2)}px`,
    );
    crack.style.setProperty(
      "--delay",
      `${random(0, delayMax).toFixed(2)}s`,
    );
    crack.style.setProperty("--duration", `${duration}ms`);
    crack.style.setProperty("--thickness", `${thickness.toFixed(2)}px`);
    crack.style.setProperty(
      "--branch-thickness",
      `${Math.max(0.25, thickness * 0.45).toFixed(2)}px`,
    );
    crack.style.setProperty("--power", power.toFixed(2));
    crack.style.setProperty("--glow-power", glowPower.toFixed(2));
    elements.finalCracks.appendChild(crack);
  }
}

function createCrackPath(startX, startY, angle, length, power = 1) {
  // Creates a broken polyline instead of a straight laser line.
  const points = [{ x: startX, y: startY }];
  const segments = Math.floor(random(3, 6 + power));
  let x = startX;
  let y = startY;
  let direction = angle;

  for (let index = 0; index < segments; index += 1) {
    const step = length / segments;

    direction += random(-24, 24);
    x += Math.cos((direction * Math.PI) / 180) * step;
    y += Math.sin((direction * Math.PI) / 180) * step;
    points.push({ x, y });
  }

  return points;
}

function createArenaCrackData(bounds, rankInfo) {
  // Canvas cracks are drawn outside the arena border for S and above.
  const cracks = [];
  const power = getRankEffectPower(rankInfo);
  const crackCount = Math.max(
    1,
    Math.round(
      (16 + rankInfo.index * 2.5) * FINAL_EFFECTS.lightningCountScale,
    ),
  );
  const edgeInset = 10;

  for (let index = 0; index < crackCount; index += 1) {
    const side = index % 4;
    let x;
    let y;
    let angle;

    if (side === 0) {
      x = bounds.arenaX + random(34, bounds.arenaWidth - 34);
      y = bounds.arenaY + random(-edgeInset, 18);
      angle = random(-160, -20);
    } else if (side === 1) {
      x = bounds.arenaX + bounds.arenaWidth + random(-18, edgeInset);
      y = bounds.arenaY + random(34, bounds.arenaHeight - 34);
      angle = random(-62, 62);
    } else if (side === 2) {
      x = bounds.arenaX + random(34, bounds.arenaWidth - 34);
      y = bounds.arenaY + bounds.arenaHeight + random(-18, edgeInset);
      angle = random(28, 152);
    } else {
      x = bounds.arenaX + random(-edgeInset, 18);
      y = bounds.arenaY + random(34, bounds.arenaHeight - 34);
      angle = random(118, 242);
    }

    const mainPath = createCrackPath(
      x,
      y,
      angle,
      random(84, 178) * power,
      power,
    );
    const branchPoint =
      mainPath[Math.floor(random(1, mainPath.length - 1))];
    const branchAngle = angle + (Math.random() > 0.5 ? 42 : -42);

    cracks.push({
      path: mainPath,
      branch: createCrackPath(
        branchPoint.x,
        branchPoint.y,
        branchAngle,
        random(38, 86) * power,
        power,
      ),
      delay: random(0, 0.16),
      width: random(1.1, 1.9) * power * FINAL_EFFECTS.lightningWidthScale,
      power,
    });
  }

  return cracks;
}

function getPartialLinePoints(points, amount) {
  // Used by the lightning reverse animation:
  // first reveal part of the line, then hide it back.
  if (amount <= 0 || points.length < 2) return [];

  const clampedAmount = Math.max(0, Math.min(1, amount));
  const lengths = [];
  const total = points.slice(1).reduce((sum, point, index) => {
    const previous = points[index];
    const length = Math.hypot(point.x - previous.x, point.y - previous.y);

    lengths.push(length);
    return sum + length;
  }, 0);

  if (total <= 0) return [];

  let remaining = total * clampedAmount;
  const partialPoints = [points[0]];

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const point = points[index];
    const length = lengths[index - 1];

    if (remaining >= length) {
      partialPoints.push(point);
      remaining -= length;
      continue;
    }

    if (remaining > 0) {
      const ratio = remaining / length;

      partialPoints.push({
        x: previous.x + (point.x - previous.x) * ratio,
        y: previous.y + (point.y - previous.y) * ratio,
      });
    }

    break;
  }

  return partialPoints;
}

function drawTaperedLine(
  context,
  points,
  amount,
  lineWidth,
  color,
  alpha,
) {
  const visiblePoints = getPartialLinePoints(points, amount);

  if (visiblePoints.length < 2) return;

  const segments = visiblePoints.slice(1).map((point, index) => {
    const previous = visiblePoints[index];

    return {
      from: previous,
      to: point,
      length: Math.hypot(point.x - previous.x, point.y - previous.y),
    };
  });
  const total = segments.reduce(
    (sum, segment) => sum + segment.length,
    0,
  );

  if (total <= 0) return;

  let distance = 0;

  segments.forEach((segment) => {
    const middle = (distance + segment.length * 0.5) / total;
    const taper = Math.sin(middle * Math.PI);
    const segmentAlpha = alpha * Math.pow(Math.max(0, taper), 0.78);

    if (segmentAlpha <= 0.01) {
      distance += segment.length;
      return;
    }

    context.beginPath();
    context.moveTo(segment.from.x, segment.from.y);
    context.lineTo(segment.to.x, segment.to.y);
    context.lineWidth = Math.max(0.05, lineWidth * taper);
    context.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a * segmentAlpha})`;
    context.stroke();

    distance += segment.length;
  });
}

function drawArenaCracksFrame(context, bounds, cracks, progress) {
  context.clearRect(0, 0, bounds.width, bounds.height);
  context.save();
  context.globalCompositeOperation = "lighter";
  context.lineCap = "round";
  context.lineJoin = "round";

  cracks.forEach((crack) => {
    const localProgress = Math.max(
      0,
      Math.min(1, progress - crack.delay),
    );
    const amount =
      localProgress < 0.38
        ? localProgress / 0.38
        : 1 - (localProgress - 0.38) / 0.62;
    const visibleAmount = Math.max(0, Math.min(1, amount));
    const alpha = Math.sin(visibleAmount * Math.PI);

    if (visibleAmount <= 0) return;

    [
      {
        lineWidth: 9 * crack.power * FINAL_EFFECTS.lightningWidthScale,
        color: { r: 0, g: 94, b: 255, a: 0.16 },
      },
      {
        lineWidth: 4 * crack.power * FINAL_EFFECTS.lightningWidthScale,
        color: { r: 58, g: 177, b: 255, a: 0.34 },
      },
      {
        lineWidth: crack.width,
        color: { r: 230, g: 248, b: 255, a: 0.86 },
      },
    ].forEach(({ lineWidth, color }) => {
      drawTaperedLine(
        context,
        crack.path,
        visibleAmount,
        lineWidth,
        color,
        alpha,
      );
      drawTaperedLine(
        context,
        crack.branch,
        visibleAmount * 0.82,
        lineWidth * 0.72,
        color,
        alpha * 0.82,
      );
    });
  });

  context.restore();
}

function playArenaShellCracks(rankInfo) {
  if (!hasOuterLightning(rankInfo)) {
    clearArenaShellCracks();
    return;
  }

  if (state.finalCrackAnimationId !== null) {
    cancelAnimationFrame(state.finalCrackAnimationId);
    state.finalCrackAnimationId = null;
  }

  const bounds = prepareArenaCracksCanvas();
  const cracks = createArenaCrackData(bounds, rankInfo);
  const duration = Math.round(1200 + (rankInfo.index - 4) * 160);
  const startTime = performance.now();

  elements.arenaShell.classList.add("final-cracks-active");

  const animate = (currentTime) => {
    const progress = Math.min(1, (currentTime - startTime) / duration);

    drawArenaCracksFrame(bounds.context, bounds, cracks, progress);

    if (progress < 1) {
      state.finalCrackAnimationId = requestAnimationFrame(animate);
      return;
    }

    clearArenaShellCracks();
    state.finalCrackAnimationId = null;
  };

  state.finalCrackAnimationId = requestAnimationFrame(animate);
}

function playFinalResultImpact(rankInfo = getRankInfo()) {
  clearTimeoutKey("finalCrackTimeoutId");

  const power = getRankEffectPower(rankInfo);
  const impactDuration = Math.round(360 * Math.min(1.65, power));
  const cleanupDelay = Math.round(1250 * power);

  elements.gameArea.classList.remove(
    ...ARENA_IMPACT_CLASSES,
    "final-impact",
  );
  clearFinalCracksEffects();
  createFinalCracks(rankInfo);

  void elements.gameArea.offsetWidth;
  void elements.finalCracks.offsetWidth;

  elements.gameArea.classList.add("final-impact");
  elements.finalCracks.classList.add("active");
  playArenaShellCracks(rankInfo);

  shakeElement(elements.gameArea, {
    x: 2.25 * 1.5 * Math.min(2.1, power),
    y: 2.15 * 1.5 * Math.min(2.1, power),
    frames: 9,
    duration: impactDuration,
  });

  state.finalCrackTimeoutId = setTimeout(() => {
    elements.gameArea.classList.remove("final-impact");
    clearFinalCracksEffects();
  }, cleanupDelay);
}

function renderResultField({ label, value, type = "" }, index, timing) {
  return `
    <div
      class="${["result-field", type].filter(Boolean).join(" ")}"
      style="
        --result-field-delay: ${index * timing.fieldStepDelay}ms;
        --result-field-duration: ${timing.fieldDuration}ms;
        --result-flash-duration: ${timing.flashDuration}ms;
      "
    >
      <span class="result-label">${label}</span>
      <strong class="result-value"><span>${value}</span></strong>
    </div>
  `;
}

function renderResult(rankInfo = getRankInfo()) {
  const score = getScoreParts();
  const timing = getFinalSequenceTiming(rankInfo);
  const { rank } = rankInfo;
  const fields = [
    {
      label: "Final score",
      value: formatScore(score.total),
      type: "primary score",
    },
    {
      label: "Formula",
      value: `${state.normalLetters} × ${formatScore(CONFIG.normalLetterPoints)} + (${state.goldenLetters} × ${formatScore(CONFIG.goldenLetterPoints)}) = ${formatScore(score.total)}`,
      type: "formula",
    },
    {
      label: "Stylish rank",
      value: `${rank.grade} - ${rank.title}`,
      type: "rank",
    },
    {
      label: "Normal points",
      value: formatScore(score.normal),
      type: "score",
    },
    {
      label: "Golden letters",
      value: state.goldenLetters,
      type: "score",
    },
    {
      label: "Golden bonus",
      value: formatScore(score.golden),
      type: "score",
    },
  ];

  elements.result.innerHTML = `
    <h2 class="result-title">Mission Complete</h2>
    <div class="result-grid">
      ${fields
        .map((field, index) => renderResultField(field, index, timing))
        .join("")}
    </div>
  `;

  elements.result.classList.remove("hidden");
  syncArena();
  elements.gameArea.classList.add("result-orbit");
  startRankResultEffects();

  state.resultSparkTimeoutId = setTimeout(() => {
    startFinalScoreEffects(score.total);
  }, timing.scoreSparkDelay);
}

function finishGame() {
  // Final flow is deliberately staged:
  // rank toast -> impact/cracks -> result table.
  if (state.phase !== "running") return;

  state.phase = "finished";
  elements.startButton.disabled = false;

  const rankInfo = getRankInfo();
  const timing = getFinalSequenceTiming(rankInfo);

  clearRuntime();
  removeAllLetters();
  updateTime(0);
  setIdleBackdropActive(true);
  showFinalRankToast(rankInfo);

  state.finalImpactTimeoutId = setTimeout(
    () => playFinalResultImpact(rankInfo),
    timing.impactDelay,
  );
  state.resultDelayTimeoutId = setTimeout(
    () => renderResult(rankInfo),
    timing.resultDelay,
  );
}
