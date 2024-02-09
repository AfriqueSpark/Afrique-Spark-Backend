const express = require("express");

const {
  getProducts,
} = require("../../controllers/Products/getProducts.controller");

const router = express.Router();

router.route("/").get(getProducts);

module.exports = router;
