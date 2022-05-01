import express from "express";
import { check } from "express-validator";

import { isAuth } from "../middlewares/auth.js";
import {
  getAddProduct,
  getProducts,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} from "../controllers/admin.js";

const router = express.Router();

router.get("/add-product", isAuth, getAddProduct);

router.get("/products", isAuth, getProducts);

router.post(
  "/add-product",
  isAuth,
  [
    check("title")
      .isLength({ max: 15 })
      .withMessage("Title must not exceed 15 characters."),
    check("description")
      .isLength({ max: 150 })
      .withMessage("Description must not exceed 150 characters."),
  ],
  postAddProduct
);

router.get("/edit-product/:productId", isAuth, getEditProduct);

router.post(
  "/edit-product",
  isAuth,
  [
    check("title")
      .isLength({ max: 15 })
      .withMessage("Title must not exceed 15 characters."),
    check("imageUrl").isURL().withMessage("ImageUrl must be a valid url."),
    check("description")
      .isLength({ max: 150 })
      .withMessage("Description must not exceed 150 characters."),
  ],
  postEditProduct
);

router.post("/delete-product", isAuth, postDeleteProduct);

export default router;
