export function sanitizePlainText(value) {
  return String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatDate(dateInput) {
  if (!dateInput) {
    return "Never";
  }

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }).format(date);
}

export function formatDateTime(dateInput) {
  if (!dateInput) {
    return "-";
  }

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function addDays(date, days) {
  if (!days) {
    return null;
  }

  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export function escapeFilenameSegment(value) {
  const clean = sanitizePlainText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return clean || "key";
}

export function bytesToBase64(uint8Array) {
  let binary = "";

  for (const byte of uint8Array) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

export function serializeMetadataText(metadata) {
  return [
    `Name: ${metadata.name}`,
    `Email: ${metadata.email}`,
    `Comment: ${metadata.comment || "-"}`,
    `Algorithm: ${metadata.algorithm}`,
    `Key Type: ${metadata.keyType}`,
    `Created: ${metadata.created}`,
    `Expires: ${metadata.expires}`,
    `Fingerprint: ${metadata.fingerprint}`,
    `Output Format: ${metadata.outputFormat}`,
    `Generated Locally: Yes`
  ].join("\n");
}

export function measureDuration(startTime) {
  const duration = performance.now() - startTime;
  return `${(duration / 1000).toFixed(2)}s`;
}
