import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(':');

  if (parts.length !== 2) {
    return false;
  }

  const [salt, originalHashHex] = parts;
  const derivedHash = scryptSync(password, salt, 64);
  const originalHash = Buffer.from(originalHashHex, 'hex');

  if (derivedHash.length !== originalHash.length) {
    return false;
  }

  return timingSafeEqual(derivedHash, originalHash);
}
