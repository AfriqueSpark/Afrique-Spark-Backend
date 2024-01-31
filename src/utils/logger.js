require("colors");
const morgan = require("morgan");

morgan.token("method", function (req) {
  switch (req.method) {
    case "POST":
      return req.method.yellow;

    case "PUT":
      return req.method.blue;

    case "DELETE":
      return req.method.red;

    default:
      return req.method.green;
  }
});

const logger = () =>
  morgan(":method :url :status :response-time ms - :res[content-length]");

module.exports = logger;
