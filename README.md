# Secure Notes Web Application

A secure notes application built with Node.js, Express, and MySQL with encryption support.

## Security Features

- **Password Hashing**: Uses bcrypt to hash passwords (never stored in plain text)
- **Note Encryption**: All notes are encrypted using AES-256-CBC before storing
- **Input Validation**: Express-validator validates all user inputs
- **Prepared Statements**: Uses MySQL prepared statements to prevent SQL injection
- **Security Headers**: Helmet middleware adds security HTTP headers
- **Session Management**: Express-session manages secure user sessions
- **Authorization**: Users can only access their own notes
- **HTTPOnly Cookies**: Session cookies are HTTPOnly (not accessible to JavaScript)

## Prerequisites

- Node.js (v12 or higher)
- MySQL Server (v5.7 or higher)
- npm (Node Package Manager)

## Installation & Setup

### Step 1: Clone/Download the Project

```bash
cd d:\College\Final-Practicals\Security\ in\ FSD\secure-notes-app
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up MySQL Database

1. **Create the database**:
   ```sql
   CREATE DATABASE secure_notes_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE secure_notes_db;
   ```

2. **Create tables** - Run the schema setup:
   - Connect to MySQL and run the queries from `db/schema.js`
   - Or run this SQL directly:

   ```sql
   -- Create users table
   CREATE TABLE IF NOT EXISTS users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     username VARCHAR(255) UNIQUE NOT NULL,
     password_hash VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     INDEX idx_username (username)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

   -- Create notes table
   CREATE TABLE IF NOT EXISTS notes (
     id INT AUTO_INCREMENT PRIMARY KEY,
     user_id INT NOT NULL,
     encrypted_note LONGTEXT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
     INDEX idx_user_id (user_id)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
   ```

### Step 4: Configure Environment Variables

1. **Copy `.env.example` to `.env`**:
   ```bash
   copy .env.example .env
   ```

2. **Edit `.env` file** and set your configuration:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=secure_notes_db

   # Session Configuration
   SESSION_SECRET=your_unique_session_secret_key_here

   # Encryption Configuration (must be exactly 32 characters)
   ENCRYPTION_KEY=00000000000000000000000000000000

   # Server
   PORT=3000
   NODE_ENV=development
   ```

   **Important**: 
   - Replace `your_password` with your MySQL root password
   - Generate a secure `SESSION_SECRET` (any random string)
   - The `ENCRYPTION_KEY` must be exactly 32 characters

### Step 5: Run the Application

#### Development Mode (with auto-restart):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

The application will start on `http://localhost:3000`

## Project Structure

```
secure-notes-app/
├── app.js                 # Main Express application
├── package.json           # Project dependencies
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore file
│
├── config/
│   └── config.js          # Configuration management
│
├── db/
│   ├── connection.js      # Database connection pool
│   └── schema.js          # Database schema definitions
│
├── controllers/
│   ├── authController.js  # Authentication logic (register, login)
│   └── notesController.js # Notes CRUD operations
│
├── routes/
│   ├── authRoutes.js      # Authentication routes
│   └── notesRoutes.js     # Notes routes
│
├── utils/
│   └── encryption.js      # AES-256 encryption/decryption functions
│
├── views/                 # EJS templates
│   ├── layout.ejs         # Base layout
│   ├── register.ejs       # Registration page
│   ├── login.ejs          # Login page
│   ├── dashboard.ejs      # Notes dashboard
│   └── add-note.ejs       # Add note form
│
└── public/                # Static files (CSS, JS, images)
```

## Usage

### 1. Register a New Account

- Navigate to `http://localhost:3000/auth/register`
- Enter a username (3-30 characters)
- Enter a password (minimum 6 characters)
- Confirm the password
- Click "Register"

### 2. Login

- Navigate to `http://localhost:3000/auth/login`
- Enter your username and password
- Click "Login"

### 3. Add Notes

- Click "Add New Note" on the dashboard
- Write your note content (max 5000 characters)
- Click "Save Note"
- The note will be automatically encrypted before storing

### 4. View Notes

- All your notes appear on the dashboard
- Notes are automatically decrypted for display
- Each note shows creation date
- Click "Delete" to remove a note

### 5. Logout

- Click "Logout" button in the top-right corner
- You'll be redirected to the login page

## Security Implementation Details

### 1. Password Hashing
```javascript
// Using bcrypt with 10 rounds of salt
const hashedPassword = await bcrypt.hash(password, 10);
```

### 2. Note Encryption
```javascript
// AES-256-CBC encryption with random IV
const encrypted = encryptNote(noteContent);
// Format: iv:encryptedData
```

### 3. Database Queries
```javascript
// ALL queries use prepared statements
const sql = 'SELECT * FROM users WHERE username = ?';
const results = await executeQuery(sql, [username]);
// No string concatenation = No SQL Injection
```

### 4. Input Validation
```javascript
// express-validator validates all inputs
body('username').isLength({ min: 3, max: 30 })
body('password').isLength({ min: 6 })
body('note').isLength({ min: 1, max: 5000 })
```

### 5. Authorization
```javascript
// Verify user owns the note before deleting
const verifySQL = 'SELECT user_id FROM notes WHERE id = ?';
if (verifyResults[0].user_id !== userId) {
  return res.status(403).send('Unauthorized');
}
```

## API Endpoints

### Authentication
- `GET /auth/register` - Register page
- `POST /auth/register` - Register user
- `GET /auth/login` - Login page
- `POST /auth/login` - Login user
- `GET /auth/logout` - Logout user

### Notes
- `GET /notes` - View all user notes (dashboard)
- `GET /notes/add` - Add note page
- `POST /notes/add` - Create new note
- `POST /notes/delete/:id` - Delete a note

## Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | MySQL server host | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `password123` |
| `DB_NAME` | Database name | `secure_notes_db` |
| `SESSION_SECRET` | Secret key for sessions | `my_secret_key_12345` |
| `ENCRYPTION_KEY` | 32-char key for AES-256 | 32 random characters |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` or `production` |

## Dependencies

| Package | Purpose |
|---------|---------|
| `express` | Web framework |
| `mysql2` | MySQL database driver |
| `bcrypt` | Password hashing |
| `express-validator` | Input validation |
| `helmet` | Security headers |
| `express-session` | Session management |
| `ejs` | Template engine |
| `dotenv` | Environment variables |

## Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check DB_HOST, DB_USER, DB_PASSWORD in `.env`
- Ensure `secure_notes_db` database exists

### Encryption Key Error
- ENCRYPTION_KEY must be exactly 32 characters
- Cannot contain special characters that need escaping

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using that port

### npm install fails
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

## Development Tips

1. **Enable Debug Logging**:
   ```javascript
   // Add this to app.js to see queries
   console.log('Query:', sql, 'Values:', values);
   ```

2. **Test Encryption**:
   ```bash
   node -e "
   const enc = require('./utils/encryption');
   const encrypted = enc.encryptNote('test');
   console.log('Encrypted:', encrypted);
   console.log('Decrypted:', enc.decryptNote(encrypted));
   "
   ```

3. **Check Database**:
   ```sql
   -- View all users
   SELECT username, created_at FROM users;

   -- View all notes for a user
   SELECT * FROM notes WHERE user_id = 1;
   ```

## Future Enhancements

- [ ] Password reset functionality
- [ ] User profile page
- [ ] Note search functionality
- [ ] Share notes with other users
- [ ] Two-factor authentication
- [ ] Note categories/tags
- [ ] Dark mode

## License

This project is open source and available for educational purposes.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all environment variables are set correctly
3. Check console logs for error messages
4. Ensure MySQL server is running and accessible

---

**Remember**: Never commit `.env` file with real credentials to version control!
