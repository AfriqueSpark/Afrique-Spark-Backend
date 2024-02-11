const CartModel = require("../../models/cart.model");
const errorHandler = require("../../utils/error.handler.class");
const { validateProductId } = require("../../utils/validateUserInput");

const removeFromCart = async (req, res, next) => {
  const { productId } = req.params;

  const { error } = validateProductId(productId);

  if (error) {
    const errorMessage = error.details[0].message.replace(/"/g, ""); // strip out quotes
    return next(new errorHandler(400, errorMessage));
  }

  try {
    const userId = req.user._id;

    let cart = await CartModel.findOne({ userId });

    if (!cart || cart.length === 0) {
      return next(new errorHandler(404, "User doesn't have a cart"));
    }

    //Get index of the product in the products array
    const itemIndex = cart.products.findIndex((p) => p.productId == productId);

    //If product Exist
    if (itemIndex > -1) {
      //Delete product from cart
      cart.products.splice(itemIndex, 1);

      //Get total price of all products
      cart.totalPrice = cart.products
        .map((item) => item.price)
        .reduce((acc, next) => acc + next);
    } else {
      return next(new errorHandler(404, "Product doesn't exist in the cart"));
    }

    cart = await cart.save();

    res.status(200).json({
      success: true,
      message: "Product Successfully Removed",
      payload: { cart },
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = removeFromCart;
