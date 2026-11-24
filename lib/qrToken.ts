import crypto from 'crypto';

/**
 * Generates an HMAC-SHA256 token for a given table and expiration date.
 * Payload: "tableId:expiryEpochSeconds"
 * Signature: HMAC-SHA256(payload, secret) encoded as base64url
 * Full Token Format: "<expiryEpochSeconds>.<base64urlSignature>"
 */
export function generateTableToken(tableId: string, expiresAt: Date): string {
  const secret = process.env.TABLE_QR_SECRET || 'tableflow-qr-super-secret-salt-key-2026';
  const expiryEpoch = Math.floor(expiresAt.getTime() / 1000);
  const payload = `${tableId}:${expiryEpoch}`;

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const signature = hmac.digest('base64url');

  return `${expiryEpoch}.${signature}`;
}

/**
 * Verifies the HMAC-SHA256 token for a table.
 * Uses crypto.timingSafeEqual to prevent timing attacks.
 */
export function verifyTableToken(
  tableId: string,
  token: string | null | undefined
): { valid: boolean; reason?: 'missing' | 'malformed' | 'expired' | 'invalid_signature' } {
  if (!token || typeof token !== 'string') {
    return { valid: false, reason: 'missing' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, reason: 'malformed' };
  }

  const [expiryStr, signature] = parts;
  const expiryEpoch = parseInt(expiryStr, 10);

  if (isNaN(expiryEpoch)) {
    return { valid: false, reason: 'malformed' };
  }

  const nowEpoch = Math.floor(Date.now() / 1000);
  if (nowEpoch > expiryEpoch) {
    return { valid: false, reason: 'expired' };
  }

  const secret = process.env.TABLE_QR_SECRET || 'tableflow-qr-super-secret-salt-key-2026';
  const payload = `${tableId}:${expiryEpoch}`;

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest('base64url');

  try {
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (signatureBuffer.length !== expectedBuffer.length) {
      return { valid: false, reason: 'invalid_signature' };
    }

    const matches = crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
    if (!matches) {
      return { valid: false, reason: 'invalid_signature' };
    }

    return { valid: true };
  } catch {
    return { valid: false, reason: 'invalid_signature' };
  }
}
