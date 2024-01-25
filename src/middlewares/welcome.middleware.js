const welcomeToApi = (req, res) => {
  const { version } = req.params;
  res.status(200).json({
    status: "success",
    message: `welcome to Afrique spark Api v${version}`,
  });
};

module.exports = welcomeToApi;
