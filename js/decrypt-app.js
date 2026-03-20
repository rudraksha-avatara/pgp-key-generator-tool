import { copyText } from "./clipboard.js";
import { STATUS_TYPES } from "./config.js";
import { decryptPgpMessage } from "./decrypt.js";
import {
  clearFieldErrors,
  clearOutputs,
  getUiElements,
  readFormData,
  renderOutput,
  resetForm,
  setBusyState,
  setDecryptEnabled,
  setFieldErrors,
  setStatus
} from "./decrypt-ui.js";
import { showToast } from "./toast.js";
import { measureDuration } from "./utils.js";
import { validateDecryptForm } from "./decrypt-validators.js";

const state = {
  result: null,
  isBusy: false,
  requestId: 0,
  destroyed: false,
  browserSupported: false
};

function browserSupported() {
  return Boolean(
    window.crypto
    && window.crypto.subtle
    && window.openpgp
    && typeof window.openpgp.decrypt === "function"
  );
}

function clearDecryptedState() {
  state.requestId += 1;
  state.result = null;
  clearOutputs();
}

function focusFirstInvalidField(errors, ui) {
  const firstErrorField = Object.keys(errors)[0];

  if (!firstErrorField) {
    return;
  }

  const invalidInput = ui.form.querySelector(`[name="${firstErrorField}"]`);
  invalidInput?.focus();
}

function updateValidation(ui) {
  const validation = validateDecryptForm(readFormData(ui.form));
  setFieldErrors(validation.errors);
  setDecryptEnabled(state.browserSupported && !state.isBusy && validation.isValid);
  return validation;
}

async function handleDecrypt(event, ui) {
  event.preventDefault();

  if (state.isBusy) {
    return;
  }

  const validation = updateValidation(ui);

  if (!validation.isValid) {
    setStatus("Please correct the highlighted fields before decrypting the message.", STATUS_TYPES.error);
    showToast("Invalid input", "error");
    focusFirstInvalidField(validation.errors, ui);
    return;
  }

  state.isBusy = true;
  state.requestId += 1;
  const currentRequestId = state.requestId;
  setBusyState(true);
  clearDecryptedState();
  state.requestId = currentRequestId;
  setStatus("Decrypting your message locally in the browser. Nothing is sent to a server.", STATUS_TYPES.neutral);

  const startedAt = performance.now();

  try {
    const result = await decryptPgpMessage(validation.sanitized);

    if (state.destroyed || currentRequestId !== state.requestId) {
      return;
    }

    state.result = result;
    renderOutput(result);

    const duration = measureDuration(startedAt);
    const verificationMessage = result.verification === "Verified"
      ? " Signature verified."
      : result.verification === "Not verified"
        ? " Signature could not be verified."
        : result.verification === "No signature found"
          ? " No signature was found to verify."
          : " Verification was skipped.";

    setStatus(`Message decrypted successfully in ${duration}.${verificationMessage}`, STATUS_TYPES.success);

    if (result.verification === "Verified") {
      showToast("Decryption and verification succeeded", "success");
    } else if (result.verification === "Not verified" || result.verification === "No signature found") {
      showToast("Message decrypted, but verification did not succeed", "info");
    } else {
      showToast("Message decrypted successfully", "success");
    }
  } catch (error) {
    if (state.destroyed || currentRequestId !== state.requestId) {
      return;
    }

    clearDecryptedState();
    setStatus(error?.message || "Decryption failed. Please try again.", STATUS_TYPES.error);
    showToast(error?.message || "Decryption failed", "error");
  } finally {
    if (state.destroyed || currentRequestId !== state.requestId) {
      return;
    }

    state.isBusy = false;
    setBusyState(false);
    updateValidation(ui);
  }
}

async function handleCopyOutput() {
  if (!state.result?.decryptedMessage) {
    setStatus("Decrypt a message before copying the plaintext output.", STATUS_TYPES.error);
    return;
  }

  try {
    await copyText(state.result.decryptedMessage);
    setStatus("Decrypted message copied to the clipboard.", STATUS_TYPES.success);
    showToast("Decrypted message copied", "success");
  } catch (error) {
    setStatus(error?.message || "Clipboard copy failed.", STATUS_TYPES.error);
    showToast(error?.message || "Failed to copy output", "error");
  }
}

function bindEvents(ui) {
  ui.form.addEventListener("submit", (event) => {
    handleDecrypt(event, ui);
  });

  ui.form.addEventListener("input", () => {
    updateValidation(ui);
  });

  ui.clearFormButton.addEventListener("click", () => {
    resetForm(ui.form);
    clearDecryptedState();
    setStatus("Form cleared. Paste a new encrypted message, private key, and passphrase to continue.", STATUS_TYPES.neutral);
    showToast("Form cleared", "info");
    updateValidation(ui);
  });

  ui.resetOutputButton.addEventListener("click", () => {
    clearDecryptedState();
    setStatus("Output reset.", STATUS_TYPES.neutral);
    showToast("Output reset", "info");
    updateValidation(ui);
  });

  ui.copyOutputButton.addEventListener("click", () => {
    handleCopyOutput();
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
    state.browserSupported = browserSupported();

    clearFieldErrors();
    clearOutputs();
    setBusyState(false);

    if (!state.browserSupported) {
      setStatus("This browser does not support the required cryptography features for local decryption.", STATUS_TYPES.error);
      setDecryptEnabled(false);
      return;
    }

    setStatus("Ready to decrypt an armored PGP message locally in your browser.", STATUS_TYPES.neutral);
    bindEvents(ui);
    updateValidation(ui);

    window.addEventListener("beforeunload", () => {
      state.destroyed = true;
      state.requestId += 1;
    }, { once: true });
  } catch (error) {
    try {
      setStatus(error?.message || "The decrypt tool failed to initialize correctly.", STATUS_TYPES.error);
    } catch {
      // Ignore cascading UI failures during initialization.
    }
  }
}

init();
