# PGP Key Generator Tool

Browser-based OpenPGP key generation utility that creates PGP public and private key pairs fully on the client side using OpenPGP.js. No backend is required, and private key material never leaves the browser unless the user explicitly copies or downloads it.

Repository Owner: `rudraksha-avatara`
Repository URL: https://github.com/rudraksha-avatara/pgp-key-generator-tool

## Features

- Generate OpenPGP key pairs locally in the browser
- Support secure modern ECC (`Curve25519`) and `RSA 4096`
- Strong passphrase validation with live strength feedback
- Optional key comment and flexible expiration settings
- Fingerprint and key metadata summary after generation
- Copy public or private keys to the clipboard
- Download generated keys and metadata locally
- Responsive, keyboard-accessible, plain minimal interface
- Dedicated `404.html` page for static deployments
- Minimal footer with open-source branding and privacy note
- SEO metadata, Open Graph tags, Twitter tags, and JSON-LD structured data
- `robots.txt` included for static site friendliness
- Clean URL normalization for `index.html` access with JS fallback redirect
- No analytics, no remote API calls, no automatic persistence

## Screenshots

Add repository screenshots here after publishing, for example:

- `docs/screenshots/desktop.png`
- `docs/screenshots/mobile.png`

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES modules)
- OpenPGP.js

## Project Structure

```text
pgp-key-generator-tool/
|- index.html
|- 404.html
|- README.md
|- LICENSE
|- .gitignore
|- _redirects
|- robots.txt
|- assets/
|  \- icons/
|     \- favicon.svg
|- css/
|  |- reset.css
|  \- style.css
|- js/
|  |- app.js
|  |- clipboard.js
|  |- config.js
|  |- download.js
|  |- keygen.js
|  |- redirect.js
|  |- ui.js
|  |- utils.js
|  \- validators.js
\- vendor/
   \- openpgp.min.js
```

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/rudraksha-avatara/pgp-key-generator-tool.git
   ```

2. Open the project folder:

   ```bash
   cd pgp-key-generator-tool
   ```

3. Serve the project with any static file server.

   Examples:

   ```bash
   python -m http.server 8080
   ```

   or

   ```bash
   npx serve .
   ```

## Local Usage

1. Start a local static server.
2. Open the app in a modern browser.
3. Enter a name, email address, and strong passphrase.
4. Choose an algorithm and expiration preference.
5. Generate keys locally in the browser.
6. Copy or download the generated key material and store it securely.

## Privacy-First Architecture

- The tool is client-side only and browser-only by design.
- Private keys are never sent to a server by the application.
- No backend dependency is required for generation, copy, or download flows.
- No `localStorage`, `sessionStorage`, analytics, or telemetry is used for sensitive key material.
- The intentionally plain interface is designed for usability, trust, and auditability.

## Security Notes

- All key generation happens locally in the browser.
- No server-side key generation is used.
- No private key data is sent to any remote endpoint by this project.
- No `localStorage` or `sessionStorage` persistence is used for private keys.
- Users are responsible for storing private keys and passphrases securely.
- If you disable armored output, binary key material is downloaded as raw data and shown as Base64 for safe display.

## Accessibility Features

- Semantic HTML5 structure with `header`, `main`, `section`, `form`, and `footer`
- Skip link support for keyboard and screen reader users
- Proper labels and `aria-describedby` connections for form fields
- Accessible live status messaging for generation, validation, copy, and download feedback
- Visible focus states for links, buttons, fields, and footer navigation
- Output textareas designed to remain readable and usable for very long PGP blocks
- Responsive layout built to avoid horizontal overflow on mobile devices

## SEO Features

- Unique page titles and descriptions for `index.html` and `404.html`
- Clean canonical URLs aligned to the preferred deployment URL
- Open Graph and Twitter metadata for link previews
- Basic JSON-LD structured data for the main web application
- Favicon reference and clean semantic content structure
- `robots.txt` included for static deployments
- Clean URL normalization so `/index.html` resolves to `/`

If you publish the project to a different production domain, update canonical URLs, social preview images, and add a `sitemap.xml` that matches your deployed paths.

## URL Normalization

The project prefers clean directory-style URLs and treats any `index.html` URL as a non-canonical duplicate.

Examples:

- `/index.html` -> `/`
- `/tools/index.html` -> `/tools/`
- `/demo/index.html?ref=test#top` -> `/demo/?ref=test#top`

Why this matters:

- Clean URLs are easier to read and share.
- Search engines should see only one canonical version of each page.
- Redirecting `index.html` avoids duplicate-content SEO issues.
- `window.location.replace(...)` prevents extra history entries during fallback redirects.

Implementation included in this project:

- `js/redirect.js` runs early in `index.html` as a client-side fallback.
- The fallback preserves query strings and hash fragments.
- `_redirects` is included for Netlify-style static hosting redirects.
- Canonical metadata points to the clean URL, not the `index.html` variant.

Recommended production setup:

- Prefer a server-side or CDN-level `301` redirect for any path ending in `index.html`.
- Keep the JavaScript redirect enabled as a static-hosting fallback.
- Preserve query strings and hash fragments where your platform supports them.
- Make sure sitemap entries and canonical URLs use only clean paths.

Hosting guidance:

- Netlify: use the included `_redirects` file.
- Vercel: add a redirect rule in `vercel.json` that rewrites any `index.html` suffix to its directory path.
- Cloudflare Pages: create a Redirect Rule matching `*index.html` and redirect to the same path without the suffix.
- Apache: add a rewrite rule in `.htaccess` that removes trailing `index.html` with a `301`.
- Nginx: add a rewrite rule such as `rewrite ^(.*/)index\.html$ $1 permanent;`.
- GitHub Pages: native redirect rules are limited, so the included JavaScript fallback is especially useful.

If you deploy on a custom domain, make sure the canonical URL remains clean, for example:

`https://pgp.itisuniqueofficial.com/`

and not:

`https://pgp.itisuniqueofficial.com/index.html`

## 404 Page Support

The repository includes a dedicated `404.html` page for static hosting platforms. It matches the main design language, includes a clear return-home action, and uses SEO-safe `noindex,follow` metadata.

## Footer Branding Note

Both `index.html` and `404.html` include a minimal footer with this branding line:

`Built with Open-Source Community • ITISUNIQUEOFFICIAL.com`

The external link opens in a new tab with `rel="noopener noreferrer"` and is styled to remain subtle, readable, and accessible.

## Open-Source Note

This project is intended as an open-source utility that can be reused, audited, and extended without backend lock-in or paid dependencies.

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Keep changes focused and documented.
4. Test manually in modern browsers.
5. Open a pull request with a clear description of the change.

Please avoid adding analytics, telemetry, or any feature that weakens the local-only security model without clear discussion.

This project is contribution-friendly and intentionally kept framework-free so it remains easy to audit, extend, and deploy on simple static hosting.

## License

This project is licensed under the MIT License. See `LICENSE` for details.

## Disclaimer

This tool is provided as an open-source utility for generating OpenPGP keys in the browser. It does not replace a full security review, threat-model analysis, or operational key management policy. Always verify that your environment is trusted before generating or handling sensitive key material.
