const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    products: [
      {
        productId: { type: mongoose.Types.ObjectId, ref: "Products" },
        quantity: {
          type: Number,
          required: [true, "Product quantity must be provided"],
        },
        name: {
          type: String,
          required: [true, "A product name must be provided"],
        },
        price: {
          type: Number,
          required: [true, "Product price is required"],
          min: [0, "The minimum price shouldn't be below zero"],
        },
      },
    ],
    totalPrice: {
      type: Number,
      min: [0, "The minimum price shouldn't be below zero"],
      required: true,
    },
  },
  { timestamps: true }
);

const cartModel = mongoose.model("Cart", cartSchema);

module.exports = cartModel;
