/**
 * programsEngine.js
 * CM1040 Coursework 2 -- Renders programas_rurales.json onto the
 * "Closing the gap" page.
 *
 * This reuses the same pattern already demonstrated in templateEngine.js
 * (Topic 6: template engines -- iteration + validation before rendering),
 * applied to a second, independent JSON dataset. Keeping it in its own
 * module (rather than piling everything into templateEngine.js) mirrors
 * the folder-per-concern organisation the course expects.
 */

import { filterValid, validateProgram } from "./validator.js";

/**
 * Renders a single rural connectivity programme into an HTML string.
 * BRANCHING: programmes launched before the national fibre backbone was
 * usable (2015) are labelled "Foundational programme"; later ones,
 * which built on that infrastructure, are labelled "Recent programme".
 * This mirrors the same before/during branching pattern used for events
 * in templateEngine.js, applied to a different field and threshold.
 */
function renderProgramTemplate(program) {
  const regionList = program.regiones.join(", ");

  const isFoundational = program.anioInicio < 2015;
  const statusClass = isFoundational ? "program-card--foundational" : "program-card--recent";
  const statusText = isFoundational ? "Foundational programme" : "Recent programme";

  const imageMarkup = program.imagen
    ? `<img class="program-card__image" src="img/${encodeURIComponent(program.imagen)}" alt="${escapeHtml(program.imagenAlt || "")}"${program.imagenWidth ? ` width="${program.imagenWidth}" height="${program.imagenHeight}"` : ""}>`
    : "";
  // Branching: only content-rich images (flagged "imagenZoomable" in the
  // JSON) get wrapped in a click-to-enlarge trigger.
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

/**
 * Iterates over the validated programmes and joins their rendered
 * templates into a single HTML string (the ITERATION step, same
 * concept as renderEventList in templateEngine.js).
 */
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

/**
 * Entry point: fetches programas_rurales.json, validates it, and
 * renders the programme cards. Call this once from the page's
 * script after the DOM is ready.
 */
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
