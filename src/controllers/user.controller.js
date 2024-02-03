const user = require("../models/user.model");

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

module.exports = { getUserData, createUser, deleteUsers };
