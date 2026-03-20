export const APP_NAME = "PGP Key Generator Tool";

export const PASSPHRASE_MIN_LENGTH = 12;

export const ALGORITHM_OPTIONS = {
  ecc: {
    id: "ecc",
    label: "ECC (Curve25519)",
    type: "ecc",
    curve: "curve25519",
    summary: "ECC Curve25519"
  },
  rsa: {
    id: "rsa",
    label: "RSA 4096",
    type: "rsa",
    rsaBits: 4096,
    summary: "RSA 4096"
  }
};

export const EXPIRATION_OPTIONS = {
  none: { label: "No expiration", days: null },
  "365": { label: "1 year", days: 365 },
  "730": { label: "2 years", days: 730 },
  custom: { label: "Custom days", days: null }
};

export const FILE_NAMES = {
  publicArmored: "public-key.asc",
  privateArmored: "private-key.asc",
  publicBinary: "public-key.pgp",
  privateBinary: "private-key.pgp",
  metadataJson: "pgp-key-metadata.json",
  metadataTxt: "pgp-key-metadata.txt"
};

export const STATUS_TYPES = {
  neutral: "neutral",
  error: "error",
  success: "success"
};

export const BROWSER_SUPPORT = {
  requiresCrypto: true,
  requiresOpenPgp: true
};
