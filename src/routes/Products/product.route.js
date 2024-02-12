const express = require("express");

const {
  getAllProducts,
  getProduct,
} = require("../../controllers/Products/getProducts.controller");

const router = express.Router();

router.route("/").get(getAllProducts);
router.route("/:productId").get(getProduct);

module.exports = router;
