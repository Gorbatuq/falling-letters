/* =========================
   Static UI and HUD rendering
   ========================= */
function renderScoreHelp() {
  const whiteExample = 3;
  const goldenExample = 2;
  const normalPoints = whiteExample * CONFIG.normalLetterPoints;
  const goldenPoints = goldenExample * CONFIG.goldenLetterPoints;
  const total = normalPoints + goldenPoints;

  elements.scoreHelp.innerHTML = `
    <h2 id="scoreHelpTitle" class="score-help-title">Score rules</h2>
    <div class="score-help-row">
      <span>White letter</span>
      <strong>+${formatScore(CONFIG.normalLetterPoints)}</strong>
    </div>
    <div class="score-help-row golden">
      <span>Golden letter</span>
      <strong>+${formatScore(CONFIG.goldenLetterPoints)}</strong>
    </div>
    <p class="score-help-note">
      Golden letters fall faster and give twice as many points.
    </p>
    <div class="score-help-example">
      ${whiteExample} × ${formatScore(CONFIG.normalLetterPoints)} +
      ${goldenExample} × ${formatScore(CONFIG.goldenLetterPoints)} =
      ${formatScore(total)}
    </div>
  `;
}

function setHelpOpen(isOpen) {
  elements.scoreHelp.classList.toggle("open", isOpen);
  elements.scoreHelp.setAttribute("aria-hidden", String(!isOpen));
  elements.helpButton.classList.toggle("active", isOpen);
  elements.helpButton.setAttribute("aria-expanded", String(isOpen));
}

function toggleScoreHelp() {
  setHelpOpen(!elements.scoreHelp.classList.contains("open"));
}

function setIdleBackdropActive(isActive) {
  elements.idleBackdrop.classList.toggle("active", isActive);
}

function syncArena() {
  // Keeps letter sizes, orbit path and active letters aligned
  // when the arena shrinks on smaller screens.
  const scale = getArenaScale();
  const inset = Math.max(10, Math.min(18, 18 * scale));
  const width = elements.gameArea.clientWidth;
  const height = elements.gameArea.clientHeight;
  const right = Math.max(inset, width - inset);
  const bottom = Math.max(inset, height - inset);

  elements.gameArea.style.setProperty("--letter-scale", scale.toFixed(3));
  elements.orbitDrop.style.offsetPath = `path("M ${inset.toFixed(2)} ${inset.toFixed(2)} H ${right.toFixed(2)} V ${bottom.toFixed(2)} H ${inset.toFixed(2)} V ${inset.toFixed(2)}")`;

  state.letters.forEach((letter) => {
    letter.x = Math.min(
      letter.x,
      Math.max(0, width - getLetterSize(letter.isGolden)),
    );
    letter.element.style.setProperty("--x", `${letter.x}px`);
  });
}

function updateTime(seconds) {
  state.displayedTime = seconds;
  setText(elements.time, seconds);
  elements.time.classList.toggle("danger", seconds > 0 && seconds <= 5);
}

function updateScore() {
  setText(elements.score, formatScore(getScoreParts().total));
}

function restartAnimation(element, className, clearClasses) {
  element.classList.remove(...clearClasses);
  void element.offsetWidth;
  element.classList.add(className);
}

function updateRank(animate = false) {
  const previousIndex = state.styleRankIndex;
  const info = getRankInfo();

  state.styleRankIndex = info.index;
  elements.styleRank.dataset.rankIndex = String(info.index);
  elements.rankTexts.forEach((node) => setText(node, info.rank.grade));
  setText(elements.rankName, info.rank.title);
  elements.progress.style.width = `${(info.progress / info.target) * 100}%`;

  if (animate) {
    restartAnimation(
      elements.styleRank,
      previousIndex === info.index ? "style-hit" : "rank-up",
      ["style-hit", "rank-up"],
    );
  }
}

function clearRuntime() {
  cancelAnimationFrameKey("animationFrameId");
  cancelAnimationFrameKey("finalCrackAnimationId");
  clearTimeoutGroup(TIMEOUT_KEYS);
}

function removeAllLetters() {
  state.letters.forEach((letter) => letter.element.remove());
  state.letters = [];
}

function clearEffects() {
  elements.gameArea.classList.remove(...GAME_EFFECT_CLASSES);
  elements.styleRank.classList.remove(...STYLE_EFFECT_CLASSES);

  $("#rankSparks")?.remove();
  removeElements(elements.result, ".final-score-sparks");
  removeElements(elements.score.parentElement, ".score-sparks");

  elements.scoreImpact.className = "score-impact hidden";
  elements.countdown.className = "countdown hidden";
  elements.countdown.textContent = "";
  elements.rankToast.className = "rank-toast hidden";
  elements.rankToast.textContent = "";

  clearFinalCracksEffects();
  setHelpOpen(false);
}

function resetGame() {
  clearRuntime();
  removeAllLetters();
  Object.assign(state, createInitialState());

  updateTime(0);
  updateScore();
  updateRank(false);
  syncArena();
  clearEffects();
  setIdleBackdropActive(true);

  elements.result.innerHTML = "";
  elements.result.classList.add("hidden");
}
