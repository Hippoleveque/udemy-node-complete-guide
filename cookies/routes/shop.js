import express from "express";
import { isAuth } from "../middlewares/auth.js";

import {
  getIndex,
  getProducts,
  getProduct,
  getCart,
  postCart,
  postCartDeleteProduct,
  postOrder,
  getOrders,
} from "../controllers/shop.js";

const router = express.Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:productId", getProduct);

router.get("/cart", isAuth, getCart);

router.post("/cart", isAuth, postCart);

router.post("/cart-delete-item",isAuth, postCartDeleteProduct);

router.post("/create-order", isAuth, postOrder);

router.get("/orders", isAuth, getOrders);

export default router;
