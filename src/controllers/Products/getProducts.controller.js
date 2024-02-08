const productModel = require("../../models/product.model");
const ApiFeatures = require("../../utils/ApiFeatures");

const getProducts = async (req, res, next) => {
  try {
    const features = new ApiFeatures(
      productModel.find(),
      req.query
    ).limitFields();

    const product = await features.query;

    res.status(200).json({
      success: true,
      results: product.length,
      message: "Products fetched successfully",
      payload: product,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getProducts;
