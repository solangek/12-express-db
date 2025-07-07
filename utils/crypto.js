const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const secretKey = process.env.CONTACT_ID_SECRET || 'your-32-char-secret-key-123456789012'; // 32 chars for aes-256
const iv = Buffer.alloc(16, 0); // Initialization vector (for demo, use a fixed IV)

/* The goal of this module is to encrypt and decrypt contact IDs
    * using AES-256-CBC encryption.
    * This is useful for protecting sensitive data,
    * such as contact IDs, in the database. We do this to prevent
    * exposing the actual IDs in the database or in the application client side.
 */
function encryptId(id) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    let encrypted = cipher.update(id.toString());
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}

function decryptId(encryptedId) {
    const encryptedText = Buffer.from(encryptedId, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = { encryptId, decryptId };
