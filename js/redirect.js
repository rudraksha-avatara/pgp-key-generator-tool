(() => {
  try {
    const { pathname, search, hash } = window.location;
    const suffix = "/index.html";

    if (!pathname || !pathname.toLowerCase().endsWith(suffix)) {
      return;
    }

    const normalizedPath = `${pathname.slice(0, -"index.html".length) || "/"}`;
    const targetUrl = `${normalizedPath}${search}${hash}`;
    const currentUrl = `${pathname}${search}${hash}`;

    if (targetUrl !== currentUrl) {
      window.location.replace(targetUrl);
    }
  } catch {
    // Ignore redirect failures and allow the page to continue loading.
  }
})();
