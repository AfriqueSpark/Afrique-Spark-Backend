const express = require("express");

const {
  handlePasswordSignUp,
  handlePasswordSignUpRedirect,
  handlePasswordSignInRedirect,
  handlePasswordSignIn,
  handleSignOut,
} = require("../../controllers/Auth/auth.controller");

const authRoute = express.Router();

// HANDLE SIGN-UP REQUESTS
authRoute.route("/sign-up").post(handlePasswordSignUp);
authRoute.route("/sign-up/redirect/success").get(handlePasswordSignUpRedirect);

// HANDLE SIGN-IN REQUESTS
authRoute.route("/sign-in").post(handlePasswordSignIn);
authRoute.route("/sign-in/redirect/success").get(handlePasswordSignInRedirect);

// HANDLE SIGN-OUT REQUEST
authRoute.route("/sign-out").post(handleSignOut);

module.exports = authRoute;
