const passport = require("passport");
const dotenv = require("dotenv");

const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-custom").Strategy;
const { OAuth2Client } = require("google-auth-library");
//Google client id
const client = new OAuth2Client();

const userModel = require("../models/user.model");

class AuthenticationStrategy {
  constructor() {
    dotenv.config();
    this.serializeUser();
    this.deserializeUser();
    this.google();
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

  google() {
    passport.use(
      "google",
      new GoogleStrategy(async (request, done) => {
        //Get response object from request object
        const res = request.res;

        try {
          const { token } = request.body;

          console.log(token);

          const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
          });

          const { sub, name, email } = ticket.getPayload();

          console.log("The profile is:", sub);

          // If an email was not returned by Google
          if (!email) {
            return res.status(500).json({
              success: false,
              message: "Internal server error, email not returned by Google.",
            });
          }

          const user = await userModel.findOne({ email });

          //If a user already exists
          if (user) {
            //Sign user in
            return done(null, user);
          }

          //create a new user
          let newUser = {
            email: email,
            password: sub,
            username: name,
          };

          //Save user to DB
          const savedUser = await new userModel(newUser).save();

          console.log("user signed in with google");

          return done(null, savedUser);
        } catch (err) {
          console.log(err);
          return res.status(500).json({
            success: false,
            message: "An error occurred while signing user in",
          });
        }
      })
    );
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
              return res
                .status(400)
                .json({ status: false, message: "User Already Exists" });
            }

            //Construct user data
            const newUser = { email, password };

            //Save user to db
            const savedUser = await new userModel(newUser).save();

            console.log("user signed up");

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
              return res
                .status(404)
                .json({ status: false, message: "User Not Found" });
            }

            //validate password
            const validate = user.isValidPassword(password);

            if (!validate) {
              return res
                .status(401)
                .json({ status: false, message: "Wrong Email or Password" });
            }

            console.log("User signed in");

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
