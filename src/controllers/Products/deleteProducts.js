const { validateIds } = require("../../utils/validateUserInput");
const productModel = require("../../models/product.model");
const errorHandler = require("../../utils/error.handler.class");

const deleteVendorProducts = async (req, res, next) => {
  const { error } = validateIds(req.body);

  if (error) {
    return res.status(400).json({ success: false, message: error });
  }
  try {
    const { productIds } = req.body;

    const products = await productModel.find({ vendorId: req.user._id });

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Products not found" });
    }

    await productModel.deleteMany({ _id: { $in: productIds } });

    return res
      .status(200)
      .json({ success: true, message: "Products deleted successfully" });
  } catch (err) {
    console.log(err);
    next(new errorHandler(500, "Failed to delete products"));
  }
};

module.exports = deleteVendorProducts;
