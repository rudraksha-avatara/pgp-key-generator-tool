import { formatDateTime } from "./utils.js";

function getOpenPgp() {
  if (!window.openpgp || typeof window.openpgp.decrypt !== "function") {
    throw new Error("OpenPGP.js is not available in this browser context.");
  }

  return window.openpgp;
}

function mapPrivateKeyError(error) {
  const message = String(error?.message || "").toLowerCase();

  if (message.includes("passphrase")) {
    return new Error("The private key passphrase is incorrect.");
  }

  return new Error("The private key could not be unlocked. Check the private key and passphrase.");
}

function mapDecryptError(error) {
  const message = String(error?.message || "").toLowerCase();

  if (message.includes("session key") || message.includes("private key") || message.includes("secret key")) {
    return new Error("The private key could not decrypt this message. Check that the message matches the private key.");
  }

  if (message.includes("ascii armor") || message.includes("armored") || message.includes("malformed")) {
    return new Error("The encrypted message appears malformed. Check that the armored block is complete.");
  }

  return new Error("The message could not be decrypted. Check the encrypted message, private key, and passphrase.");
}

async function readEncryptedMessage(armoredMessage) {
  try {
    return await getOpenPgp().readMessage({ armoredMessage });
  } catch {
    throw new Error("The encrypted message is not a valid armored PGP message.");
  }
}

async function readPrivateKey(armoredKey) {
  try {
    return await getOpenPgp().readPrivateKey({ armoredKey });
  } catch {
    throw new Error("The private key is not a valid armored PGP private key.");
  }
}

async function readSenderPublicKey(armoredKey) {
  try {
    return await getOpenPgp().readKey({ armoredKey });
  } catch {
    throw new Error("The sender public key is not a valid armored PGP public key.");
  }
}

async function resolveVerificationStatus(signatures) {
  if (!Array.isArray(signatures) || signatures.length === 0) {
    return "No signature found";
  }

  const results = await Promise.all(signatures.map(async (signature) => {
    try {
      await signature.verified;
      return true;
    } catch {
      return false;
    }
  }));

  return results.every(Boolean) ? "Verified" : "Not verified";
}

export async function decryptPgpMessage(formData) {
  const openpgp = getOpenPgp();
  const processedAt = new Date();
  const message = await readEncryptedMessage(formData.encryptedMessage);
  const privateKey = await readPrivateKey(formData.privateKey);

  let decryptionKey;

  try {
    // Sensitive key material and passphrases remain in memory only for the
    // current operation and are never persisted, logged, or transmitted.
    decryptionKey = await openpgp.decryptKey({
      privateKey,
      passphrase: formData.passphrase
    });
  } catch (error) {
    throw mapPrivateKeyError(error);
  }

  const options = {
    message,
    decryptionKeys: decryptionKey,
    format: "utf8"
  };

  if (formData.verifySignature && formData.senderPublicKey) {
    options.verificationKeys = await readSenderPublicKey(formData.senderPublicKey);
  }

  let result;

  try {
    result = await openpgp.decrypt(options);
  } catch (error) {
    throw mapDecryptError(error);
  }

  const decryptedMessage = typeof result?.data === "string" ? result.data : "";
  const verification = options.verificationKeys
    ? await resolveVerificationStatus(result?.signatures)
    : "Verification skipped";

  return {
    decryptedMessage,
    verification,
    metadata: {
      decryption: decryptedMessage ? "Success" : "No plaintext returned",
      verification,
      messageFormat: "ASCII armored PGP message",
      action: options.verificationKeys ? "Decrypted and checked signature" : "Decrypted locally",
      length: `${decryptedMessage.length} characters`,
      processed: formatDateTime(processedAt)
    }
  };
}
