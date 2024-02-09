const errorHandler = require("../../utils/error.handler.class");

function handleCastErrorDB(err) {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new errorHandler(message, 400);
}

function duplicateFieldDB(err) {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new errorHandler(400, message);
}

function handleValidationErrorDB(err) {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new errorHandler(message, 400);
}

function sendDevErrors(err, req, res, next) {
  return res.status(err.statusCode || 500).json({
    success: err.success,
    message: err.message,
    error: err,
    stack: err.stack,
  });
}

function sendProdErrors(err, req, res) {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        success: err.success,
        message: err.message,
      });
    }
  }
  // 1) Log error
  console.error("AN ERROR OCCURRED", err),
    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
}

const globalErrorMiddleware = (err, req, res, n) => {
  if (process.env.NODE_ENV === "development") {
    sendDevErrors(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = duplicateFieldDB(error);

    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);

    sendProdErrors(error, req, res);
  }
};

module.exports = globalErrorMiddleware;
