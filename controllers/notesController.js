const { validationResult } = require('express-validator');
const { executeQuery } = require('../db/connection');
const { encryptNote, decryptNote } = require('../utils/encryption');

/**
 * Get all notes for the logged-in user
 * GET /notes
 */
async function getNotes(req, res) {
  try {
    const userId = req.session.userId;

    const sql = `
      SELECT id, encrypted_note, created_at, updated_at 
      FROM notes 
      WHERE user_id = ? 
      ORDER BY updated_at DESC
    `;
    const results = await executeQuery(sql, [userId]);

    const notes = results.map((note) => ({
      id: note.id,
      content: decryptNote(note.encrypted_note),
      createdAt: note.created_at,
      updatedAt: note.updated_at
    }));

    res.render('dashboard', {
      notes,
      username: req.session.username,
      error: null
    });

  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).render('dashboard', {
      notes: [],
      username: req.session.username,
      error: 'Failed to load notes'
    });
  }
}

/**
 * Render add note page
 * GET /notes/add
 */
function getAddNotePage(req, res) {
  res.render('add-note', {
    username: req.session.username,
    errors: []
  });
}

/**
 * Add a new note
 * POST /notes/add
 */
async function addNote(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('add-note', {
        errors: errors.array(),
        username: req.session.username
      });
    }

    const { note } = req.body;
    const userId = req.session.userId;

    const encryptedNote = encryptNote(note);

    const sql = 'INSERT INTO notes (user_id, encrypted_note) VALUES (?, ?)';
    await executeQuery(sql, [userId, encryptedNote]);

    res.redirect('/dashboard');

  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).render('add-note', {
      errors: [{ msg: 'Failed to add note' }],
      username: req.session.username
    });
  }
}

/**
 * Delete a note
 * POST /notes/delete/:id
 */
async function deleteNote(req, res) {
  try {
    const noteId = req.params.id;
    const userId = req.session.userId;

    const verifySQL = 'SELECT user_id FROM notes WHERE id = ?';
    const verifyResults = await executeQuery(verifySQL, [noteId]);

    if (verifyResults.length === 0 || verifyResults[0].user_id !== userId) {
      return res.status(403).send('Unauthorized');
    }

    const sql = 'DELETE FROM notes WHERE id = ? AND user_id = ?';
    await executeQuery(sql, [noteId, userId]);

    res.redirect('/dashboard');

  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).send('Failed to delete note');
  }
}

module.exports = {
  getNotes,
  getAddNotePage,
  addNote,
  deleteNote
};