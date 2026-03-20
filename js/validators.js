import { PASSPHRASE_MIN_LENGTH, EXPIRATION_OPTIONS } from "./config.js";
import { sanitizePlainText } from "./utils.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function getPassphraseChecks(passphrase) {
  return {
    minLength: passphrase.length >= PASSPHRASE_MIN_LENGTH,
    lowercase: /[a-z]/.test(passphrase),
    uppercase: /[A-Z]/.test(passphrase),
    number: /\d/.test(passphrase),
    special: /[^A-Za-z0-9]/.test(passphrase)
  };
}

export function getPassphraseStrength(passphrase) {
  if (!passphrase) {
    return {
      score: 0,
      label: "Enter a passphrase",
      tone: "neutral",
      checks: getPassphraseChecks(passphrase)
    };
  }

  const checks = getPassphraseChecks(passphrase);
  const score = Object.values(checks).filter(Boolean).length;

  if (score <= 2) {
    return { score, label: "Weak", tone: "weak", checks };
  }

  if (score <= 4) {
    return { score, label: "Medium", tone: "medium", checks };
  }

  return { score, label: "Strong", tone: "strong", checks };
}

export function validateForm(formData) {
  const name = sanitizePlainText(formData.fullName);
  const email = sanitizePlainText(formData.email);
  const comment = sanitizePlainText(formData.comment);
  const passphrase = String(formData.passphrase || "");
  const confirmPassphrase = String(formData.confirmPassphrase || "");
  const expirationValue = String(formData.expiration || "none");
  const customDays = String(formData.customDays || "").trim();
  const errors = {};

  if (!name) {
    errors.fullName = "Full name is required.";
  }

  if (!email) {
    errors.email = "Email address is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  const strength = getPassphraseStrength(passphrase);
  const missingRules = Object.entries(strength.checks)
    .filter(([, passed]) => !passed)
    .map(([rule]) => rule);

  if (!passphrase) {
    errors.passphrase = "Passphrase is required.";
  } else if (missingRules.length > 0) {
    errors.passphrase = "Use at least 12 characters with uppercase, lowercase, number, and special characters.";
  }

  if (!confirmPassphrase) {
    errors.confirmPassphrase = "Please confirm the passphrase.";
  } else if (passphrase !== confirmPassphrase) {
    errors.confirmPassphrase = "Passphrases do not match.";
  }

  if (!(expirationValue in EXPIRATION_OPTIONS)) {
    errors.expiration = "Select a valid expiration option.";
  }

  if (expirationValue === "custom") {
    if (!customDays) {
      errors.customDays = "Enter the number of days.";
    } else {
      const parsedDays = Number(customDays);
      const isValid = Number.isInteger(parsedDays) && parsedDays >= 1 && parsedDays <= 3650;

      if (!isValid) {
        errors.customDays = "Enter a whole number between 1 and 3650.";
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      fullName: name,
      email,
      comment,
      passphrase,
      confirmPassphrase,
      algorithm: formData.algorithm,
      expiration: expirationValue,
      customDays,
      armoredOutput: Boolean(formData.armoredOutput)
    },
    strength
  };
}
