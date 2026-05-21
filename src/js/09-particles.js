/* =========================
   Shared particle effects
   ========================= */
function createSparkLayer({
  host,
  id,
  layerClass,
  sparkClass,
  count,
  radiusMin,
  radiusMax,
  sizeMin,
  sizeMax,
  delayMax,
  durationMin,
  durationMax,
}) {
  const layer = document.createElement("div");

  if (id) layer.id = id;
  layer.className = layerClass;

  for (let index = 0; index < count; index += 1) {
    const spark = document.createElement("span");
    const angle = (360 / count) * index + random(-4, 4);

    spark.className = sparkClass;
    spark.style.setProperty("--angle", `${angle.toFixed(2)}deg`);
    spark.style.setProperty(
      "--radius",
      `${random(radiusMin, radiusMax).toFixed(2)}px`,
    );
    spark.style.setProperty(
      "--size",
      `${random(sizeMin, sizeMax).toFixed(2)}px`,
    );
    spark.style.setProperty(
      "--delay",
      `${random(0, delayMax).toFixed(2)}s`,
    );
    spark.style.setProperty(
      "--duration",
      `${random(durationMin, durationMax).toFixed(2)}s`,
    );
    layer.appendChild(spark);
  }

  host.appendChild(layer);
  return layer;
}

function startRankResultEffects() {
  const { rank } = getRankInfo();
  const sparkCenter =
    rank.grade.length === 1 ? 74 : rank.grade.length === 2 ? 104 : 132;

  $("#rankSparks")?.remove();
  elements.styleRank.style.setProperty("--spark-x", `${sparkCenter}px`);
  createSparkLayer({
    host: elements.styleRank,
    ...SPARK_PRESETS.rankResult,
  });

  elements.styleRank.classList.add("result-showcase");
}

function startFinalScoreEffects(totalScore) {
  const primaryField = elements.result.querySelector(
    ".result-field.primary",
  );
  if (!primaryField) return;

  const sparkLayer = createSparkLayer({
    host: primaryField,
    ...SPARK_PRESETS.finalScore,
  });

  sparkLayer.style.setProperty(
    "--final-score-spark-x",
    `${Math.min(70, 18 + String(totalScore).length * 8)}px`,
  );
}
