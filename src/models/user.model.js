const mongoose = require("mongoose");

const schema = mongoose.Schema;

const userSchema = new schema({
  email: {
    type: String,
    required: [true, "An Email must be provided"],
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "A password must be provided"],
  },
  role: {
    type: String,
    enum: ["user", "model", "fashion-designers"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const userModel = mongoose.model("Users", userSchema);

module.exports = userModel;
