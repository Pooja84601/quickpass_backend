const jwt = require("jsonwebtoken");

const auth = (...allowedRoles) => {
  return (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. Authentication token is required.",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
                id: decoded.id || decoded.userId || decoded.adminId,
                role: decoded.role || "user"
            };

            if (!req.user.id) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token payload (user id missing)"
                });
            }

      // If roles are specified, check if user's role is in the allowed roles
      if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden. Insufficient role privileges.",
        });
      }

      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
    }
  };
};

module.exports = auth;
