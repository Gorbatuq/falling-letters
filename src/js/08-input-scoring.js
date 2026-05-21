/* =========================
   Hit / miss handling
   ========================= */
function changeStylePoints(delta, animate = false) {
  const previousRankIndex = state.styleRankIndex;
  const nextPoints = Math.max(
    0,
    Math.min(MAX_STYLE_POINTS, state.stylePoints + delta),
  );

  if (nextPoints === state.stylePoints) {
    return { changed: false, rankChanged: false };
  }

  state.stylePoints = nextPoints;
  updateRank(animate);

  return {
    changed: true,
    rankChanged: previousRankIndex !== state.styleRankIndex,
  };
}

function registerMiss() {
  state.misses += 1;
  changeStylePoints(-CONFIG.missPenalty);
  playArenaImpact("miss");
}

function handleKeyDown(event) {
  if (state.phase !== "running" || event.repeat) return;

  const pressedKey = getPressedLetter(event);
  if (!pressedKey || !VALID_KEYS.has(pressedKey)) return;

  const matchedLetter = findMatchedLetter(pressedKey);

  if (!matchedLetter) {
    registerMiss();
    return;
  }

  state.letters = state.letters.filter(
    (letter) => letter.id !== matchedLetter.id,
  );
  removeLetterWithImpact(matchedLetter);

  const points = matchedLetter.isGolden
    ? CONFIG.goldenLetterPoints
    : CONFIG.normalLetterPoints;

  if (matchedLetter.isGolden) {
    state.goldenLetters += 1;
  } else {
    state.normalLetters += 1;
  }

  changeStylePoints(CONFIG.styleHitPoints, true);

  if (matchedLetter.isGolden) {
    playArenaImpact("hit");
  }

  updateScore();
  showScoreImpact(matchedLetter.isGolden ? "gold" : "white", points);
  showHudScoreSparks();
}
