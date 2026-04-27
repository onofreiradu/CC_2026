"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
const node_crypto_1 = require("node:crypto");
function hashPassword(password) {
    const salt = (0, node_crypto_1.randomBytes)(16).toString('hex');
    const hash = (0, node_crypto_1.scryptSync)(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
}
function verifyPassword(password, storedHash) {
    const parts = storedHash.split(':');
    if (parts.length !== 2) {
        return false;
    }
    const [salt, originalHashHex] = parts;
    const derivedHash = (0, node_crypto_1.scryptSync)(password, salt, 64);
    const originalHash = Buffer.from(originalHashHex, 'hex');
    if (derivedHash.length !== originalHash.length) {
        return false;
    }
    return (0, node_crypto_1.timingSafeEqual)(derivedHash, originalHash);
}
