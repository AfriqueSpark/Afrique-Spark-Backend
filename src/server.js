const dotenv = require("dotenv");
const { app, redisClient } = require("./app");
const mongoose = require("mongoose");

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(">".green, "Database Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

// //Log success message when redis connects
redisClient.on("ready", function () {
  console.log(">".yellow, "Successfully connected to Redis.");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(">".red, `listening on http://localhost:${PORT}/api/v1`);
});

module.exports = redisClient;
