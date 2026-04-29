require('dotenv').config();
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const crypto = require('crypto');
const path = require('path');
const { initializePool } = require('./db/connection');
const config = require('./config/config');

// Import routes
const authRoutes = require('./routes/authRoutes');
const notesRoutes = require('./routes/notesRoutes');

const app = express();

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Middleware to generate and pass nonce for inline scripts
app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('hex');
  next();
});

// Use helmet with custom Content Security Policy
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:'],
    connectSrc: ["'self'"],
  }
}));

// ============================================
// VIEW ENGINE & STATIC FILES
// ============================================

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// BODY PARSING MIDDLEWARE
// ============================================

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: false }));

// Parse JSON data
app.use(express.json());

// ============================================
// SESSION CONFIGURATION
// ============================================

// Configure express-session
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.nodeEnv === 'production', // Only HTTPS in production
    httpOnly: true, // Prevents client-side JS from accessing the session cookie
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// ============================================
// ROUTES
// ============================================

/**
 * Home page - redirect based on authentication status
 */
app.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/auth/login');
  }
});

/**
 * Dashboard - requires authentication
 */
app.get('/dashboard', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  // Redirect to /notes which handles the actual dashboard
  res.redirect('/notes');
});

// Auth routes
app.use('/auth', authRoutes);

// Notes routes
app.use('/notes', notesRoutes);

// ============================================
// ERROR HANDLING
// ============================================

/**
 * 404 handler - page not found
 */
app.use((req, res) => {
  res.status(404).send('Page not found');
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Internal server error');
});

// ============================================
// DATABASE & SERVER INITIALIZATION
// ============================================

/**
 * Initialize database and start server
 */
async function startServer() {
  try {
    // Initialize database connection pool
    await initializePool();
    console.log('✓ Database pool initialized');

    // Start the Express server
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(`\n╔════════════════════════════════════════╗`);
      console.log(`║   Secure Notes App Running!           ║`);
      console.log(`║   Server: http://localhost:${PORT}        ║`);
      console.log(`║   Environment: ${config.nodeEnv}                ║`);
      console.log(`╚════════════════════════════════════════╝\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;
