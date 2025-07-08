const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');

// @route   POST api/submissions
// @desc    Create a new form submission
// @access  Public
router.post('/', submissionController.createSubmission);

module.exports = router; 