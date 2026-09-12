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
 */
function renderProgramTemplate(program) {
  const regionList = program.regiones.join(", ");

  return `
    <article class="program-card" tabindex="0">
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
