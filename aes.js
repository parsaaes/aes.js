// takes a string and returns an ArrayBuffer containing the sha256 of it.
async function digest(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = await window.crypto.subtle.digest("SHA-256", data);
  return hash;
}

// returns base64 encoding of a given ArrayBuffer
function b64enc(arrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
}

// returns ArrayBuffer of a given base64 encoded
function b64dec(encoded) {
  let binStr = atob(encoded);
  let len = binStr.length;
  let bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binStr.charCodeAt(i);
  }
  return bytes.buffer;
}

// takes an ArrayBuffer with length of 128, 192 and 256 and returns a key.
function importKey(rawKey) {
  return window.crypto.subtle.importKey(
    "raw",
    rawKey,
    "AES-GCM",
    false,
    ["encrypt", "decrypt"],
  );
}

// AES-GCM encryption
async function encrypt(message, password) {
  let rawKey = await digest(password);
  let key = await importKey(rawKey);
  let encoded = new TextEncoder().encode(message);
  let iv = window.crypto.getRandomValues(new Uint8Array(12));
  let ciphertext = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encoded,
  );

  return b64enc(iv) + "." + b64enc(ciphertext);
}

// AES-GCM decryption
async function decrypt(encrypted, password) {
  let rawKey = await digest(password);
  let key = await importKey(rawKey);
  let substrs = encrypted.split(".");
  let iv = b64dec(substrs[0]);
  let cipherText = b64dec(substrs[1]);
  let decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    cipherText,
  );

  return new TextDecoder().decode(decrypted);
}
