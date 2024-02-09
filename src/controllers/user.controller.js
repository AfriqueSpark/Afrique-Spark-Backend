const user = require("../models/user.model");
const errorHandler = require("../utils/error.handler.class");
const { validateUserRoleUpdate } = require("../utils/validateUserInput");

const getUserData = async (req, res) => {
  try {
    const userData = await user.find({});

    res.status(200).json({
      status: true,
      message: "Successfully fetched users data",
      data: userData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching users",
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email && !password) {
      res
        .status(400)
        .json({ status: false, message: "No email or password provided" });
    }

    const user = new user({ email, password });

    await user.save();

    res.status(201).json({
      status: true,
      message: "Successfully created user",
      data: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: "An error ocurred while creating the user",
    });
  }
};

//WARNING: WILL CLEAR ALL THE DATA IN THE DATABASE
const deleteUsers = async (req, res) => {
  try {
    await user.deleteMany({});

    res.status(200).json({
      status: true,
      message: "Successfully cleared the db",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: "An error ocurred while deleting users",
    });
  }
};

const updateRole = async (req, res, next) => {
  const { error } = validateUserRoleUpdate(req.body);

  if (error) {
    return next(new errorHandler(400, error));
  }

  try {
    const { role, address, phoneNumber } = req.body;

    const updatedUser = await user.findByIdAndUpdate(
      req.user._id,
      { role, address, phoneNumber, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return next(new errorHandler(404, "user to be updated doesn't exist"));
    }

    req.session.user = updatedUser;

    res.status(200).json({
      success: true,
      message: "updated user role successfully",
      payload: { updatedUser },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUserData, createUser, deleteUsers, updateRole };
