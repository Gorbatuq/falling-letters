/* =========================
   Letter lifecycle
   ========================= */
function getPressedLetter(event) {
  return event.code.startsWith("Key")
    ? event.code.slice(3).toUpperCase()
    : null;
}

function getRandomLetter() {
  return LETTERS[Math.floor(Math.random() * LETTERS.length)];
}

function createLetterElement(letter) {
  const element = document.createElement("div");
  const classes = ["letter"];

  if (letter.isGolden) classes.push("golden");
  if (letter.char === "Q") classes.push("q-letter");

  element.className = classes.join(" ");
  element.textContent = letter.char;
  element.style.setProperty("--x", `${letter.x}px`);
  element.style.setProperty("--y", `${letter.y}px`);
  elements.gameArea.appendChild(element);

  return element;
}

function spawnLetter() {
  const isGolden = Math.random() < CONFIG.goldenChance;
  const size = getLetterSize(isGolden);
  const speedRange = isGolden ? CONFIG.goldenSpeed : CONFIG.normalSpeed;
  const scale = getArenaScale();

  const letter = {
    id: state.nextLetterId,
    char: getRandomLetter(),
    x: random(0, Math.max(0, elements.gameArea.clientWidth - size)),
    y: -size,
    speed: random(speedRange.min, speedRange.max) * scale,
    isGolden,
    element: null,
  };

  state.nextLetterId += 1;
  letter.element = createLetterElement(letter);
  state.letters.push(letter);
}

function updateLetters(deltaTime) {
  const bottom = elements.gameArea.clientHeight;

  state.letters = state.letters.filter((letter) => {
    letter.y += letter.speed * deltaTime;
    letter.element.style.setProperty("--y", `${letter.y}px`);

    if (letter.y <= bottom) return true;

    letter.element.remove();
    return false;
  });
}

function findMatchedLetter(char) {
  return state.letters.reduce((best, letter) => {
    if (letter.char !== char) return best;
    return !best || letter.y > best.y ? letter : best;
  }, null);
}

function removeLetterWithImpact(letter) {
  letter.element.classList.add("hit");
  letter.element.addEventListener(
    "animationend",
    () => letter.element.remove(),
    { once: true },
  );
}

function showScoreImpact(variant, points) {
  clearTimeout(state.scoreImpactTimeoutId);

  elements.scoreImpact.textContent =
    points > 0 ? `+${formatScore(points)}` : formatScore(points);
  elements.scoreImpact.className = `score-impact ${variant}`;
  void elements.scoreImpact.offsetWidth;
  elements.scoreImpact.classList.add("active");

  state.scoreImpactTimeoutId = setTimeout(() => {
    elements.scoreImpact.className = "score-impact hidden";
  }, 320);
}

function showHudScoreSparks() {
  clearTimeoutKey("scoreSparkTimeoutId");
  removeElements(elements.score.parentElement, ".score-sparks");

  createSparkLayer({
    host: elements.score.parentElement,
    ...SPARK_PRESETS.hudScore,
  });

  state.scoreSparkTimeoutId = setTimeout(() => {
    removeElements(elements.score.parentElement, ".score-sparks");
  }, 900);
}

function playCountdown(value) {
  elements.countdown.textContent = String(value);
  restartAnimation(elements.countdown, "impact", ["impact"]);
}

function playArenaImpact(type) {
  // Arena flash is intentionally reserved for golden hits and misses.
  // White hits still update score/rank, but no yellow screen pulse.
  clearTimeoutKey("arenaImpactTimeoutId");

  const isMiss = type === "miss";
  const shake = isMiss ? ARENA_SHAKE.miss : ARENA_SHAKE.hit;

  resetArenaImpactClasses();
  void elements.gameArea.offsetWidth;
  elements.gameArea.classList.add(
    "rank-impact",
    isMiss ? "miss-impact" : "hit-impact",
  );

  shakeElement(elements.gameArea, shake);

  state.arenaImpactTimeoutId = setTimeout(() => {
    resetArenaImpactClasses();
  }, 280);
}
