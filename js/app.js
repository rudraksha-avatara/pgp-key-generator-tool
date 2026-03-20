import { STATUS_TYPES } from "./config.js";
import { copyText } from "./clipboard.js";
import { downloadKey, downloadMetadataJson, downloadMetadataText } from "./download.js";
import { generatePgpKeyPair } from "./keygen.js";
import { showToast } from "./toast.js";
import {
  clearFieldErrors,
  clearOutputs,
  getUiElements,
  readFormData,
  renderOutput,
  resetForm,
  setBusyState,
  setFieldErrors,
  setPassphraseStrength,
  setStatus,
  toggleCustomDays
} from "./ui.js";
import { measureDuration } from "./utils.js";
import { getPassphraseStrength, validateForm } from "./validators.js";

const state = {
  result: null,
  isBusy: false,
  generationId: 0,
  destroyed: false
};

function browserSupported() {
  return Boolean(window.crypto && window.crypto.subtle && window.openpgp);
}

function updateValidation(ui) {
  const formData = readFormData(ui.form);
  const validation = validateForm(formData);
  setFieldErrors(validation.errors);
  setPassphraseStrength(validation.strength);
  toggleCustomDays(formData.expiration === "custom");
  return validation;
}

function clearGeneratedState() {
  state.generationId += 1;
  state.result = null;
  clearOutputs();
}

async function handleGenerate(event, ui) {
  event.preventDefault();

  if (state.isBusy) {
    return;
  }

  const validation = updateValidation(ui);

  if (!validation.isValid) {
    setStatus("Please correct the highlighted fields before generating keys.", STATUS_TYPES.error);
    showToast("Invalid input", "error");
    const firstErrorField = Object.keys(validation.errors)[0];
    if (firstErrorField) {
      const invalidInput = ui.form.querySelector(`[name="${firstErrorField}"]`);
      invalidInput?.focus();
    }
    return;
  }

  state.isBusy = true;
  state.generationId += 1;
  const currentGenerationId = state.generationId;
  setBusyState(true);
  clearGeneratedState();
  state.generationId = currentGenerationId;
  setStatus("Generating key pair locally in your browser. This can take a moment.", STATUS_TYPES.neutral);

  const startedAt = performance.now();

  try {
    const result = await generatePgpKeyPair(validation.sanitized);

    if (state.destroyed || currentGenerationId !== state.generationId) {
      return;
    }

    state.result = result;
    renderOutput(result);
    const duration = measureDuration(startedAt);
    setStatus(`Key pair generated successfully in ${duration}. Store the private key securely.`, STATUS_TYPES.success);
    showToast("Keys generated successfully", "success");
  } catch (error) {
    if (state.destroyed || currentGenerationId !== state.generationId) {
      return;
    }

    clearGeneratedState();
    setStatus(error?.message || "Key generation failed. Please try again.", STATUS_TYPES.error);
    showToast(error?.message || "Key generation failed", "error");
  } finally {
    if (state.destroyed || currentGenerationId !== state.generationId) {
      return;
    }

    state.isBusy = false;
    setBusyState(false);
  }
}

async function handleCopy(kind) {
  if (!state.result) {
    setStatus("Generate keys before copying output.", STATUS_TYPES.error);
    return;
  }

  const value = kind === "public" ? state.result.displayPublicKey : state.result.displayPrivateKey;

  try {
    await copyText(value);
    setStatus(`${kind === "public" ? "Public" : "Private"} key copied to clipboard.`, STATUS_TYPES.success);
    showToast("Copied to clipboard", "success");
  } catch (error) {
    setStatus(error?.message || "Clipboard copy failed.", STATUS_TYPES.error);
    showToast(error?.message || "Failed to copy", "error");
  }
}

function handleDownload(kind) {
  if (!state.result) {
    setStatus("Generate keys before downloading output.", STATUS_TYPES.error);
    return;
  }

  try {
    if (kind === "public" || kind === "private") {
      const content = kind === "public" ? state.result.publicKey : state.result.privateKey;
      const armoredOutput = state.result.metadata.outputFormat === "ASCII armored";
      downloadKey(content, kind, armoredOutput);
      setStatus(`${kind === "public" ? "Public" : "Private"} key downloaded.`, STATUS_TYPES.success);
      return;
    }

    if (kind === "metadata-json") {
      downloadMetadataJson(state.result.metadata);
      setStatus("Metadata JSON downloaded.", STATUS_TYPES.success);
      return;
    }

    downloadMetadataText(state.result.metadata);
    setStatus("Metadata text file downloaded.", STATUS_TYPES.success);
  } catch (error) {
    setStatus(error?.message || "Download failed.", STATUS_TYPES.error);
  }
}

function confirmClear(message) {
  return window.confirm(message);
}

function bindEvents(ui) {
  const handleSubmit = (event) => {
    handleGenerate(event, ui);
  };

  const handleInput = () => {
    updateValidation(ui);
  };

  const handleExpirationChange = () => {
    updateValidation(ui);
  };

  const handleClearForm = () => {
    resetForm(ui.form);
    setPassphraseStrength(getPassphraseStrength(""));
    setStatus("Form cleared.", STATUS_TYPES.neutral);
    showToast("Form cleared", "info");
  };

  const handleResetOutput = () => {
    clearGeneratedState();
    setStatus("Output reset.", STATUS_TYPES.neutral);
    showToast("Output reset", "info");
  };

  const handleClearGenerated = () => {
    if (!state.result) {
      setStatus("There are no generated keys to clear.", STATUS_TYPES.neutral);
      return;
    }

    if (!confirmClear("Clear the generated keys from the page? Make sure you have copied or downloaded them first.")) {
      return;
    }

    clearGeneratedState();
    setStatus("Generated keys cleared from the page.", STATUS_TYPES.neutral);
  };

  ui.form.addEventListener("submit", handleSubmit);
  ui.form.addEventListener("input", handleInput);
  ui.form.expiration.addEventListener("change", handleExpirationChange);
  ui.clearFormButton.addEventListener("click", handleClearForm);
  ui.resetOutputButton.addEventListener("click", handleResetOutput);
  ui.clearGeneratedKeysButton.addEventListener("click", handleClearGenerated);

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", () => {
      handleCopy(button.dataset.copy);
    });
  });

  document.querySelectorAll("[data-download]").forEach((button) => {
    button.addEventListener("click", () => {
      handleDownload(button.dataset.download);
    });
  });

  document.querySelectorAll("[data-toggle-password]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.togglePassword);
      const nextType = input.type === "password" ? "text" : "password";
      input.type = nextType;
      button.textContent = nextType === "password" ? "Show" : "Hide";
      button.setAttribute("aria-pressed", String(nextType === "text"));
    });
  });
}

function init() {
  try {
    const ui = getUiElements();

    if (!browserSupported()) {
      setStatus("This browser does not support the required cryptography features for local key generation.", STATUS_TYPES.error);
      ui.generateButton.disabled = true;
      return;
    }

    clearFieldErrors();
    clearOutputs();
    setPassphraseStrength(getPassphraseStrength(""));
    setBusyState(false);
    setStatus("Ready to generate a key pair locally in your browser.", STATUS_TYPES.neutral);
    bindEvents(ui);

    window.addEventListener("beforeunload", () => {
      state.destroyed = true;
      state.generationId += 1;
    }, { once: true });
  } catch (error) {
    try {
      setStatus(error?.message || "The application failed to initialize correctly.", STATUS_TYPES.error);
    } catch {
      // Ignore cascading UI failures during initialization.
    }
  }
}

init();
