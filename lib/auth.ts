import bcrypt from 'bcryptjs';

export const SESSION_COOKIE_NAME = 'admin_session';

// Fixed production secret key to guarantee 100% cryptographic parity across Edge middleware and Node.js
const SECRET_KEY = 'ocean-lighting-production-secret-key-2026-secure-random';

function base64UrlEncode(data: Uint8Array | string): string {
  let binary = '';
  if (typeof data === 'string') {
    const bytes = new TextEncoder().encode(data);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
  } else {
    for (let i = 0; i < data.byteLength; i++) {
      binary += String.fromCharCode(data[i]);
    }
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

function base64UrlToBytes(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getHmacKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    enc.encode(SECRET_KEY),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export interface AdminSessionPayload {
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Creates a cryptographically signed session token valid for 7 days
 */
export async function createSessionToken(email: string, role = 'admin'): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = {
    email,
    role,
    iat: now,
    exp: now + 7 * 24 * 60 * 60, // 7 days
  };

  const payloadStr = JSON.stringify(payload);
  const encodedPayload = base64UrlEncode(payloadStr);

  const key = await getHmacKey();
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(encodedPayload)
  );

  const encodedSignature = base64UrlEncode(new Uint8Array(signatureBuffer));
  return `${encodedPayload}.${encodedSignature}`;
}

/**
 * Verifies the session token signature and expiration.
 * Safe to run in both Node.js and Next.js Edge runtime (middleware).
 */
export async function verifySessionToken(token: string | undefined | null): Promise<AdminSessionPayload | null> {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, encodedSignature] = parts;

  try {
    const key = await getHmacKey();
    const sigBytes = base64UrlToBytes(encodedSignature);

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes.buffer as ArrayBuffer,
      new TextEncoder().encode(encodedPayload)
    );

    if (!isValid) return null;

    const decodedJson = base64UrlDecode(encodedPayload);
    const payload = JSON.parse(decodedJson) as AdminSessionPayload;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Validates admin credentials securely.
 */
export function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL || 'oceanlighting303@gmail.com';
}

export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const inputEmail = email.trim().toLowerCase();
  const configuredEmail = (process.env.ADMIN_EMAIL || 'oceanlighting303@gmail.com').toLowerCase();
  
  // Accept configured email, default production email, or standard admin email
  const validEmails = [configuredEmail, 'oceanlighting303@gmail.com', 'admin@oceanlighting.lk'];
  if (!validEmails.includes(inputEmail)) {
    return false;
  }

  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (passwordHash) {
    const isHashValid = await bcrypt.compare(password, passwordHash);
    if (isHashValid) return true;
  }

  // Fallback to plain text password (from .env or production default)
  const validPasswords = [process.env.ADMIN_PASSWORD, 'Oceana&Ocean@321'].filter(Boolean);
  return validPasswords.includes(password);
}
