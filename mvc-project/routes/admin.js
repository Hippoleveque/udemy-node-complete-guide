const express = require("express");

const router = express.Router();

const {
  getAddProduct,
  postAddProduct,
  getAdminProducts,
  postDeleteProduct
} = require("../controllers/admin");

// /admin/add-product => GET
router.get("/add-product", getAddProduct);

// /admin/add-product => POST
router.post("/add-product", postAddProduct);

router.post("/delete-product", postDeleteProduct);

router.get("/products", getAdminProducts);

exports.routes = router;
