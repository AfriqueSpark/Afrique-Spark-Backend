const productModel = require("../../models/product.model");
const ApiFeatures = require("../../utils/ApiFeatures");
const errorHandler = require("../../utils/error.handler.class");
const { validateProductId } = require("../../utils/validateUserInput");

const getAllProducts = async (req, res, next) => {
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

const getProduct = async (req, res, next) => {
  const { productId } = req.params;

  const { error } = validateProductId(productId);

  if (error) {
    const errorMessage = error.details[0].message.replace(/"/g, ""); // strip out quotes
    return next(new errorHandler(400, errorMessage));
  }

  try {
    const features = new ApiFeatures(
      productModel.find({ _id: productId }),
      req.query
    ).limitFields();

    const product = await features.query;

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      payload: product,
    });
  } catch (err) {
    next(err);
  }
};

const getVendorProducts = async (req, res, next) => {
  try {
    const features = new ApiFeatures(
      productModel.find({ vendorId: req.user._id }),
      req.query
    ).limitFields();

    const product = await features.query;

    if (!product || product.length === 0) {
      return res.status(200).json({
        success: true,
        message: "You have no products uploaded yet",
      });
    }

    res.status(200).json({
      success: true,
      results: product.length,
      message: "Your Products fetched successfully",
      payload: product,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllProducts, getVendorProducts, getProduct };
