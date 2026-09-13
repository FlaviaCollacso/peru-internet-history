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
 * DYNAMIC CHART (coursework extension): builds a bar chart as inline SVG,
 * generated entirely from a JSON array (ITERATION over chartData) rather
 * than a static picture of someone else's chart. Bar heights are scaled
 * at runtime against the largest value in the dataset, so the chart
 * would redraw itself correctly even if the JSON numbers changed.
 */
function renderFibreChart(dataPoints, citation) {
  const width = 560;
  const height = 220;
  const padding = 34;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const maxValue = Math.max(...dataPoints.map((d) => d.conexiones));
  const slotWidth = chartWidth / dataPoints.length;
  const barWidth = slotWidth - 14;

  const bars = dataPoints
    .map((d, i) => {
      const barHeight = (d.conexiones / maxValue) * chartHeight;
      const x = padding + i * slotWidth + 7;
      const y = height - padding - barHeight;
      const valueLabel = `${(d.conexiones / 1000000).toFixed(2)}M`;
      const a11yLabel = `${d.anio}: ${d.conexiones.toLocaleString("en-US")} fibre-optic connections`;
      return `
        <g role="img" aria-label="${escapeHtml(a11yLabel)}">
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="var(--color-highlight)" rx="3"></rect>
          <text x="${x + barWidth / 2}" y="${y - 6}" font-size="11" text-anchor="middle" fill="var(--text-color)">${valueLabel}</text>
          <text x="${x + barWidth / 2}" y="${height - padding + 16}" font-size="11" text-anchor="middle" fill="var(--text-color)">${d.anio}</text>
        </g>
      `;
    })
    .join("");

  return `
    <figure class="fibre-chart-figure">
      <svg viewBox="0 0 ${width} ${height}" class="fibre-chart" role="img"
           aria-label="Bar chart: fibre-optic connections in Peru grew from 200,000 in 2019 to 2.78 million in 2024">
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="var(--text-color)" stroke-width="1"></line>
        ${bars}
      </svg>
      <figcaption class="fibre-chart-figure__caption">Fibre-optic connections in Peru, 2019&ndash;2024. Citation: ${escapeHtml(citation)}</figcaption>
    </figure>
  `;
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
 * Renders a stat's visual: a dynamic chart when the entry has chartData
 * (BRANCHING), otherwise a static image if present, wrapped in a
 * click-to-enlarge trigger when flagged "imagenZoomable".
 */
function renderStatImage(stat) {
  if (stat.chartData) {
    return renderFibreChart(stat.chartData, stat.chartCitation || "");
  }
  if (!stat.imagen) {
    return "";
  }
  const imageMarkup = `<img class="stat-card__image" src="img/${encodeURIComponent(stat.imagen)}" alt="${escapeHtml(stat.imagenAlt || "")}"${stat.imagenWidth ? ` width="${stat.imagenWidth}" height="${stat.imagenHeight}"` : ""}>`;
  return stat.imagenZoomable
    ? `<button type="button" class="zoomable-trigger" aria-label="Click to enlarge image">${imageMarkup}</button>`
    : imageMarkup;
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
          ${renderStatImage(stat)}
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
