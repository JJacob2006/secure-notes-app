-- SQL Database Setup Script for Secure Notes App
-- Run these queries in MySQL to set up the database and tables

-- Step 1: Create Database
CREATE DATABASE IF NOT EXISTS secure_notes_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Step 2: Select Database
USE secure_notes_db;

-- Step 3: Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  
  COMMENT 'Stores user account information with hashed passwords'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 4: Create Notes Table
CREATE TABLE IF NOT EXISTS notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  encrypted_note LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  
  COMMENT 'Stores encrypted notes for each user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 5: Verify tables were created
SHOW TABLES;

-- Step 6: Display table schemas
DESCRIBE users;
DESCRIBE notes;

-- ============================================
-- USEFUL QUERIES FOR DEVELOPMENT
-- ============================================

-- View all users (without passwords)
-- SELECT id, username, created_at FROM users;

-- View all notes for a specific user
-- SELECT n.id, n.created_at, n.updated_at FROM notes n 
-- WHERE n.user_id = 1;

-- Count total notes for a user
-- SELECT COUNT(*) as total_notes FROM notes WHERE user_id = 1;

-- Delete all data (be careful!)
-- DELETE FROM notes;
-- DELETE FROM users;
-- ALTER TABLE users AUTO_INCREMENT = 1;
-- ALTER TABLE notes AUTO_INCREMENT = 1;
