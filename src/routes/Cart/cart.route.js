const express = require("express");
const addToCart = require("../../controllers/Cart/addToCart.controller");
const getCart = require("../../controllers/Cart/getCart.controller");
const removeFromCart = require("../../controllers/Cart/removeFromCart.controller");

const router = express.Router();

router.route("/addToCart").post(addToCart);
router.route("/getCart").get(getCart);
router.route("/remove/product/:productId").post(removeFromCart);

module.exports = router;
