import { STATUS_TYPES } from "./config.js";

const FIELD_IDS = ["encryptedMessage", "privateKey", "passphrase", "senderPublicKey"];

const FIELD_DOM = {
  encryptedMessage: { input: "encrypted-message", error: "encrypted-message-error" },
  privateKey: { input: "private-key", error: "private-key-error" },
  passphrase: { input: "passphrase", error: "passphrase-error" },
  senderPublicKey: { input: "sender-public-key", error: "sender-public-key-error" }
};

function getById(id) {
  return document.getElementById(id);
}

function getRequiredElement(id) {
  const element = getById(id);

  if (!element) {
    throw new Error(`Required UI element not found: ${id}`);
  }

  return element;
}

export function getUiElements() {
  return {
    form: getRequiredElement("decrypt-form"),
    statusRegion: getRequiredElement("status-region"),
    decryptButton: getRequiredElement("decrypt-button"),
    clearFormButton: getRequiredElement("clear-form-button"),
    resetOutputButton: getRequiredElement("reset-output-button"),
    copyOutputButton: getRequiredElement("copy-output-button"),
    outputs: {
      decryptedMessage: getRequiredElement("decrypted-message-output")
    },
    metadata: {
      decryption: getRequiredElement("meta-decryption"),
      verification: getRequiredElement("meta-verification"),
      messageFormat: getRequiredElement("meta-message-format"),
      action: getRequiredElement("meta-action"),
      length: getRequiredElement("meta-length"),
      processed: getRequiredElement("meta-processed")
    }
  };
}

export function readFormData(form) {
  const formData = new FormData(form);

  return {
    encryptedMessage: formData.get("encryptedMessage") || "",
    privateKey: formData.get("privateKey") || "",
    passphrase: formData.get("passphrase") || "",
    senderPublicKey: formData.get("senderPublicKey") || "",
    verifySignature: formData.get("verifySignature") === "on"
  };
}

export function setStatus(message, type = STATUS_TYPES.neutral) {
  const region = getRequiredElement("status-region");
  region.innerHTML = "";
  region.setAttribute("role", type === STATUS_TYPES.error ? "alert" : "status");
  region.setAttribute("aria-live", type === STATUS_TYPES.error ? "assertive" : "polite");

  if (!message) {
    return;
  }

  const box = document.createElement("div");
  box.className = `status-message is-${type}`;
  box.textContent = message;
  region.appendChild(box);
}

export function setFieldErrors(errors = {}) {
  for (const fieldId of FIELD_IDS) {
    const mapping = FIELD_DOM[fieldId];
    const input = getRequiredElement(mapping.input);
    const error = getRequiredElement(mapping.error);
    const message = errors[fieldId] || "";
    error.textContent = message;
    input.classList.toggle("input-error", Boolean(message));
    input.setAttribute("aria-invalid", String(Boolean(message)));
  }
}

export function clearFieldErrors() {
  setFieldErrors({});
}

export function setBusyState(isBusy) {
  const form = getRequiredElement("decrypt-form");
  const controls = form.querySelectorAll("input, textarea, button");
  const copyOutputButton = getRequiredElement("copy-output-button");
  const decryptButton = getRequiredElement("decrypt-button");

  for (const control of controls) {
    control.disabled = isBusy;
  }

  copyOutputButton.disabled = isBusy || !getRequiredElement("decrypted-message-output").value;
  decryptButton.textContent = isBusy ? "Decrypting..." : "Decrypt Message";
}

export function setDecryptEnabled(isEnabled) {
  const button = getRequiredElement("decrypt-button");

  if (button.textContent !== "Decrypting...") {
    button.disabled = !isEnabled;
  }
}

export function renderOutput(result) {
  getRequiredElement("decrypted-message-output").value = result.decryptedMessage || "";
  getRequiredElement("copy-output-button").disabled = !result.decryptedMessage;

  getRequiredElement("meta-decryption").textContent = result.metadata.decryption || "-";
  getRequiredElement("meta-verification").textContent = result.metadata.verification || "-";
  getRequiredElement("meta-message-format").textContent = result.metadata.messageFormat || "-";
  getRequiredElement("meta-action").textContent = result.metadata.action || "-";
  getRequiredElement("meta-length").textContent = result.metadata.length || "-";
  getRequiredElement("meta-processed").textContent = result.metadata.processed || "-";
}

export function clearOutputs() {
  getRequiredElement("decrypted-message-output").value = "";
  getRequiredElement("copy-output-button").disabled = true;

  getRequiredElement("meta-decryption").textContent = "-";
  getRequiredElement("meta-verification").textContent = "-";
  getRequiredElement("meta-message-format").textContent = "-";
  getRequiredElement("meta-action").textContent = "-";
  getRequiredElement("meta-length").textContent = "-";
  getRequiredElement("meta-processed").textContent = "-";
}

export function resetForm(form) {
  form.reset();
  clearFieldErrors();
}
