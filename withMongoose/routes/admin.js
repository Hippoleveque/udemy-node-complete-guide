import path from "path";

import express from "express";

import {
  getAddProduct,
  getProducts,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} from "../controllers/admin.js";

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', getAddProduct);

// // /admin/products => GET
// router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', postAddProduct);

// router.get('/edit-product/:productId', adminController.getEditProduct);

// router.post('/edit-product', adminController.postEditProduct);

// router.post('/delete-product', adminController.postDeleteProduct);

export default router;
