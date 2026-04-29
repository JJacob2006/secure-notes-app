const express = require('express'); 
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * GET /auth/register - Render register page
 */
router.get('/register', (req, res) => {
  res.render('register', { errors: [] });
});

/**
 * POST /auth/register
 */
router.post('/register',
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be 3-30 characters'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
  authController.register
);

/**
 * GET /auth/login
 */
router.get('/login', authController.showLogin);

/**
 * POST /auth/login
 */
router.post('/login',
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  authController.login
);

/**
 * GET /auth/logout
 */
router.get('/logout', authController.logout);

module.exports = router;