
const FONT_STEP_REM = 0.1;
const FONT_MIN_REM = 0.7;   // was 0.9 -- too close to default, gave almost no room
const FONT_MAX_REM = 1.8;   // was 1.6
const DEFAULT_FONT_REM = 1.0;

let currentFontRem = DEFAULT_FONT_REM;

function toggleContrast() {
  const isPressed = document.body.classList.toggle("alt-theme");
  const contrastButton = document.querySelector("#a11y-contrast-toggle");
  if (contrastButton) {
    contrastButton.setAttribute("aria-pressed", String(isPressed));
  }
}

function increaseFontSize() {
  currentFontRem = Math.min(FONT_MAX_REM, currentFontRem + FONT_STEP_REM);
  applyFontSize();
}

function decreaseFontSize() {
  currentFontRem = Math.max(FONT_MIN_REM, currentFontRem - FONT_STEP_REM);
  applyFontSize();
}

function resetFontSize() {
  currentFontRem = DEFAULT_FONT_REM;
  applyFontSize();
}

function applyFontSize() {

  document.documentElement.style.setProperty(
    "font-size",
    `${(currentFontRem * 100).toFixed(0)}%`
  );
}

function initAccessibilityBar() {
  const contrastButton = document.querySelector("#a11y-contrast-toggle");
  const increaseButton = document.querySelector("#a11y-font-increase");
  const decreaseButton = document.querySelector("#a11y-font-decrease");
  const resetButton = document.querySelector("#a11y-font-reset");

  if (contrastButton) {
    contrastButton.setAttribute("aria-pressed", "false");
    contrastButton.addEventListener("click", toggleContrast);
  }
  if (increaseButton) {
    increaseButton.addEventListener("click", increaseFontSize);
  }
  if (decreaseButton) {
    decreaseButton.addEventListener("click", decreaseFontSize);
  }
  if (resetButton) {
    resetButton.addEventListener("click", resetFontSize);
  }
}

export { initAccessibilityBar, toggleContrast, increaseFontSize, decreaseFontSize, resetFontSize };