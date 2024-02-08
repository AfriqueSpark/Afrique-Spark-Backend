const ProductModel = require("../../models/product.model");

const CartModel = require("../../models/cart.model");

const errorHandler = require("../../utils/error.handler.class");
const { validateAddToCart } = require("../../utils/validateUserInput");

const addToCart = async (req, res, next) => {
  //Validate request body
  const { error } = validateAddToCart(req.body);

  if (error) {
    return next(new errorHandler(400, error));
  }

  try {
    const { productId, quantity } = req.body;

    const userId = req.user._id;

    const product = await ProductModel.findOne({ _id: productId });

    if (!product) {
      return next(new errorHandler(404, "Product not found"));
    }

    //Calculate product total price
    const productPrice = product.price * quantity;

    let cart = await CartModel.findOne({ userId });

    //User already as a cart
    if (cart) {
      //Get index of product in the cart
      let itemIndex = cart.products.findIndex((p) => p.productId == productId);

      //Product already exists
      if (itemIndex > -1) {
        const productItem = cart.products[itemIndex];

        productItem.quantity = quantity;

        productItem.price = productPrice;

        //Get total price of all products
        cart.totalPrice = cart.products
          .map((item) => item.price)
          .reduce((acc, next) => acc + next);
      } else {
        //Add new product to cart
        cart.products.push({
          productId,
          name: product.name,
          price: productPrice,
          quantity,
        });

        //Get total price of all products
        cart.totalPrice = cart.products
          .map((item) => item.price)
          .reduce((acc, next) => acc + next);
      }

      //Save the cart
      cart = await cart.save();

      res.status(200).json(cart);
    } else {
      //User doesn't have a cart, Create a new cart
      const newCart = await new CartModel({
        userId,
        products: [
          { productId, name: product.name, price: productPrice, quantity },
        ],
        totalPrice: productPrice,
      }).save();

      res.status(201).json(newCart);
    }
  } catch (err) {
    return next(err);
  }
};

module.exports = addToCart;
