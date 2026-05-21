/* =========================
   Score and rank calculations
   ========================= */
function getScoreParts() {
  const normal = state.normalLetters * CONFIG.normalLetterPoints;
  const golden = state.goldenLetters * CONFIG.goldenLetterPoints;

  return {
    normal,
    golden,
    total: normal + golden,
  };
}

function getArenaScale() {
  return Math.max(
    0.42,
    Math.min(
      1,
      elements.gameArea.clientWidth / 740,
      elements.gameArea.clientHeight / 640,
    ),
  );
}

function getLetterSize(isGolden) {
  return (
    (isGolden ? CONFIG.goldenLetterSize : CONFIG.normalLetterSize) *
    getArenaScale()
  );
}

function getRankInfo() {
  // Stylish rank is calculated from a separate temporary score.
  // This score decays and is not subtracted from the final result.
  let points = Math.min(state.stylePoints, MAX_STYLE_POINTS);
  let consumed = 0;

  for (let index = 0; index < STYLE_RANKS.length; index += 1) {
    const rank = STYLE_RANKS[index];
    const isLast = index === STYLE_RANKS.length - 1;

    if (isLast || points < consumed + rank.target) {
      return {
        index,
        rank,
        progress: Math.max(0, points - consumed),
        target: rank.target,
      };
    }

    consumed += rank.target;
  }
}

function setText(element, value) {
  element.textContent = String(value);
}

function formatScore(value) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
