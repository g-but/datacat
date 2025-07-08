const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const formController = require('../controllers/formController');

// @route   POST api/forms
// @desc    Save a new form
// @access  Private
router.post('/', auth, formController.saveForm);

// @route   GET api/forms
// @desc    Get all forms for a user
// @access  Private
router.get('/', auth, formController.getForms);

module.exports = router; 