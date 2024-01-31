const dotenv = require("dotenv");
const passport = require("passport");
const validateEmailPasswordInput = require("../../utils/validateUserInput");
const AuthenticationStrategy = require("../../Auth/authentication");

dotenv.config();

//passport authentication strategies
new AuthenticationStrategy();

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
  res.status(200).json({
    message: "Signup successful",
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
  res.status(200).json({
    message: "SignIn successful",
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

  processLogger("Successfully signed user out.");

  res.clearCookie("connect.sid");
  res.redirect("/api/v1");
}

module.exports = {
  handlePasswordSignUp,
  handlePasswordSignUpRedirect,
  handlePasswordSignIn,
  handlePasswordSignInRedirect,
  handleSignOut,
};
