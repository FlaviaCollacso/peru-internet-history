function getWidthMessage(width) {
  if (width < 480) {
    return "\uD83D\uDCF1 You're viewing this on a proper mobile-width screen right now.";
  }
  if (width < 900) {
    return "\uD83D\uDCDF Tablet-ish territory -- this is roughly where the layout starts widening out.";
  }
  return "\uD83D\uDDA5\uFE0F Nice wide screen -- try shrinking this window to see the layout adapt.";
}

function initWidthEasterEgg() {
  const el = document.querySelector("#width-easter-egg");
  if (!el) return;

  function update() {
    el.textContent = getWidthMessage(window.innerWidth);
  }

  update();
  window.addEventListener("resize", update);
}

export { initWidthEasterEgg, getWidthMessage };
