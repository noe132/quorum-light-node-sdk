
import { hexToUint8Array } from './typeTransform';
import { assert, error } from './assert';

export const encrypt = async (buffer: Uint8Array, key: string) => {
  assert(buffer, error.required('buffer'));
  assert(key, error.required('key'));
  const aesKey = await crypto.subtle.importKey(
    "raw",
    hexToUint8Array(key),
    "AES-GCM",
    true,
    ["encrypt", 'decrypt']
  );
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const _cipherTextTag = await crypto.subtle.encrypt({
      name: "AES-GCM",
      iv: nonce,
    },
    aesKey,
    buffer
  )
  const cipherTextTag = new Uint8Array(_cipherTextTag);
  const nonceCipherTextTag = new Uint8Array(nonce.length + cipherTextTag.length);
  nonceCipherTextTag.set(nonce);
  nonceCipherTextTag.set(cipherTextTag, nonce.length);
  return nonceCipherTextTag.buffer
}

export const decrypt = async (buffer: Uint8Array, key: string) => {
  assert(buffer, error.required('buffer'));
  assert(key, error.required('key'));
  const encryptedBuffer = buffer;
  const aesKey = await crypto.subtle.importKey(
    "raw",
    hexToUint8Array(key),
    "AES-GCM",
    true,
    ["encrypt", 'decrypt']
  );
  const NONCE_LENGTH = 12;
  const nonce = encryptedBuffer.subarray(0, NONCE_LENGTH);
  const cipherTextTag = encryptedBuffer.subarray(NONCE_LENGTH);
  const decrypted = await crypto.subtle.decrypt({name: 'AES-GCM', iv: nonce}, aesKey, cipherTextTag);
  return new Uint8Array(decrypted);
}