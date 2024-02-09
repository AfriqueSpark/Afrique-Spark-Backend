const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const schema = mongoose.Schema;

const userSchema = new schema({
  fullname: {
    type: String,
    required: [true, "Full name must be provided"],
  },
  email: {
    type: String,
    required: [true, "An Email must be provided"],
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "A password must be provided"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
  },
  username: {
    type: String,
    default: "Anonymous",
  },
  role: {
    type: String,
    enum: ["user", "model", "vendor"],
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

// HASH PASSWORDS, THEN STORE IN DB
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

//CHECK IF USER"S PASSWORD IS VALID
userSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

const userModel = mongoose.model("Users", userSchema);

module.exports = userModel;
