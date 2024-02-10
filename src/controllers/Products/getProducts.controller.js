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

module.exports = { getProducts, getVendorProducts };
