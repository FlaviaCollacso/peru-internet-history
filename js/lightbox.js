/**
 * lightbox.js
 * CM1040 Coursework 2 -- Simple "click to enlarge" viewer for
 * content-rich images (charts, scanned documents) where a reader may
 * want to see full detail, not just the thumbnail-sized card version.
 *
 * Built on the native <dialog> element, which gives focus trapping and
 * Escape-to-close for free in modern browsers -- no custom keyboard/focus
 * management code needed to keep this accessible.
 */

function buildDialog() {
  const dialog = document.createElement("dialog");
  dialog.className = "lightbox-dialog";
  dialog.setAttribute("aria-label", "Enlarged image");
  dialog.innerHTML = `
    <button type="button" class="lightbox-dialog__close" aria-label="Close enlarged image">&times;</button>
    <img class="lightbox-dialog__image" src="" alt="">
  `;
  document.body.appendChild(dialog);

  dialog.querySelector(".lightbox-dialog__close").addEventListener("click", () => {
    dialog.close();
  });

  // Clicking the dark backdrop (outside the image itself) also closes it.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  return dialog;
}

/**
 * Wires up every "click to enlarge" trigger already present on the page
 * (rendered by programsEngine.js / statsEngine.js whenever a JSON entry
 * has "imagenZoomable": true). Uses event delegation on document, so it
 * also works for images that render later, after their own fetch()
 * resolves -- not just ones present at page load.
 */
function initLightbox() {
  const dialog = buildDialog();
  const dialogImage = dialog.querySelector(".lightbox-dialog__image");

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest(".zoomable-trigger");
    if (!trigger) return;

    const img = trigger.querySelector("img");
    if (!img) return;

    dialogImage.src = img.src;
    dialogImage.alt = img.alt;
    dialog.showModal();
  });
}

export { initLightbox };
