/**
 * statsEngine.js
 * CM1040 Coursework 2 -- Renders estadisticas_regionales.json onto the
 * "Peru today" page: a real, accessible <table> for the Lima/Urban/Rural
 * comparison, plus two highlighted stat callouts.
 *
 * Same fetch -> validate -> render pattern as templateEngine.js and
 * programsEngine.js, applied to a third, differently-shaped dataset
 * (this one is a single object, not an array of events).
 */

import { validateStats } from "./validator.js";

/**
 * Formats a highlighted stat's value according to its unit, so the
 * JSON data doesn't need to hardcode display strings.
 */
function formatStatValue(stat) {
  if (stat.unidad === "percent") {
    return `${stat.valor}%`;
  }
  if (stat.unidad === "millones de soles") {
    return `S/ ${stat.valor}M`;
  }
  return `${stat.valor}`;
}

/**
 * Builds the accessible comparison table (BRANCHING: null values in the
 * data -- e.g. no computer-ownership figure for rural areas -- render as
 * "N/A" instead of breaking the layout).
 */
function renderComparisonTable(stats) {
  const rows = stats.comparacionRegional
    .map((row) => {
      const computerValue =
        row.hogaresConComputadora === null || row.hogaresConComputadora === undefined
          ? "N/A"
          : `${row.hogaresConComputadora}%`;

      return `
        <tr>
          <th scope="row" data-label="Region">${escapeHtml(row.region)}</th>
          <td data-label="Households online">${row.hogaresConInternet}%</td>
          <td data-label="Population using internet">${row.poblacionUsuaria}%</td>
          <td data-label="Mobile access">${row.accesoViaCelular}%</td>
          <td data-label="Households with a computer">${computerValue}</td>
        </tr>
      `;
    })
    .join("\n");

  return `
    <table class="stats-table">
      <caption>Internet access by area of residence, Peru (${escapeHtml(stats.fuenteComparacion)})</caption>
      <thead>
        <tr>
          <th scope="col">Region</th>
          <th scope="col">Households online</th>
          <th scope="col">Population using internet</th>
          <th scope="col">Mobile access</th>
          <th scope="col">Households with a computer</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

/**
 * Builds the two (or more) highlighted stat callouts, iterating over
 * estadisticasDestacadas the same way templateEngine.js iterates events.
 */
function renderHighlightStats(stats) {
  return stats.estadisticasDestacadas
    .map(
      (stat) => `
        <div class="stat-card">
          <p class="stat-card__value">${formatStatValue(stat)}</p>
          <p class="stat-card__label">${escapeHtml(stat.etiqueta)}</p>
          <p class="stat-card__detail">${escapeHtml(stat.detalle)}</p>
          <p class="stat-card__citation">Citation: ${escapeHtml(stat.citation)}</p>
        </div>
      `
    )
    .join("\n");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Entry point: fetches estadisticas_regionales.json, validates it as a
 * whole (it's a single object, not an array -- see validateStats in
 * validator.js), and renders both the table and the stat callouts.
 */
async function initPeruTodayPage() {
  const tableContainerEl = document.querySelector("#stats-table-container");
  const highlightsContainerEl = document.querySelector("#stats-highlights-container");

  try {
    const response = await fetch("json/estadisticas_regionales.json");
    const rawStats = await response.json();

    if (!validateStats(rawStats)) {
      throw new Error("estadisticas_regionales.json failed validation");
    }

    tableContainerEl.innerHTML = renderComparisonTable(rawStats);
    highlightsContainerEl.innerHTML = renderHighlightStats(rawStats);
  } catch (error) {
    console.error("[statsEngine] could not load or render estadisticas_regionales.json:", error);
    const errorMsg = `<p class="stats-error">Sorry, the statistics could not be loaded.</p>`;
    tableContainerEl.innerHTML = errorMsg;
    highlightsContainerEl.innerHTML = "";
  }
}

export { renderComparisonTable, renderHighlightStats, initPeruTodayPage };
