const express = require("express");
const passport = require("passport");
const compression = require("compression");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const session = require("express-session");
const RedisStore = require("connect-redis").default;
const redis = require("redis");

const welcomeToApi = require("./middlewares/welcome.middleware");
const checkApiVersion = require("./middlewares/checkApiVersion.middleware");
const { userRoute } = require("./routes/user.route");
const logger = require("./utils/logger");
const authRoute = require("./routes/Auth/auth.route");
const isAuthenticated = require("./middlewares/checkAuthentication");
const globalErrorMiddlware = require("./middlewares/error/global.error.middleware");

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "http://localhost:5500",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

//Redis connection client
const redisClient = redis.createClient({ url: process.env.REDIS_URL });

//connect to redis
redisClient.connect().catch(console.error);

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
});

// MANAGE COOKIE SESSIONS
app.use(
  session({
    genid: () => {
      return uuidv4();
    },
    store: redisStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 120 * 60 * 60 * 1000, // expires in two-days
      secure: false,
      sameSite: false,
    },
  })
);

//For setting secure headers
app.use(helmet());

app.use(passport.authenticate("session"));

//Initialize Passport
app.use(passport.initialize());

//Session for passport
app.use(passport.session());

//Prevent no-sql injection
app.use(mongoSanitize({ allowDots: true }));

//For compressing response body
app.use(compression());

//For logging
app.use(logger());

app.get("/api/v:version", checkApiVersion, welcomeToApi);

//AUTH ROUTES
app.use("/api/v:version/auth", checkApiVersion, authRoute);

//USER'S ROUTES
app.use("/api/v:version/users", checkApiVersion, isAuthenticated, userRoute);

app.all("*", (_, res) => {
  res.status(404).json({
    message: "Undefined API endpoint accessed.",
    success: false,
  });
});

//GLOBAL ERROR HANDLER MIDDLEWARE
app.use(globalErrorMiddlware);

module.exports = { app, redisClient };
