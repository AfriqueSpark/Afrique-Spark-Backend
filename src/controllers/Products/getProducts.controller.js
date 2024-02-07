const productModel = require("../../models/product.model");

const getProducts = async (req, res, next) => {
  try {
    const product = await productModel.find({});

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      payload: product,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getProducts;
