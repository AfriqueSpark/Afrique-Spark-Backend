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
const globalErrorMiddleware = require("./middlewares/error/global.error.middleware");
const productRoute = require("./routes/Products/product.route");
const vendorRoute = require("./routes/Products/vendor.route");
const cartRoute = require("./routes/Cart/cart.route");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5500",
      "http://localhost:3000",
      "https://afriquespark-tsbp.onrender.com",
      "https://localhost:5500",
      "https://localhost:3000",
      "https://localhost:5173",
      "https://localhost:8080",
      "http://localhost:5173",
      "http://localhost:8080",
      "https://afrique-spark.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.set("trust proxy", 1);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

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
    proxy: true,
    cookie: {
      httpOnly: true,
      maxAge: 120 * 60 * 60 * 1000, // expires in five-days
      secure: process.env.NODE_ENV === "development" ? false : true,
      sameSite: process.env.NODE_ENV === "development" ? false : "none",
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

//PRODUCT ROUTES
app.use(
  "/api/v:version/products",
  checkApiVersion,
  isAuthenticated,
  productRoute
);

//CART ROUTES
app.use("/api/v:version/cart", checkApiVersion, isAuthenticated, cartRoute);

//VENDOR ROUTES
app.use("/api/v:version/vendor", checkApiVersion, isAuthenticated, vendorRoute);

//USER'S ROUTES
app.use("/api/v:version/users", checkApiVersion, isAuthenticated, userRoute);

app.all("*", (_, res) => {
  res.status(404).json({
    message: "Undefined API endpoint accessed.",
    success: false,
  });
});

//GLOBAL ERROR HANDLER MIDDLEWARE
app.use(globalErrorMiddleware);

module.exports = { app, redisClient };
