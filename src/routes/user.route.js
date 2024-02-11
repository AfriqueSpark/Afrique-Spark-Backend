const express = require("express");

const { isRestrictedTo } = require("../middlewares/roleAuth.middleware");

const userRoute = express.Router();

const {
  getUserData,
  createUser,
  deleteUsers,
  updateRole,
} = require("../controllers/user.controller");

userRoute.route("/update-role").put(updateRole);

userRoute.use(isRestrictedTo("admin"));

userRoute.route("/").get(getUserData).post(createUser).delete(deleteUsers);

module.exports = { userRoute };
