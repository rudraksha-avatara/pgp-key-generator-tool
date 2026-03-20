import { STATUS_TYPES } from "./config.js";

const FIELD_IDS = [
  "fullName",
  "email",
  "comment",
  "passphrase",
  "confirmPassphrase",
  "customDays"
];

const FIELD_DOM = {
  fullName: { input: "full-name", error: "full-name-error" },
  email: { input: "email", error: "email-error" },
  comment: { input: "comment", error: "comment-error" },
  passphrase: { input: "passphrase", error: "passphrase-error" },
  confirmPassphrase: { input: "confirm-passphrase", error: "confirm-passphrase-error" },
  customDays: { input: "custom-days", error: "custom-days-error" }
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
    form: getRequiredElement("keygen-form"),
    statusRegion: getRequiredElement("status-region"),
    generateButton: getRequiredElement("generate-button"),
    clearFormButton: getRequiredElement("clear-form-button"),
    resetOutputButton: getRequiredElement("reset-output-button"),
    clearGeneratedKeysButton: getRequiredElement("clear-generated-keys-button"),
    customDaysGroup: getRequiredElement("custom-days-group"),
    passphraseStrength: getRequiredElement("passphrase-strength"),
    passphraseCriteria: getRequiredElement("passphrase-criteria"),
    outputs: {
      fingerprint: getRequiredElement("fingerprint-output"),
      publicKey: getRequiredElement("public-key-output"),
      privateKey: getRequiredElement("private-key-output")
    },
    metadata: {
      name: getRequiredElement("meta-name"),
      email: getRequiredElement("meta-email"),
      algorithm: getRequiredElement("meta-algorithm"),
      keyType: getRequiredElement("meta-key-type"),
      created: getRequiredElement("meta-created"),
      expires: getRequiredElement("meta-expires")
    }
  };
}

export function readFormData(form) {
  const formData = new FormData(form);

  return {
    fullName: formData.get("fullName") || "",
    email: formData.get("email") || "",
    comment: formData.get("comment") || "",
    passphrase: formData.get("passphrase") || "",
    confirmPassphrase: formData.get("confirmPassphrase") || "",
    algorithm: formData.get("algorithm") || "ecc",
    expiration: formData.get("expiration") || "none",
    customDays: formData.get("customDays") || "",
    armoredOutput: formData.get("armoredOutput") === "on"
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

export function setPassphraseStrength(strength) {
  const pill = getRequiredElement("passphrase-strength");
  const criteria = getRequiredElement("passphrase-criteria");
  pill.className = `strength-pill strength-pill-${strength.tone}`;
  pill.textContent = strength.label;

  const checklist = [];
  if (!strength.checks.minLength) checklist.push("12+ characters");
  if (!strength.checks.lowercase) checklist.push("lowercase");
  if (!strength.checks.uppercase) checklist.push("uppercase");
  if (!strength.checks.number) checklist.push("number");
  if (!strength.checks.special) checklist.push("special character");

  criteria.textContent = checklist.length > 0
    ? `Missing: ${checklist.join(", ")}.`
    : "Passphrase meets all requirements.";
}

export function toggleCustomDays(shouldShow) {
  getRequiredElement("custom-days-group").classList.toggle("hidden", !shouldShow);
}

export function setBusyState(isBusy) {
  const form = getRequiredElement("keygen-form");
  const generateButton = getRequiredElement("generate-button");
  const outputButtons = document.querySelectorAll("[data-copy], [data-download], #clear-generated-keys-button");
  const controls = form.querySelectorAll("input, select, button, textarea");

  for (const control of controls) {
    control.disabled = isBusy;
  }

  for (const button of outputButtons) {
    button.disabled = isBusy;
  }

  generateButton.disabled = isBusy;
  generateButton.textContent = isBusy ? "Generating..." : "Generate Key Pair";
}

export function renderOutput(result) {
  getRequiredElement("fingerprint-output").value = result.fingerprint || "";
  getRequiredElement("public-key-output").value = result.displayPublicKey || "";
  getRequiredElement("private-key-output").value = result.displayPrivateKey || "";

  getRequiredElement("meta-name").textContent = result.metadata.name || "-";
  getRequiredElement("meta-email").textContent = result.metadata.email || "-";
  getRequiredElement("meta-algorithm").textContent = result.metadata.algorithm || "-";
  getRequiredElement("meta-key-type").textContent = result.metadata.keyType || "-";
  getRequiredElement("meta-created").textContent = result.metadata.created || "-";
  getRequiredElement("meta-expires").textContent = result.metadata.expires || "-";
}

export function clearOutputs() {
  getRequiredElement("fingerprint-output").value = "";
  getRequiredElement("public-key-output").value = "";
  getRequiredElement("private-key-output").value = "";

  getRequiredElement("meta-name").textContent = "-";
  getRequiredElement("meta-email").textContent = "-";
  getRequiredElement("meta-algorithm").textContent = "-";
  getRequiredElement("meta-key-type").textContent = "-";
  getRequiredElement("meta-created").textContent = "-";
  getRequiredElement("meta-expires").textContent = "-";
}

export function resetForm(form) {
  form.reset();
  clearFieldErrors();
  toggleCustomDays(false);
}
