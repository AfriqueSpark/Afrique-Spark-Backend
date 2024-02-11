const errorHandler = require("../utils/error.handler.class");

exports.isRestrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new errorHandler(403, "You don't have role access to this route")
      );
    }
    next();
  };
};
