const express = require("express");

const userRoute = express.Router();

const {
  getUserData,
  createUser,
  deleteUsers,
} = require("../controllers/user.controller");

userRoute.route("/").get(getUserData).post(createUser).delete(deleteUsers);

module.exports = { userRoute };
