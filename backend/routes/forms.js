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

// @route   DELETE api/forms/:id
// @desc    Delete a form
// @access  Private
router.delete('/:id', auth, formController.deleteForm);

// @route   PUT api/forms/:id
// @desc    Update a form
// @access  Private
router.put('/:id', auth, formController.updateForm);

module.exports = router; 