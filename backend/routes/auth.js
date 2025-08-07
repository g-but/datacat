const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.login);

// @route   GET api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, authController.getProfile);

// @route   PUT api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, authController.updateProfile);

// @route   POST api/auth/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', auth, authController.changePassword);

// @route   GET api/auth/verify
// @desc    Verify token validity
// @access  Private
router.get('/verify', auth, authController.verifyToken);

module.exports = router; 