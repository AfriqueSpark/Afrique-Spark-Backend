const dotenv = require("dotenv");
const { app, redisClient } = require("./app");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

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

const DOMAIN = process.env.DOMAIN;

const server = app.listen(PORT, () => {
  console.log(">".red, `listening on ${DOMAIN}:${PORT}/api/v1`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = redisClient;
