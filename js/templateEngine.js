import { filterValid, validateEvent } from "./validator.js";

/**
 * Renders a single timeline event object into an HTML string.
 * This is where BRANCHING happens: the markup differs depending on
 * whether the event happened during the author's lifetime or not.
 */
function renderEventTemplate(event) {
  // --- Branching: choose badge text/class based on duringLifetime ---
  const badgeClass = event.duringLifetime ? "badge-my-life" : "badge-before-me";
  const badgeText = event.duringLifetime ? "1996\u20132026" : "1991\u20131995";

  return `
    <article class="timeline-event ${badgeClass}" tabindex="0">
      <span class="timeline-event__badge">${badgeText}</span>
      <h2 class="timeline-event__title">${event.year} \u2014 ${escapeHtml(event.title)}</h2>
      <p class="timeline-event__description">${escapeHtml(event.description)}</p>
      <p class="timeline-event__citation">Citation: ${escapeHtml(event.citation)}</p>
    </article>
  `;
}

/**
 * Iterates over an array of validated events and joins their rendered
 * templates into a single HTML string. This is the ITERATION step.
 */
function renderEventList(events) {
  if (events.length === 0) {
    return `<p class="timeline-empty">No events match the current filter.</p>`;
  }
  return events.map(renderEventTemplate).join("\n");
}

/**
 * Applies the current filter ("before", "during", or "all") to the
 * full list of valid events, returning only the matching subset.
 */
function applyFilter(events, filter) {
  if (filter === "before") {
    return events.filter((event) => event.duringLifetime === false);
  }
  if (filter === "during") {
    return events.filter((event) => event.duringLifetime === true);
  }
  return events; // "all"
}

/**
 * AUTOMATIC UPDATE: re-renders the timeline into the given container
 * element whenever this function is called (e.g. from a filter button's
 * click handler), without reloading the page. Also announces the change
 * to assistive technology via the aria-live region (WCAG 4.1.3).
 */
function updateTimeline(containerEl, allValidEvents, filter) {
  const filteredEvents = applyFilter(allValidEvents, filter);
  containerEl.innerHTML = renderEventList(filteredEvents);
  containerEl.setAttribute("aria-live", "polite");
}

/**
 * Wires up the three filter buttons (Before me / My life / All) so that
 * clicking one calls updateTimeline() with the corresponding filter value,
 * and toggles the aria-pressed state for accessibility (WCAG 4.1.2).
 */
function initTimelineFilters(containerEl, allValidEvents, filterButtonsEl) {
  const buttons = filterButtonsEl.querySelectorAll("[data-filter]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");

      buttons.forEach((b) => b.setAttribute("aria-pressed", "false"));
      button.setAttribute("aria-pressed", "true");

      updateTimeline(containerEl, allValidEvents, filter);
    });
  });
}

/**
 * Basic HTML-escaping helper so that citation/description text from the
 * JSON data cannot break the page markup or introduce injected HTML.
 */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Reads the initial filter from the page URL, e.g. timeline.html?filter=before
 * This lets other pages (like the Home page teaser cards) deep-link directly
 * into a specific filter instead of always landing on "all".
 */
function getInitialFilterFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("filter");
  return ["before", "during", "all"].includes(requested) ? requested : "all";
}

/**
 * Syncs the toggle buttons' visual/aria-pressed state to match whichever
 * filter is currently active, so the correct pill is highlighted even when
 * the page loads pre-filtered from a link (not just from a click).
 */
function syncFilterButtons(filterButtonsEl, activeFilter) {
  const buttons = filterButtonsEl.querySelectorAll("[data-filter]");
  buttons.forEach((button) => {
    const isActive = button.getAttribute("data-filter") === activeFilter;
    button.setAttribute("aria-pressed", String(isActive));
  });
}

/**
 * Entry point: fetches events.json, validates it, renders the initial
 * view (respecting a ?filter= URL parameter if present), and wires up
 * the filter buttons.
 * Call this once from your page's main script after the DOM is ready.
 */
async function initTimelinePage() {
  const containerEl = document.querySelector("#timeline-events");
  const filterButtonsEl = document.querySelector("#timeline-filters");

  try {
    const response = await fetch("json/events.json");
    const rawEvents = await response.json();
    const validEvents = filterValid(rawEvents, validateEvent);

    const initialFilter = getInitialFilterFromUrl();
    updateTimeline(containerEl, validEvents, initialFilter);
    syncFilterButtons(filterButtonsEl, initialFilter);
    initTimelineFilters(containerEl, validEvents, filterButtonsEl);
  } catch (error) {
    console.error("[templateEngine] could not load or render events.json:", error);
    containerEl.innerHTML = `<p class="timeline-error">Sorry, the timeline could not be loaded.</p>`;
  }
}

export { renderEventTemplate, renderEventList, applyFilter, updateTimeline, initTimelineFilters, initTimelinePage };
