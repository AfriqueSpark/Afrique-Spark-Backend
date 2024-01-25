const checkApiVersion = (req, res, next) => {
  const { version } = req.params;

  if (version !== "1") {
    res.status(404).json({
      message: `Undefined API version accessed.`,
      success: false,
    });
  }
  next();
};

module.exports = checkApiVersion;
