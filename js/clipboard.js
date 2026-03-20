export async function copyText(text) {
  if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") {
    throw new Error("Clipboard access is not available in this browser.");
  }

  await navigator.clipboard.writeText(text);
}
