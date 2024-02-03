const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res
      .status(401)
      .json({ message: "Unauthorized request made to this endpoint." });
  }

 next();
};

module.exports = isAuthenticated;
