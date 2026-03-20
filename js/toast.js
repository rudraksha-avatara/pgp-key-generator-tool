const TOAST_LIMIT = 3;
const TOAST_DURATION = 2800;
const TOAST_EXIT_DELAY = 220;

let activeToasts = [];
let queuedToasts = [];

function getToastContainer() {
  return document.getElementById("toast-container");
}

export function createToastElement(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-atomic", "true");
  toast.textContent = message;
  return toast;
}

export function removeToast(toast) {
  if (!toast) {
    return;
  }

  const activeEntry = activeToasts.find((entry) => entry.element === toast);

  if (!activeEntry || toast.dataset.removing === "true") {
    return;
  }

  toast.dataset.removing = "true";
  window.clearTimeout(activeEntry.timeoutId);

  const finalizeRemoval = () => {
    toast.remove();
    activeToasts = activeToasts.filter((entry) => entry.element !== toast);

    if (queuedToasts.length > 0) {
      const nextToast = queuedToasts.shift();
      showToast(nextToast.message, nextToast.type);
    }
  };

  toast.classList.remove("is-visible");
  toast.classList.add("is-leaving");
  window.setTimeout(finalizeRemoval, TOAST_EXIT_DELAY);
}

export function showToast(message, type = "info") {
  const container = getToastContainer();

  if (!container || !message) {
    return;
  }

  const normalizedType = ["success", "error", "info"].includes(type) ? type : "info";

  if (activeToasts.length >= TOAST_LIMIT) {
    queuedToasts = queuedToasts.slice(-1);
    queuedToasts.push({ message, type: normalizedType });
    removeToast(activeToasts[0]?.element);
    return;
  }

  const toast = createToastElement(message, normalizedType);
  container.appendChild(toast);

  const timeoutId = window.setTimeout(() => {
    removeToast(toast);
  }, TOAST_DURATION);

  activeToasts.push({ element: toast, timeoutId });

  window.requestAnimationFrame(() => {
    toast.classList.add("is-visible");
  });

  toast.addEventListener("click", () => {
    window.clearTimeout(timeoutId);
    removeToast(toast);
  }, { once: true });
}
