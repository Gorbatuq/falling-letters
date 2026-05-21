/* =========================
   Runtime state
   ========================= */
const createInitialState = () => ({
  phase: "idle",
  letters: [],
  nextLetterId: 0,
  normalLetters: 0,
  goldenLetters: 0,
  misses: 0,
  stylePoints: 0,
  styleRankIndex: 0,
  displayedTime: 0,
  sessionEndTime: 0,
  lastFrameTime: 0,
  spawnAccumulator: 0,
  styleDecayAccumulator: 0,
  animationFrameId: null,
  countdownTimeoutId: null,
  scoreImpactTimeoutId: null,
  arenaImpactTimeoutId: null,
  scoreSparkTimeoutId: null,
  resultSparkTimeoutId: null,
  rankToastTimeoutId: null,
  resultDelayTimeoutId: null,
  finalImpactTimeoutId: null,
  finalCrackTimeoutId: null,
  finalCrackAnimationId: null,
});

const state = createInitialState();
