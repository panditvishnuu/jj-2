// middleware/authorize.js
const roles = require("../roles");

const authorize = (permission) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (roles[userRole]?.includes(permission)) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }
  };
};

module.exports = authorize;
