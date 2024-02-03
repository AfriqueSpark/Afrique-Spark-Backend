class errorHandler extends Error {
  constructor(statusCode, message) {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode >= 400 ? false : true;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = errorHandler;
