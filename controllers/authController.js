const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { executeQuery } = require('../db/connection');

/**
 * Register a new user
 * POST /auth/register
 */
async function register(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('register', { errors: errors.array() });
    }

    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO users (username, password_hash) VALUES (?, ?)';
    await executeQuery(sql, [username, hashedPassword]);

    return res.redirect('/auth/login?msg=User registered successfully');
  } catch (error) {
    console.error('Registration error:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).render('register', { errors: [{ msg: 'Username already exists' }] });
    }

    return res.status(500).render('register', { errors: [{ msg: 'Registration failed. Please try again.' }] });
  }
}

/**
 * Show login page (GET /auth/login)
 */
function showLogin(req, res) {
  const msg = req.query.msg || null;
  res.render('login', { msg, error: null, errors: [] });
}

/**
 * Login user
 * POST /auth/login
 */
async function login(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('login', {
        msg: null,
        error: null,
        errors: errors.array()
      });
    }

    const { username, password } = req.body;

    const sql = 'SELECT id, username, password_hash FROM users WHERE username = ?';
    const results = await executeQuery(sql, [username]);

    if (results.length === 0) {
      return res.status(401).render('login', {
        msg: null,
        error: null,
        errors: [{ msg: 'Invalid username or password' }]
      });
    }

    const user = results[0];

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).render('login', {
        msg: null,
        error: null,
        errors: [{ msg: 'Invalid username or password' }]
      });
    }

    req.session.userId = user.id;
    req.session.username = user.username;

    return res.redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).render('login', {
      msg: null,
      error: 'Login failed. Please try again.',
      errors: []
    });
  }
}

/**
 * Logout user
 * GET /auth/logout
 */
function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Logout failed');
    }
    res.redirect('/auth/login');
  });
}

module.exports = {
  register,
  login,
  logout,
  showLogin
};