const express = require("express");

const userRoute = express.Router();

const { getUserData, createUser } = require("../controllers/user.controller");

userRoute.route("/").get(getUserData).post(createUser);

module.exports = { userRoute };
