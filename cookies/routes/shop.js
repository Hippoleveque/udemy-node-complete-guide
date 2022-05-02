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
  getInvoice,
  getCheckout,
  getCheckoutSuccess,
} from "../controllers/shop.js";

const router = express.Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:productId", getProduct);

router.get("/cart", isAuth, getCart);

router.post("/cart", isAuth, postCart);

router.post("/cart-delete-item", isAuth, postCartDeleteProduct);

router.post("/create-order", isAuth, postOrder);

router.get("/orders", isAuth, getOrders);

router.get("/orders/:orderId", isAuth, getInvoice);

router.get("/checkout", isAuth, getCheckout);

router.get("/checkout/success", isAuth, getCheckoutSuccess);

router.get("/checkout/cancel", isAuth, getCheckout);

export default router;
