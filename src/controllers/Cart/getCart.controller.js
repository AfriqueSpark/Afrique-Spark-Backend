const cartModel = require("../../models/cart.model");

const getCart = async (req, res, next) => {
  const userId = req.user._id;

  const cart = await cartModel.find({ userId });

  if (!cart) {
    return res.status(404).json({
      success: true,
      message: "User doesn't have a cart yet",
    });
  }

  res.status(200).json({
    success: true,
    message: "Fetched user cart successfully",
    payload: { cart },
  });
};

module.exports = getCart;
