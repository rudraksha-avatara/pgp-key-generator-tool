# 🔐 PGP Tools

> Simple, secure, and open-source PGP tools that work entirely in your browser.

🌐 Live Website: https://pgp.itisuniqueofficial.com/

---

## 🚀 About This Project

This project includes two lightweight, privacy-focused browser tools:

- **PGP Key Generator Tool** for creating OpenPGP public and private key pairs locally
- **PGP Decrypt Tool** for decrypting armored PGP messages locally with a private key and passphrase

No server processing. No data tracking. No storage.

Everything happens locally on your device.

---

## 🧠 How It Works

These tools use modern cryptography via **OpenPGP.js**:

1. In the key generator, the user enters:
   - Name
   - Email
   - Passphrase

2. The key generator:
   - Generates PGP key pair in the browser
   - Encrypts private key using passphrase
   - Displays public & private keys instantly

3. In the decrypt tool, the user can:
   - Paste an armored encrypted PGP message
   - Paste an armored private key
   - Enter the private key passphrase
   - Optionally add a sender public key for signature verification

4. The user can:
   - Copy keys
   - Copy decrypted plaintext
   - Download keys (.asc)
   - Verify signed messages when a sender public key is available

👉 No data is sent to any server at any time.

---

## ✨ Features

- 🔒 100% Client-Side Cryptographic Processing
- ⚡ Fast & Secure (OpenPGP.js)
- 🔑 RSA & ECC Support
- 🧾 Public & Private Key Export (.asc)
- 🔓 Local PGP Message Decryption
- ✅ Optional Signature Verification During Decryption
- 📋 Copy to Clipboard Support
- 📱 Fully Responsive (Mobile + Desktop)
- 🧠 Simple & Clean UI (No distractions)
- 🔐 Passphrase Protection
- 🌐 SEO Optimized
- ♿ Accessibility Friendly

---

## 🔐 Why Use This Tool?

### ✔ Privacy First
Your keys are generated **locally in your browser**.  
Nothing is uploaded, stored, or tracked.

### ✔ Open Source
Fully transparent — you can review the code anytime.

### ✔ No Installation Needed
Works instantly in any modern browser.

### ✔ Beginner Friendly
Simple UI makes it easy to generate keys or decrypt messages safely.

### ✔ Lightweight
No heavy dependencies or frameworks.

---

## 🛠️ Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla)
- OpenPGP.js

---

## 📁 Project Structure

```text
pgp-key-generator-tool/
|- index.html
|- pgp-decrypt-tool/
|  \- index.html
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
|  |- decrypt-app.js
|  |- decrypt-ui.js
|  |- decrypt-validators.js
|  |- decrypt.js
|  |- download.js
|  |- keygen.js
|  |- redirect.js
|  |- ui.js
|  |- utils.js
|  \- validators.js
\- vendor/
   \- openpgp.min.js
```

---

## 🔐 Security Notes

- Private keys, passphrases, and decrypted messages are never sent to any server
- Key generation and decryption run entirely client-side
- Always use a strong passphrase
- Do not share your private key
- Store your keys securely

---

## ⚠️ Disclaimer

This tool is provided for educational and practical use.  
Users are responsible for securely storing their private keys.

---

## 🌐 URL Structure & SEO

- Canonical URL: https://pgp.itisuniqueofficial.com/
- Decrypt tool canonical URL: https://pgp.itisuniqueofficial.com/pgp-decrypt-tool/
- Clean URL enforced (no `index.html`)
- SEO optimized metadata
- Accessible and structured HTML

---

## 🧩 Use Cases

- Secure Email Communication
- File Encryption
- Message Decryption
- Digital Signatures
- Developer Security Tools
- Learning Cryptography

---

## 🤝 Contributing

Contributions are welcome!

- Fork the repository
- Create a new branch
- Make improvements
- Submit a pull request

---

## 📜 License

This project is licensed under the MIT License.

---

## 🏷️ Tags

`pgp` `encryption` `openpgp` `security` `cryptography` `web-tool`  
`open-source` `privacy` `client-side` `javascript` `developer-tools`

---

## 👨‍💻 Author

**Jaydatt Khodave**  

🌐 https://my.itisuniqueofficial.com/

---

## ❤️ Credits

Built with Open-Source Community - ITISUNIQUEOFFICIAL.com

---

## ⭐ Support

If you like this project:

- ⭐ Star the repository
- 🔗 Share with others
- 🧠 Contribute improvements

---

## 🏷️ Badges

![Open Source](https://img.shields.io/badge/Open%20Source-Yes-green)
![Privacy](https://img.shields.io/badge/Privacy-100%25%20Local-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)
