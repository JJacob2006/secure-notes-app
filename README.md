# 🔐 Secure Notes App

A full-stack web application built using Node.js, Express, MySQL, and EJS that allows users to securely store and manage personal notes.

Developed by **John (BE CSE - Full Stack Development)** as part of academic learning and practical implementation of web security concepts.

---

## Features

- User Authentication (Register/Login)
- Secure password storage using bcrypt
- Notes encryption using AES-256
- Add, view, and delete personal notes
- Session-based authentication
- Clean glassmorphism UI with modern design
- Fully responsive layout

---

## Security Highlights

- Passwords are hashed (not stored in plain text)
- Notes are encrypted before storing in database
- Input validation using express-validator
- SQL Injection prevention using prepared statements
- Secure sessions with HTTPOnly cookies
- Users can access only their own notes

---

## Tech Stack

- **Frontend**: HTML, CSS, EJS
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Security**: bcrypt, crypto (AES-256), helmet

---

## 📁 Project Structure
```
secure-notes-app/
│
├── controllers/ → Business logic
├── routes/ → Route handling
├── db/ → Database & schema
├── utils/ → Encryption functions
├── views/ → EJS templates
├── public/ → CSS & images
│
└── app.js → Main server file
```
---

## How It Works

1. User registers and logs in
2. Password is hashed using bcrypt
3. Notes are encrypted before saving
4. Notes are decrypted only when displayed
5. Each user sees only their own data

---

## Learning Outcomes

- Understanding of authentication systems
- Implementation of encryption in real applications
- Secure backend development practices
- Working with databases in Node.js
- Building full-stack applications using MVC structure

---

## 📌 Note

This project is created for educational purposes and demonstrates basic implementation of web security concepts.

---

## 👨‍💻 Author

**John**  
BE CSE (Full Stack Development)  
Chandigarh University

---
