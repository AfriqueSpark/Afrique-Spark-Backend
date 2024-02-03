const dotenv = require("dotenv");
const passport = require("passport");
const validateEmailPasswordInput = require("../../utils/validateUserInput");
const AuthenticationStrategy = require("../../Auth/authentication");

dotenv.config();

//passport authentication strategies
new AuthenticationStrategy();

//Controller for google signup/signIn route
function handleGoogle(req, res, next) {
  passport.authenticate("google", {
    successRedirect: "google/redirect/success",
  })(req, res, next);
}

// controller for google redirect
function handleGoogleRedirect(req, res) {
  const { user } = req;

  res.status(201).json({
    success: true,
    message: "Successfully signed in with Google.",
    payload: { user: user },
  });
}

//Controller for signup route
function handlePasswordSignUp(req, res, next) {
  //Validate request body
  const { error } = validateEmailPasswordInput(req.body);

  if (error) {
    const errorMessage = error.details[0].message.replace(/"/g, ""); // strip out quotes
    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }

  const redirectUrl = `${process.env.BASE_URL}/api/v1/auth/sign-up/redirect`;

  return passport.authenticate("signUp", {
    successRedirect: `${redirectUrl}/success`,
  })(req, res, next);
}

//Controller for signup redirect
function handlePasswordSignUpRedirect(req, res) {
  const { user } = req;

  res.status(201).json({
    message: "user registered  successfully",
    success: true,
    payload: { user: user },
  });
}

//Controller for signIn route
function handlePasswordSignIn(req, res, next) {
  //Validate request body
  const { error } = validateEmailPasswordInput(req.body);

  if (error) {
    const errorMessage = error.details[0].message.replace(/"/g, ""); // strip out quotes
    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }

  const redirectUrl = `${process.env.BASE_URL}/api/v1/auth/sign-in/redirect`;
  return passport.authenticate("signIn", {
    successRedirect: `${redirectUrl}/success`,
  })(req, res, next);
}

//Controller for signIn redirect
function handlePasswordSignInRedirect(req, res) {
  const { user } = req;

  console.log(user);

  res.status(200).json({
    message: "Signed in successfully",
    success: true,
    payload: { user: user },
  });
}

// HANDLE SIGN OUT
function handleSignOut(req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Internal server error, unable to sign user out.",
        success: false,
      });
    }
  });

  res.clearCookie("connect.sid");
  res.redirect("/api/v1");
}

module.exports = {
  handleGoogle,
  handleGoogleRedirect,
  handlePasswordSignUp,
  handlePasswordSignUpRedirect,
  handlePasswordSignIn,
  handlePasswordSignInRedirect,
  handleSignOut,
};
