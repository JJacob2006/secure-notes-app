const express = require('express');
const { body } = require('express-validator');
const notesController = require('../controllers/notesController');

const router = express.Router();

/**
 * Middleware to check if user is authenticated
 */
function isAuthenticated(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  next();
}

/**
 * GET /notes - Get all notes for the user
 * Protected route - requires authentication
 */
router.get('/', isAuthenticated, notesController.getNotes);

/**
 * GET /notes/add - Render add note page
 * Protected route - requires authentication
 */
router.get('/add', isAuthenticated, notesController.getAddNotePage);

/**
 * POST /notes/add - Add a new note
 * Protected route - requires authentication
 * Validates note content (1-5000 characters)
 */
router.post('/add',
  isAuthenticated,
  body('note')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Note must be 1-5000 characters'),
  notesController.addNote
);

/**
 * POST /notes/delete/:id - Delete a note
 * Protected route - requires authentication
 * Prevents unauthorized deletion of other users' notes
 */
router.post('/delete/:id', isAuthenticated, notesController.deleteNote);

module.exports = router;
