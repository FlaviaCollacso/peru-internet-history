import { filterValid, validateProgram } from "./validator.js";

function renderProgramTemplate(program) {
  const regionList = program.regiones.join(", ");

  const isFoundational = program.anioInicio < 2015;
  const statusClass = isFoundational ? "program-card--foundational" : "program-card--recent";
  const statusText = isFoundational ? "Foundational programme" : "Recent programme";

  const imageMarkup = program.imagen
    ? `<img class="program-card__image" src="img/${encodeURIComponent(program.imagen)}" alt="${escapeHtml(program.imagenAlt || "")}"${program.imagenWidth ? ` width="${program.imagenWidth}" height="${program.imagenHeight}"` : ""}>`
    : "";
 
  const imageHtml = !program.imagen
    ? ""
    : program.imagenZoomable
    ? `<button type="button" class="zoomable-trigger" aria-label="Click to enlarge image">${imageMarkup}</button>`
    : imageMarkup;

  return `
    <article class="program-card ${statusClass}" tabindex="0">
      ${imageHtml}
      <span class="program-card__status">${statusText}</span>
      <span class="program-card__year">${program.anioInicio}</span>
      <h2 class="program-card__title">${escapeHtml(program.programa)}</h2>
      <p class="program-card__entity">${escapeHtml(program.entidad)}</p>
      <p class="program-card__regions">Regions: ${escapeHtml(regionList)}</p>
      <p class="program-card__scope">${escapeHtml(program.alcance)}</p>
      <p class="program-card__notes">${escapeHtml(program.notas)}</p>
      <p class="program-card__citation">Citation: ${escapeHtml(program.citation)}</p>
    </article>
  `;
}

function renderProgramList(programs) {
  if (programs.length === 0) {
    return `<p class="programs-empty">No programmes to display.</p>`;
  }
  return programs.map(renderProgramTemplate).join("\n");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function initClosingTheGapPage() {
  const containerEl = document.querySelector("#programs-list");

  try {
    const response = await fetch("json/programas_rurales.json");
    const rawPrograms = await response.json();
    const validPrograms = filterValid(rawPrograms, validateProgram);

    containerEl.innerHTML = renderProgramList(validPrograms);
  } catch (error) {
    console.error("[programsEngine] could not load or render programas_rurales.json:", error);
    containerEl.innerHTML = `<p class="programs-error">Sorry, the rural connectivity programmes could not be loaded.</p>`;
  }
}

export { renderProgramTemplate, renderProgramList, initClosingTheGapPage };
