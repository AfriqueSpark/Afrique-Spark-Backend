const { validateIds } = require("../../utils/validateUserInput");

const deleteVendorProducts = async (req, res, next) => {
  const { error } = validateIds(req.body);

  if (error) {
    return res.status(400).json({ success: false, message: error });
  }
  try {
    const { productIds } = req.body;

    const products = await productModel.find({ vendorId: req.user._id });

    if (!products) {
      return res
        .status(404)
        .json({ success: false, message: "Products not found" });
    }

    await productModel.deleteMany({ _id: { $in: productIds } }, (err) => {
      if (err) {
        console.error(err);
        // Send an error response if deletion fails
        return res
          .status(500)
          .json({ success: false, message: "Failed to delete products" });
      }
      // Send a success response if deletion succeeds
      return res
        .status(200)
        .json({ success: true, message: "Products deleted successfully" });
    });
  } catch (err) {
    next(err);
  }
};

module.exports = deleteVendorProducts;
