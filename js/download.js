import { FILE_NAMES } from "./config.js";
import { serializeMetadataText } from "./utils.js";

function triggerDownload(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = "noopener";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);
}

export function downloadKey(content, kind, armoredOutput) {
  if (!content) {
    throw new Error("Nothing to download yet.");
  }

  const fileName = armoredOutput
    ? (kind === "public" ? FILE_NAMES.publicArmored : FILE_NAMES.privateArmored)
    : (kind === "public" ? FILE_NAMES.publicBinary : FILE_NAMES.privateBinary);

  const blob = armoredOutput
    ? new Blob([content], { type: "application/pgp-keys" })
    : new Blob([content], { type: "application/octet-stream" });

  triggerDownload(blob, fileName);
}

export function downloadMetadataJson(metadata) {
  const blob = new Blob([JSON.stringify(metadata, null, 2)], {
    type: "application/json"
  });
  triggerDownload(blob, FILE_NAMES.metadataJson);
}

export function downloadMetadataText(metadata) {
  const blob = new Blob([serializeMetadataText(metadata)], {
    type: "text/plain;charset=utf-8"
  });
  triggerDownload(blob, FILE_NAMES.metadataTxt);
}
