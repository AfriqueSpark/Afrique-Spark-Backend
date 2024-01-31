const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res
      .status(401)
      .json({ message: "Unauthorized request made to this endpoint." });
  }

  return next();
};

module.exports = isAuthenticated;
