const express = require("express");

const welcomeToApi = require("./middlewares/welcome.middleware");

const checkApiVersion = require("./middlewares/checkApiVersion.middleware");

const { userRoute } = require("./routes/user.route");

const app = express();

app.use(express.json());

app.get("/api/v:version", checkApiVersion, welcomeToApi);

app.use("/api/v:version/users/", checkApiVersion, userRoute);

app.all("*", (_, res) => {
  res.status(404).json({
    message: "Undefined API endpoint accessed.",
    success: false,
  });
});

module.exports = app;
