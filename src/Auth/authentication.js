const passport = require("passport");
const dotenv = require("dotenv");

const LocalStrategy = require("passport-local").Strategy;

const userModel = require("../models/user.model");

class AuthenticationStrategy {
  constructor() {
    dotenv.config();
    this.serializeUser();
    this.deserializeUser();
    // this.google();
    this.passwordSignIn();
    this.passwordSignUp();
  }

  // SERIALIZE USERS
  serializeUser() {
    passport.serializeUser(function (user, done) {
      done(null, user);
    });
  }

  // DESERIALIZE USERS
  deserializeUser() {
    passport.deserializeUser(function (user, done) {
      done(null, user);
    });
  }

  passwordSignUp() {
    passport.use(
      "signUp",
      new LocalStrategy(
        {
          usernameField: "email",
          passwordField: "password",
          passReqToCallback: true,
        },
        async (req, email, password, done) => {
          //Get response object from request body
          const res = req.res;

          try {
            //Check if user exists
            const userExist = await userModel.exists({ email });

            if (userExist) {
              //Respond with
              res
                .status(400)
                .json({ status: false, message: "User Already Exists" });
            }

            //Construct user data
            const newUser = { email, password };

            //Save user to db
            const savedUser = await new userModel(newUser).save();

            return done(null, savedUser);
          } catch (err) {
            console.log(err);

            res.status(500).json({
              status: false,
              message: "An error occurred while trying to register user",
            });
          }
        }
      )
    );
  }

  passwordSignIn() {
    passport.use(
      "signIn",
      new LocalStrategy(
        {
          usernameField: "email",
          passwordField: "password",
          passReqToCallback: true,
        },
        async (req, email, password, done) => {
          //Get response object from request body
          const res = req.res;

          try {
            //Check if user exists
            const user = await userModel.findOne({ email });

            //If user doesn't
            if (!user) {
              //Respond with
              res
                .status(404)
                .json({ status: false, message: "User Not Found" });
            }

            //validate password
            const validate = user.isValidPassword(password);

            if (!validate) {
              res
                .status(401)
                .json({ status: false, message: "Wrong Email or Password" });
            }

            return done(null, user);
          } catch (err) {
            console.log(err);
            res.status(500).json({
              status: false,
              message: "An error occurred while trying to register user",
            });
          }
        }
      )
    );
  }
}

module.exports = AuthenticationStrategy;
