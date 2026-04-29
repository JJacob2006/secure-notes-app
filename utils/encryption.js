const crypto = require('crypto');
const config = require('../config/config');

// Encryption algorithm
const ALGORITHM = 'aes-256-cbc';

/**
 * Encrypt note using AES-256-CBC
 * @param {string} text - The text to encrypt
 * @returns {string} - Encrypted data in format: iv:encryptedData
 */
function encryptNote(text) {
  try {
    // Create a random initialization vector
    const iv = crypto.randomBytes(16);
    
    // Create cipher using the algorithm, encryption key, and IV
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(config.encryptionKey, 'utf8'), iv);
    
    // Update cipher with the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Return IV and encrypted data separated by colon
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt note');
  }
}

/**
 * Decrypt note using AES-256-CBC
 * @param {string} encryptedText - The encrypted data in format: iv:encryptedData
 * @returns {string} - Decrypted text
 */
function decryptNote(encryptedText) {
  try {
    // Split the IV and encrypted data
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    // Create decipher using the algorithm, decryption key, and IV
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(config.encryptionKey, 'utf8'), iv);
    
    // Update decipher with the encrypted data
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt note');
  }
}

module.exports = {
  encryptNote,
  decryptNote
};
