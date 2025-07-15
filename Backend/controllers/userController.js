const User = require('../models/User');

// GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    console.error('Get all users error:', err);
    res.status(500).json({ message: 'Server Error while fetching users' });
  }
};

// GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Get user by ID error:', err);
    res.status(500).json({ message: 'Server Error while fetching user' });
  }
};

// GET /api/users/search/:query
exports.searchUsers = async (req, res) => {
  try {
    const query = req.params.query;
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select('-password');

    res.status(200).json(users);
  } catch (err) {
    console.error('Search users error:', err);
    res.status(500).json({ message: 'Server Error while searching users' });
  }
};
