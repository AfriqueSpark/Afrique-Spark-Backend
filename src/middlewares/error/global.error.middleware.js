const errorHandler = require("../../utils/error.handler.class");

function duplicateFieldDB(err) {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new errorHandler(400, message);
}

function sendDevErrors(err, res) {
  res.status(err.statusCode || 500).json({
    success: err.success,
    message: err.message,
    error: err,
    stack: err.stack,
  });
}

function sendProdErrors(err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
    });
  } else
    [
      // 1) Log error
      console.error("AN ERROR OCCURRED", err),

      // 2) Send generic message
      res.status(500).json({
        status: "error",
        message: "Something went very wrong!",
      }),
    ];
}

const globalErrorMiddleware = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    sendDevErrors(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (error.code === 11000) error = duplicateFieldDB(error);

    sendProdErrors(err, res);
  }
};

module.exports = globalErrorMiddleware;
