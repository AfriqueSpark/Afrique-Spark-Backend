const express = require("express");

const multer = require("multer");

const {
  uploadProduct,
} = require("../../controllers/Products/uploadProduct.controller");

const router = express.Router();

// Setting up multer as a middleware to grab photo uploads
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router
  .route("/upload-product")
  .post(upload.single("productImage"), uploadProduct);

module.exports = router;
