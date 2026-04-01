// ----------------------------------------------------------------
// DBHelper — Katman 7
// AES-256-GCM sifreleme/cozme.
// v2: AAD (Additional Authenticated Data) destegi eklendi.
// AAD, sifrelenmis veriyi farkli bir kullaniciya kopyalamayi engeller.
// v1 blob'lari (AAD'siz) geriye donuk uyumlu olarak desteklenir.
// Sadece server-side'da calisir (Node.js crypto).
// ----------------------------------------------------------------

import { randomBytes, createCipheriv, createDecipheriv } from 'crypto'
import type { EncryptedBlob } from './types'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12 // 96-bit
const TAG_LENGTH = 16 // 128-bit

function getKey(): Buffer {
  const keyBase64 = process.env.MARKETPLACE_SECRET_KEY
  if (!keyBase64) {
    throw new Error('MARKETPLACE_SECRET_KEY tanimlanmamis')
  }
  const key = Buffer.from(keyBase64, 'base64')
  if (key.length !== 32) {
    throw new Error('MARKETPLACE_SECRET_KEY 32 byte olmali')
  }
  return key
}

function getOldKey(): Buffer | null {
  const keyBase64 = process.env.MARKETPLACE_SECRET_KEY_OLD
  if (!keyBase64) return null
  const key = Buffer.from(keyBase64, 'base64')
  if (key.length !== 32) return null
  return key
}

function getCurrentVersion(): number {
  return 2
}

/**
 * Duzy metni AES-256-GCM ile sifreler.
 * @param plaintext Sifrelenmemis metin
 * @param aad Additional Authenticated Data (ornegin userId).
 *            AAD veriyi farkli kullaniciya tasimaya karsi korur.
 * @returns JSON string: { iv, ciphertext, tag, version }
 */
export function encrypt(plaintext: string, aad?: string): string {
  const key = getKey()
  const iv = randomBytes(IV_LENGTH)

  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH })

  if (aad) {
    cipher.setAAD(Buffer.from(aad, 'utf8'))
  }

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ])
  const tag = cipher.getAuthTag()

  const blob: EncryptedBlob = {
    iv: iv.toString('base64'),
    ciphertext: encrypted.toString('base64'),
    tag: tag.toString('base64'),
    version: getCurrentVersion(),
  }

  return JSON.stringify(blob)
}

/**
 * AES-256-GCM sifreli blobu cozer.
 * Oncelikle guncel anahtari dener, basarisiz olursa eski anahtari dener.
 * v1 blob'lari (AAD'siz) geriye donuk uyumlu olarak desteklenir.
 * @param blobString JSON string: { iv, ciphertext, tag, version }
 * @param aad AAD (encrypt'te verilmisse ayni deger verilmeli)
 * @returns Duz metin
 */
export function decrypt(blobString: string, aad?: string): string {
  const blob: EncryptedBlob = JSON.parse(blobString)

  const iv = Buffer.from(blob.iv, 'base64')
  const ciphertext = Buffer.from(blob.ciphertext, 'base64')
  const tag = Buffer.from(blob.tag, 'base64')

  // v1 blob'lari AAD'siz sifrelendiginden, v1'de AAD gecmeyin
  const effectiveAAD = blob.version >= 2 ? aad : undefined

  // Guncel anahtar ile dene
  try {
    const key = getKey()
    return decryptWithKey(key, iv, ciphertext, tag, effectiveAAD)
  } catch {
    // Eski anahtar ile dene (key rotation durumu)
    const oldKey = getOldKey()
    if (!oldKey) {
      throw new Error('Sifre cozme basarisiz — anahtar uyumsuz')
    }
    return decryptWithKey(oldKey, iv, ciphertext, tag, effectiveAAD)
  }
}

function decryptWithKey(
  key: Buffer,
  iv: Buffer,
  ciphertext: Buffer,
  tag: Buffer,
  aad?: string
): string {
  const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH })
  decipher.setAuthTag(tag)

  if (aad) {
    decipher.setAAD(Buffer.from(aad, 'utf8'))
  }

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ])
  return decrypted.toString('utf8')
}

/**
 * Eski anahtarla sifrelenmi veriyi guncel anahtarla yeniden sifreler.
 * Key rotation icin kullanilir.
 * @param oldBlobString Eski sifreli blob
 * @param aad AAD (varsa ayni deger verilmeli)
 * @returns Yeni sifreli blob (guncel anahtar + yeni IV)
 */
export function rotateKey(oldBlobString: string, aad?: string): string {
  const plaintext = decrypt(oldBlobString, aad)
  return encrypt(plaintext, aad)
}
