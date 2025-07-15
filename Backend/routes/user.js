const express = require('express');
const {
  getAllUsers,
  getUserById,
  searchUsers
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

const router = express.Router();

// Protect all routes
router.use(auth);

// GET /api/users - Get all users (admin only)
router.get('/', roleAuth(['admin']), getAllUsers);

// GET /api/users/search/:query - Search users by name/email
router.get('/search/:query', searchUsers);

// GET /api/users/:id - Get specific user by ID
router.get('/:id', getUserById);

module.exports = router;
