/* =========================
   Configuration
   ========================= */
const POINT_UNIT = 100;

const CONFIG = {
  duration: 20,
  spawnEvery: 0.6,
  pointUnit: POINT_UNIT,
  normalLetterSize: 120,
  goldenLetterSize: 102,
  normalLetterPoints: POINT_UNIT,
  goldenLetterPoints: POINT_UNIT * 2,
  missPenalty: POINT_UNIT * 2,
  styleHitPoints: POINT_UNIT,
  styleDecayEvery: 0.5,
  styleDecayPoints: POINT_UNIT / 4,
  goldenChance: 0.18,
  normalSpeed: { min: 140, max: 230 },
  goldenSpeed: { min: 250, max: 360 },
};

const FINAL_EFFECTS = {
  lightningCountScale: 0.75,
  lightningWidthScale: 0.25,
  impactDelayMs: 1000,
  resultBaseDelayMs: 2500,
  resultDelayPerRankMs: 140,
  fieldBaseStepDelayMs: 95,
  fieldStepDelayPerRankMs: 12,
  fieldBaseDurationMs: 760,
  fieldDurationPerRankMs: 38,
  flashBaseDurationMs: 920,
  flashDurationPerRankMs: 42,
  scoreSparkBaseDelayMs: 720,
  scoreSparkDelayPerRankMs: 50,
};

const STYLE_RANKS = [
  { grade: "D", title: "Dismal", target: 5 * POINT_UNIT },
  { grade: "C", title: "Crazy", target: 4 * POINT_UNIT },
  { grade: "B", title: "Badass", target: 3 * POINT_UNIT },
  { grade: "A", title: "Apocalyptic!", target: 3 * POINT_UNIT },
  { grade: "S", title: "Savage!", target: 2 * POINT_UNIT },
  { grade: "SS", title: "Sick Skills!!", target: 2 * POINT_UNIT },
  { grade: "SSS", title: "Smokin' Sexy Style!!", target: 1 * POINT_UNIT },
];

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const VALID_KEYS = new Set(LETTERS);
const MAX_STYLE_POINTS = STYLE_RANKS.reduce(
  (sum, rank) => sum + rank.target,
  0,
);

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const random = (min, max) => Math.random() * (max - min) + min;

const TIMEOUT_KEYS = [
  "countdownTimeoutId",
  "scoreImpactTimeoutId",
  "arenaImpactTimeoutId",
  "scoreSparkTimeoutId",
  "resultSparkTimeoutId",
  "rankToastTimeoutId",
  "resultDelayTimeoutId",
  "finalImpactTimeoutId",
  "finalCrackTimeoutId",
];

const ARENA_IMPACT_CLASSES = ["rank-impact", "hit-impact", "miss-impact"];

const GAME_EFFECT_CLASSES = [
  ...ARENA_IMPACT_CLASSES,
  "final-impact",
  "result-orbit",
];

const STYLE_EFFECT_CLASSES = ["result-showcase", "style-hit", "rank-up"];

const ARENA_SHAKE = {
  hit: { x: 1.15, y: 1.25, frames: 6, duration: 220 },
  miss: { x: 2.25, y: 2.15, frames: 6, duration: 220 },
};

const SPARK_PRESETS = {
  hudScore: {
    layerClass: "score-sparks",
    sparkClass: "score-spark",
    count: 18,
    radiusMin: 18,
    radiusMax: 44,
    sizeMin: 1.5,
    sizeMax: 3.8,
    delayMax: 0.18,
    durationMin: 0.5,
    durationMax: 0.78,
  },
  rankResult: {
    id: "rankSparks",
    layerClass: "rank-sparks",
    sparkClass: "rank-spark",
    count: 96,
    radiusMin: 46,
    radiusMax: 124,
    sizeMin: 2.4,
    sizeMax: 6.8,
    delayMax: 1.15,
    durationMin: 0.85,
    durationMax: 1.45,
  },
  finalScore: {
    layerClass: "final-score-sparks",
    sparkClass: "final-score-spark",
    count: 34,
    radiusMin: 20,
    radiusMax: 52,
    sizeMin: 1.6,
    sizeMax: 4.0,
    delayMax: 0.75,
    durationMin: 0.72,
    durationMax: 1.15,
  },
};
