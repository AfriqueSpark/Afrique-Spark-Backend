const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

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

// HASH PASSWORDS, THEN STORE IN DB
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

//CHECK IF USER"S PASSWORD IS VALID
userSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

const userModel = mongoose.model("Users", userSchema);

module.exports = userModel;
