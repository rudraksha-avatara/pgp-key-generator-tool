import { ALGORITHM_OPTIONS, EXPIRATION_OPTIONS } from "./config.js";
import { addDays, bytesToBase64, formatDate } from "./utils.js";

function getOpenPgp() {
  if (!window.openpgp || typeof window.openpgp.generateKey !== "function") {
    throw new Error("OpenPGP.js is not available in this browser context.");
  }

  return window.openpgp;
}

function getExpirationDays(expiration, customDays) {
  if (expiration === "custom") {
    return Number(customDays);
  }

  return EXPIRATION_OPTIONS[expiration]?.days ?? null;
}

function getUserId({ fullName, email, comment }) {
  return {
    name: fullName,
    email,
    ...(comment ? { comment } : {})
  };
}

function getGenerationOptions(formData) {
  const algorithm = ALGORITHM_OPTIONS[formData.algorithm] || ALGORITHM_OPTIONS.ecc;
  const expirationDays = getExpirationDays(formData.expiration, formData.customDays);

  if (!formData?.fullName || !formData?.email || !formData?.passphrase) {
    throw new Error("Required key generation data is missing.");
  }

  return {
    type: algorithm.type,
    curve: algorithm.curve,
    rsaBits: algorithm.rsaBits,
    userIDs: [getUserId(formData)],
    passphrase: formData.passphrase,
    format: formData.armoredOutput ? "armored" : "binary",
    ...(expirationDays ? { keyExpirationTime: expirationDays * 24 * 60 * 60 } : {})
  };
}

async function getFingerprint(publicKey, armoredOutput) {
  const openpgp = getOpenPgp();
  const key = armoredOutput
    ? await openpgp.readKey({ armoredKey: publicKey })
    : await openpgp.readKey({ binaryKey: publicKey });

  return key.getFingerprint().toUpperCase();
}

export async function generatePgpKeyPair(formData) {
  const openpgp = getOpenPgp();
  const createdAt = new Date();
  const options = getGenerationOptions(formData);

  // Sensitive key material stays in local variables and is never logged,
  // persisted, or sent to a remote endpoint by this application.
  const result = await openpgp.generateKey(options);

  const publicKey = result?.publicKey;
  const privateKey = result?.privateKey;

  if (!publicKey || !privateKey) {
    throw new Error("Key generation completed without usable key output.");
  }

  const fingerprint = await getFingerprint(publicKey, formData.armoredOutput);
  const algorithm = ALGORITHM_OPTIONS[formData.algorithm] || ALGORITHM_OPTIONS.ecc;
  const expirationDays = getExpirationDays(formData.expiration, formData.customDays);
  const expiresAt = expirationDays ? addDays(createdAt, expirationDays) : null;
  const outputFormat = formData.armoredOutput ? "ASCII armored" : "Binary (Base64 displayed)";

  return {
    publicKey,
    privateKey,
    displayPublicKey: formData.armoredOutput ? publicKey : bytesToBase64(publicKey),
    displayPrivateKey: formData.armoredOutput ? privateKey : bytesToBase64(privateKey),
    fingerprint,
    metadata: {
      name: formData.fullName,
      email: formData.email,
      comment: formData.comment,
      algorithm: algorithm.summary,
      keyType: "Primary key with encryption-capable subkey",
      created: formatDate(createdAt),
      expires: expiresAt ? formatDate(expiresAt) : "Never",
      fingerprint,
      outputFormat
    }
  };
}
