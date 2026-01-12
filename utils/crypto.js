const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.CONTACT_ID_SECRET || 'your-32-char-secret-key-123456789012'; // 32 chars for aes-256

// Generate a random IV for better security (or use a fixed one for consistency)
// For production, consider using a random IV and storing it with the encrypted data
const IV = Buffer.alloc(16, 0); // Initialization vector (16 bytes for AES)

/**
 * Encrypt a contact ID using AES-256-CBC encryption
 * This protects sensitive data like database IDs from exposure in URLs or client-side code
 * @param {number|string} id - The ID to encrypt
 * @returns {string} Hex-encoded encrypted string
 */
function encryptId(id) {
    try {
        if (SECRET_KEY.length !== 32) {
            throw new Error('Secret key must be exactly 32 characters for AES-256');
        }

        const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), IV);
        let encrypted = cipher.update(id.toString(), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    } catch (error) {
        console.error('Error encrypting ID:', error);
        throw new Error('Failed to encrypt ID');
    }
}

/**
 * Decrypt an encrypted contact ID
 * @param {string} encryptedId - Hex-encoded encrypted string
 * @returns {string} Decrypted ID as string
 */
function decryptId(encryptedId) {
    try {
        if (SECRET_KEY.length !== 32) {
            throw new Error('Secret key must be exactly 32 characters for AES-256');
        }

        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY), IV);
        let decrypted = decipher.update(encryptedId, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Error decrypting ID:', error);
        throw new Error('Failed to decrypt ID');
    }
}

module.exports = { encryptId, decryptId };
