const express = require("express");
const {
  getProducts,
  getCart,
  getShop,
  getCheckout,
  getOrders,
} = require("../controllers/shop");

const router = express.Router();

router.get("/", getShop);
router.get("/cart", getCart);
router.get("/products", getProducts);
router.get("/checkout", getCheckout);
router.get("/orders", getOrders);

module.exports = router;
