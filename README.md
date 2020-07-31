#  aes.js
This is an example of how to use [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) to encrypt/decrypt using AES algorithm.

The `encrypt` function takes a plain text and a passphrase and returns a base64 encoded cipher text encrypted with AES-GCM. The passphrase turns to a sha256 hash to be used as the key of encryption. You may want to use [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) instead.

The `decrypt` function takes a base64 encoded cipher text and a passphrase and returns the plain text decrypted by AES-GCM.
