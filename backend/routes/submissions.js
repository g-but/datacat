const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const auth = require('../middleware/auth');

// @route   POST api/submissions
// @desc    Create a new form submission
// @access  Public
router.post('/', submissionController.createSubmission);

// @route   GET api/submissions/:form_id
// @desc    Get all submissions for a specific form
// @access  Private
router.get('/:form_id', auth, submissionController.getFormSubmissions);

module.exports = router; 