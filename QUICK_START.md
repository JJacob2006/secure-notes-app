# Secure Notes App - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create MySQL Database
Connect to MySQL and run:
```sql
CREATE DATABASE secure_notes_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE secure_notes_db;

-- Create users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create notes table
CREATE TABLE notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  encrypted_note LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
copy .env.example .env  # Windows
cp .env.example .env    # Mac/Linux
```

Edit `.env` and update:
```env
DB_HOST=localhost
DB_USER=root              # Your MySQL username
DB_PASSWORD=password      # Your MySQL password
DB_NAME=secure_notes_db

SESSION_SECRET=my_secret_key_change_this
ENCRYPTION_KEY=00000000000000000000000000000000

PORT=3000
NODE_ENV=development
```

**Important**: 
- `ENCRYPTION_KEY` must be exactly 32 characters
- Keep `.env` secret - never commit to version control

### 4. Start the Application
```bash
npm run dev    # Development mode with auto-restart
npm start      # Production mode
```

The app will start at `http://localhost:3000`

### 5. Test the Application
1. Go to `http://localhost:3000/auth/register`
2. Create an account with:
   - Username: `testuser`
   - Password: `password123`
3. Login with your credentials
4. Click "Add New Note" and create your first secure note
5. View, delete, and manage your notes

---

## 📁 Project Structure

```
secure-notes-app/
├── app.js                      # Main Express server
├── package.json                # Dependencies
├── .env.example                # Environment template
├── README.md                   # Full documentation
│
├── config/
│   └── config.js               # Configuration loader
│
├── db/
│   ├── connection.js           # Database pool
│   ├── schema.js               # Table definitions
│   └── setup.sql               # SQL setup script
│
├── controllers/                # Business logic
│   ├── authController.js       # Auth logic
│   └── notesController.js      # Notes logic
│
├── routes/                     # API endpoints
│   ├── authRoutes.js           # /auth/* routes
│   └── notesRoutes.js          # /notes/* routes
│
├── utils/
│   └── encryption.js           # AES-256 encryption
│
├── views/                      # EJS templates
│   ├── register.ejs            # Registration page
│   ├── login.ejs               # Login page
│   ├── dashboard.ejs           # Notes dashboard
│   └── add-note.ejs            # Add note form
│
└── public/                     # Static assets
```

---

## 🔐 Security Implementation

| Feature | Implementation |
|---------|-----------------|
| **Password Hashing** | bcrypt with 10 salt rounds |
| **Note Encryption** | AES-256-CBC with random IV |
| **SQL Injection Prevention** | Prepared statements on all queries |
| **Input Validation** | express-validator on all inputs |
| **Security Headers** | Helmet middleware |
| **Session Security** | HTTPOnly cookies, 24h expiration |
| **Authorization** | User ID verification for all actions |

---

## 🛣️ API Routes

### Authentication
| Route | Method | Description |
|-------|--------|-------------|
| `/auth/register` | GET/POST | Register new user |
| `/auth/login` | GET/POST | Login user |
| `/auth/logout` | GET | Logout user |

### Notes
| Route | Method | Description |
|-------|--------|-------------|
| `/notes` | GET | View all notes |
| `/notes/add` | GET/POST | Add new note |
| `/notes/delete/:id` | POST | Delete note |

---

## 🚀 Development vs Production

### Development
```bash
npm run dev
# Auto-restarts on file changes
# Full error messages in console
```

### Production
```bash
NODE_ENV=production npm start
# Secure cookies over HTTPS only
# Error messages not exposed to users
```

---

## ❓ Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED
```
**Fix**: Ensure MySQL is running and credentials in `.env` are correct

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Fix**: Change PORT in `.env` or kill process: `lsof -i :3000` (Mac/Linux)

### Encryption Key Error
```
TypeError: key.length is not 32
```
**Fix**: ENCRYPTION_KEY in `.env` must be exactly 32 characters

### Module Not Found
```
Cannot find module 'express'
```
**Fix**: Run `npm install` first

---

## 📝 Features

✅ **User Authentication**
- Registration with validation
- Bcrypt password hashing
- Session-based login

✅ **Secure Notes**
- AES-256 encryption
- Only owner can view/delete
- Automatic encryption/decryption

✅ **Security**
- No SQL injection (prepared statements)
- Input validation
- Security headers
- CSRF protection

✅ **User Interface**
- Responsive design
- Clean, intuitive layout
- Real-time character count
- Delete confirmation

---

## 🔧 Dependencies

```json
{
  "express": "Web framework",
  "mysql2": "Database driver",
  "bcrypt": "Password hashing",
  "express-validator": "Input validation",
  "helmet": "Security headers",
  "express-session": "Session management",
  "ejs": "Template engine",
  "dotenv": "Environment variables"
}
```

---

## 📚 Environment Variables

```env
# Database
DB_HOST=localhost          # MySQL host
DB_USER=root              # MySQL username
DB_PASSWORD=password      # MySQL password
DB_NAME=secure_notes_db   # Database name

# Security
SESSION_SECRET=random_string       # Session encryption key
ENCRYPTION_KEY=32_character_key   # Exactly 32 characters

# Server
PORT=3000                  # Server port
NODE_ENV=development       # development or production
```

---

## 💡 Example Workflows

### Workflow 1: Register & Login
1. Visit `/auth/register`
2. Enter username and password
3. Get redirected to login
4. Login with credentials
5. Redirected to dashboard

### Workflow 2: Add & View Notes
1. Click "Add New Note"
2. Type your note content
3. Click "Save Note"
4. Note appears encrypted in database
5. Dashboard displays decrypted content

### Workflow 3: Delete Note
1. View dashboard
2. Click "Delete" on a note
3. Confirm deletion
4. Note removed from database

---

## 🎯 Next Steps

1. ✅ Complete setup (follow 5-minute setup above)
2. 📖 Read [README.md](README.md) for full documentation
3. 🔍 Review code comments for security explanations
4. 🧪 Test all features (register, login, add/delete notes)
5. 🚀 Deploy to production (update NODE_ENV, use HTTPS)

---

## 📞 Support

If you encounter issues:
1. Check the **Troubleshooting** section above
2. Verify `.env` configuration
3. Ensure MySQL is running
4. Check console for error messages
5. Review [README.md](README.md) for detailed info

---

**You're all set! Happy secure note-taking! 🎉**
