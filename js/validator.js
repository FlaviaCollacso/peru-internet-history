function validateEvent(event, index) {
  const errors = [];

  if (typeof event.year !== "number" || Number.isNaN(event.year)) {
    errors.push(`year must be a number (got: ${JSON.stringify(event.year)})`);
  }
  if (typeof event.title !== "string" || event.title.trim() === "") {
    errors.push("title must be a non-empty string");
  }
  if (typeof event.description !== "string" || event.description.trim() === "") {
    errors.push("description must be a non-empty string");
  }
  if (typeof event.citation !== "string" || event.citation.trim() === "") {
    errors.push("citation must be a non-empty string");
  }
  if (
    "duringLifetime" in event &&
    typeof event.duringLifetime !== "boolean"
  ) {
    errors.push("duringLifetime must be a boolean if present");
  }

  if (errors.length > 0) {
    console.warn(
      `[validator] events.json: entry at index ${index} skipped:`,
      errors.join("; "),
      event
    );
    return false;
  }
  return true;
}

function validateProgram(program, index) {
  const errors = [];

  if (typeof program.programa !== "string" || program.programa.trim() === "") {
    errors.push("programa must be a non-empty string");
  }
  if (typeof program.anioInicio !== "number" || Number.isNaN(program.anioInicio)) {
    errors.push(`anioInicio must be a number (got: ${JSON.stringify(program.anioInicio)})`);
  }
  if (typeof program.entidad !== "string" || program.entidad.trim() === "") {
    errors.push("entidad must be a non-empty string");
  }
  if (typeof program.alcance !== "string" || program.alcance.trim() === "") {
    errors.push("alcance must be a non-empty string");
  }
  if (typeof program.citation !== "string" || program.citation.trim() === "") {
    errors.push("citation must be a non-empty string");
  }

  if (errors.length > 0) {
    console.warn(
      `[validator] programas_rurales.json: entry at index ${index} skipped:`,
      errors.join("; "),
      program
    );
    return false;
  }
  return true;
}

function validateStats(stats) {
  const errors = [];

  if (!Array.isArray(stats.comparacionRegional) || stats.comparacionRegional.length === 0) {
    errors.push("comparacionRegional must be a non-empty array");
  } else {
    stats.comparacionRegional.forEach((row, i) => {
      if (typeof row.region !== "string" || row.region.trim() === "") {
        errors.push(`comparacionRegional[${i}].region must be a non-empty string`);
      }
      if (typeof row.hogaresConInternet !== "number") {
        errors.push(`comparacionRegional[${i}].hogaresConInternet must be a number`);
      }
    });
  }

  if (errors.length > 0) {
    console.error("[validator] estadisticas_regionales.json is invalid:", errors);
    return false;
  }
  return true;
}

function filterValid(rawArray, validatorFn) {
  if (!Array.isArray(rawArray)) {
    console.error("[validator] expected an array but got:", rawArray);
    return [];
  }
  return rawArray.filter((entry, index) => validatorFn(entry, index));
}

export { validateEvent, validateProgram, validateStats, filterValid };