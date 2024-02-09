const express = require("express");

const multer = require("multer");

const router = express.Router();

const {
  uploadProduct,
} = require("../../controllers/Products/uploadProduct.controller");

const {
  getVendorProducts,
} = require("../../controllers/Products/getProducts.controller");

// Setting up multer as a middleware to grab photo uploads
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router
  .route("/upload-product")
  .post(upload.single("productImage"), uploadProduct);

router.route("/products").get(getVendorProducts);

module.exports = router;