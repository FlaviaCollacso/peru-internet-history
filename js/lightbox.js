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

   dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  return dialog;
}

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
