const express = require("express");

const userRoute = express.Router();

const {
  getUserData,
  createUser,
  deleteUsers,
  updateRole,
} = require("../controllers/user.controller");

userRoute.route("/").get(getUserData).post(createUser).delete(deleteUsers);
userRoute.route("/update-role").put(updateRole);

module.exports = { userRoute };
