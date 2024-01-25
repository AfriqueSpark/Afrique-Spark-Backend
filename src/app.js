const express = require("express");

const welcomeToApi = require("./middlewares/welcome.middleware");
const checkApiVersion = require("./middlewares/checkApiVersion.middleware")

const app = express();

app.get("/api/v:version", checkApiVersion, welcomeToApi);

app.all("*", (_, res) => {
  res.status(404).json({
    message: "Undefined API endpoint accessed.",
    success: false,
  });
});

module.exports = app;
