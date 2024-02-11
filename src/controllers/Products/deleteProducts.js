const { validateIds } = require("../../utils/validateUserInput");
const productModel = require("../../models/product.model");
const errorHandler = require("../../utils/error.handler.class");

const deleteVendorProducts = async (req, res, next) => {
  const { error } = validateIds(req.body);

  if (error) {
    const errorMessage = error.details[0].message.replace(/"/g, ""); // strip out quotes
    return res.status(400).json({ success: false, message: errorMessage });
  }
  try {
    const { productIds } = req.body;

    await productModel
      .deleteMany({ _id: { $in: productIds }, vendorId: req.user._id })
      .then((result) => {
        if (result.deletedCount === 0) {
          return res.status(404).json({
            success: false,
            message:
              "No products belonging to the vendor were found to delete.",
          });
        } else {
          return res.status(200).json({
            success: true,
            message: `${result.deletedCount} products deleted successfully.`,
          });
        }
      });
  } catch (err) {
    console.log(err);
    next(new errorHandler(500, "Failed to delete products"));
  }
};

module.exports = deleteVendorProducts;
