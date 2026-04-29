require('dotenv').config();

module.exports = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'secure_notes_db'
  },
  sessionSecret: process.env.SESSION_SECRET || 'default_secret_change_this',
  encryptionKey: process.env.ENCRYPTION_KEY || '00000000000000000000000000000000',
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development'
};
