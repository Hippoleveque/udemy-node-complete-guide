import express from "express";
import { check } from "express-validator";
import User from "../models/user.js";

import {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
} from "../controllers/auth.js";

const router = express.Router();

router.get("/login", getLogin);

router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Invalid email address."),
    check("email").custom(async (value, { req }) => {
      const user = await User.findOne({ email: value }).exec();
      if (!user) {
        throw new Error(`There is no user with address: ${value}`);
      }
      return true;
    }),
  ],
  postLogin
);

router.post("/logout", postLogout);

router.get("/signup", getSignup);

router.post(
  "/signup",
  [
    check("email").isEmail().withMessage("Please enter a valid email."),
    check(
      "password",
      "Please enter a password at least 5 characters long."
    ).isLength({ min: 5 }),
    check("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match.");
      }
      return true;
    }),
    check("email").custom(async (value, { req }) => {
      const user = await User.findOne({ email: value }).exec();
      if (user) {
        throw new Error("This user already exists.");
      }
      return true;
    }),
  ],
  postSignup
);

router.get("/reset", getReset);

router.post("/reset", postReset);

router.get("/reset/:token", getNewPassword);

router.post("/new-password", postNewPassword);

export default router;
