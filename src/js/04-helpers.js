/* =========================
   Shared helpers
   ========================= */
function clearTimeoutKey(key) {
  if (state[key] === null) return;
  clearTimeout(state[key]);
  state[key] = null;
}

function clearTimeoutGroup(keys) {
  keys.forEach(clearTimeoutKey);
}

function cancelAnimationFrameKey(key) {
  if (state[key] === null) return;
  cancelAnimationFrame(state[key]);
  state[key] = null;
}

function removeElements(root, selector) {
  root.querySelectorAll(selector).forEach((node) => node.remove());
}

function resetArenaImpactClasses() {
  elements.gameArea.classList.remove(...ARENA_IMPACT_CLASSES);
}

function clearArenaShellCracks() {
  elements.arenaShell.classList.remove("final-cracks-active");
  clearArenaCracksCanvas();
}

function resetFinalCracksElement() {
  elements.finalCracks.className = "final-cracks";
  elements.finalCracks.innerHTML = "";
}

function clearFinalCracksEffects() {
  resetFinalCracksElement();
  clearArenaShellCracks();
}

function buildShakeFrames(xPower, yPower, frameCount) {
  const frames = [{ transform: "translate3d(0, 0, 0)" }];

  for (let index = 0; index < frameCount; index += 1) {
    frames.push({
      transform: `translate3d(${random(-xPower, xPower).toFixed(2)}px, ${random(-yPower, yPower).toFixed(2)}px, 0)`,
    });
  }

  frames.push({ transform: "translate3d(0, 0, 0)" });
  return frames;
}

function shakeElement(element, { x, y, frames, duration }) {
  element.animate(buildShakeFrames(x, y, frames), {
    duration,
    easing: "ease-out",
  });
}
