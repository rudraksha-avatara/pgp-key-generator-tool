function normalizeMultilineText(value) {
  return String(value ?? "").replace(/\r\n?/g, "\n");
}

function hasVisibleContent(value) {
  return normalizeMultilineText(value).trim().length > 0;
}

function normalizeArmoredBlock(value) {
  return normalizeMultilineText(value).trim();
}

export function validateDecryptForm(formData) {
  const encryptedMessage = normalizeArmoredBlock(formData.encryptedMessage);
  const privateKey = normalizeArmoredBlock(formData.privateKey);
  const senderPublicKey = normalizeArmoredBlock(formData.senderPublicKey);
  const passphrase = String(formData.passphrase ?? "");
  const errors = {};

  if (!hasVisibleContent(encryptedMessage)) {
    errors.encryptedMessage = "Encrypted message is required.";
  } else if (!/-----BEGIN PGP MESSAGE-----/i.test(encryptedMessage)) {
    errors.encryptedMessage = "Paste an armored PGP message that begins with -----BEGIN PGP MESSAGE-----.";
  }

  if (!hasVisibleContent(privateKey)) {
    errors.privateKey = "Private key is required.";
  } else if (!/-----BEGIN PGP PRIVATE KEY BLOCK-----/i.test(privateKey)) {
    errors.privateKey = "Paste an armored private key block that begins with -----BEGIN PGP PRIVATE KEY BLOCK-----.";
  }

  if (!hasVisibleContent(passphrase)) {
    errors.passphrase = "Passphrase is required.";
  }

  if (formData.verifySignature) {
    if (!hasVisibleContent(senderPublicKey)) {
      errors.senderPublicKey = "Sender public key is required when signature verification is enabled.";
    } else if (!/-----BEGIN PGP PUBLIC KEY BLOCK-----/i.test(senderPublicKey)) {
      errors.senderPublicKey = "Paste an armored public key block that begins with -----BEGIN PGP PUBLIC KEY BLOCK-----.";
    }
  } else if (senderPublicKey && !/-----BEGIN PGP PUBLIC KEY BLOCK-----/i.test(senderPublicKey)) {
    errors.senderPublicKey = "Sender public key must be an armored PGP public key block.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      encryptedMessage,
      privateKey,
      passphrase,
      senderPublicKey,
      verifySignature: Boolean(formData.verifySignature)
    }
  };
}
