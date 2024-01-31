const express = require("express");

const {
  handlePasswordSignUp,
  handlePasswordSignUpRedirect,
  handlePasswordSignInRedirect,
  handlePasswordSignIn,
  handleSignOut,
  handleGoogle,
  handleGoogleRedirect,
  handleGoogleSuccessRedirect,
  handleGoogleFailureRedirect,
} = require("../../controllers/Auth/auth.controller");

const authRoute = express.Router();

// HANDLE GOOGLE SIGN-UP/SIGN-IN REQUESTS
authRoute.route("/google").get(handleGoogle);
authRoute.route("/google/redirect").get(handleGoogleRedirect);
authRoute.route("/google/redirect/success").get(handleGoogleSuccessRedirect);
authRoute.route("/google/redirect/failure").get(handleGoogleFailureRedirect);

// HANDLE SIGN-UP REQUESTS
authRoute.route("/sign-up").post(handlePasswordSignUp);
authRoute.route("/sign-up/redirect/success").get(handlePasswordSignUpRedirect);

// HANDLE SIGN-IN REQUESTS
authRoute.route("/sign-in").post(handlePasswordSignIn);
authRoute.route("/sign-in/redirect/success").get(handlePasswordSignInRedirect);

// HANDLE SIGN-OUT REQUEST
authRoute.route("/sign-out").post(handleSignOut);

module.exports = authRoute;
