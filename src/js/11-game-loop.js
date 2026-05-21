/* =========================
   Game loop and startup
   ========================= */
function gameLoop(currentTime) {
  if (state.phase !== "running") return;

  const deltaTime = Math.min(
    (currentTime - state.lastFrameTime) / 1000,
    0.05,
  );
  const secondsLeft = Math.max(
    0,
    Math.ceil((state.sessionEndTime - currentTime) / 1000),
  );

  state.lastFrameTime = currentTime;
  state.spawnAccumulator += deltaTime;
  state.styleDecayAccumulator += deltaTime;

  if (secondsLeft !== state.displayedTime) updateTime(secondsLeft);

  while (state.spawnAccumulator >= CONFIG.spawnEvery) {
    spawnLetter();
    state.spawnAccumulator -= CONFIG.spawnEvery;
  }

  while (state.styleDecayAccumulator >= CONFIG.styleDecayEvery) {
    changeStylePoints(-CONFIG.styleDecayPoints);
    state.styleDecayAccumulator -= CONFIG.styleDecayEvery;
  }

  updateLetters(deltaTime);

  if (currentTime >= state.sessionEndTime) {
    finishGame();
    return;
  }

  state.animationFrameId = requestAnimationFrame(gameLoop);
}

function startSession() {
  const now = performance.now();

  setIdleBackdropActive(false);
  state.phase = "running";
  state.lastFrameTime = now;
  state.sessionEndTime = now + CONFIG.duration * 1000;
  state.spawnAccumulator = 0;
  state.styleDecayAccumulator = 0;

  elements.countdown.className = "countdown hidden";
  syncArena();
  updateTime(CONFIG.duration);
  spawnLetter();

  state.animationFrameId = requestAnimationFrame(gameLoop);
}

function startCountdown() {
  let count = 3;

  setIdleBackdropActive(false);
  state.phase = "countdown";
  elements.countdown.classList.remove("hidden");
  playCountdown(count);

  const tick = () => {
    count -= 1;

    if (count > 0) {
      playCountdown(count);
      state.countdownTimeoutId = setTimeout(tick, 1000);
      return;
    }

    playCountdown("GO!");
    state.countdownTimeoutId = setTimeout(startSession, 520);
  };

  state.countdownTimeoutId = setTimeout(tick, 1000);
}

function startGame() {
  resetGame();
  elements.startButton.disabled = true;
  updateTime(CONFIG.duration);
  startCountdown();
}

window.addEventListener("resize", syncArena);
window.addEventListener("orientationchange", syncArena);
window.addEventListener("keydown", handleKeyDown);
elements.startButton.addEventListener("click", startGame);
elements.helpButton.addEventListener("click", toggleScoreHelp);

renderScoreHelp();
resetGame();
