import { filterValid, validateEvent } from "./validator.js";

function renderEventTemplate(event) {
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

function renderEventList(events) {
  if (events.length === 0) {
    return `<p class="timeline-empty">No events match the current filter.</p>`;
  }
  return events.map(renderEventTemplate).join("\n");
}

function applyFilter(events, filter) {
  if (filter === "before") {
    return events.filter((event) => event.duringLifetime === false);
  }
  if (filter === "during") {
    return events.filter((event) => event.duringLifetime === true);
  }
  return events; // "all"
}

function updateTimeline(containerEl, allValidEvents, filter) {
  const filteredEvents = applyFilter(allValidEvents, filter);
  containerEl.innerHTML = renderEventList(filteredEvents);
  containerEl.setAttribute("aria-live", "polite");
}

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

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function initTimelinePage() {
  const containerEl = document.querySelector("#timeline-events");
  const filterButtonsEl = document.querySelector("#timeline-filters");

  try {
    const response = await fetch("json/events.json");
    const rawEvents = await response.json();
    const validEvents = filterValid(rawEvents, validateEvent);

    updateTimeline(containerEl, validEvents, "all");
    initTimelineFilters(containerEl, validEvents, filterButtonsEl);
  } catch (error) {
    console.error("[templateEngine] could not load or render events.json:", error);
    containerEl.innerHTML = `<p class="timeline-error">Sorry, the timeline could not be loaded.</p>`;
  }
}

export { renderEventTemplate, renderEventList, applyFilter, updateTimeline, initTimelineFilters, initTimelinePage };