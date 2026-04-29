const mysql = require('mysql2/promise');
const config = require('../config/config');

// Create a connection pool for better performance
let pool = null;

/**
 * Initialize database connection pool
 */
async function initializePool() {
  try {
    pool = mysql.createPool({
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    console.log('Database pool initialized successfully');
    return pool;
  } catch (error) {
    console.error('Failed to initialize database pool:', error);
    throw error;
  }
}

/**
 * Get the database pool
 */
function getPool() {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initializePool() first.');
  }
  return pool;
}

/**
 * Execute a query with prepared statement
 * @param {string} sql - SQL query with ? placeholders
 * @param {array} values - Parameter values for prepared statement
 * @returns {object} - Query result
 */
async function executeQuery(sql, values = []) {
  try {
    const connection = await getPool().getConnection();
    const [results] = await connection.execute(sql, values);
    connection.release();
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

module.exports = {
  initializePool,
  getPool,
  executeQuery
};
