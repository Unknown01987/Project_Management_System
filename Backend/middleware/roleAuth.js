function roleAuth(allowedRoles = []) {
  return (req, res, next) => {
    // Assumes req.user is set by your auth middleware
    const user = req.user;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
}

module.exports = roleAuth;