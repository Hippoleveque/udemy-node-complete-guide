import express from "express";
import { body, check } from "express-validator";
import User from "../models/user.js";

import { login, signup } from "../controllers/auth.js";

const router = express.Router();

router.put(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value }).exec();
        if (user) {
          throw new Error("This user already exists.");
        }
        return true;
      })
      .normalizeEmail(),
    check(
      "password",
      "Please enter a password at least 5 characters long."
    ).isLength({ min: 5 }),
    check(
      "name",
      "Please enter a password at least 3 characters long."
    ).isLength({ min: 3 }),
  ],
  signup
);

router.post(
    "/login",
    [
      check("email")
        .isEmail()
        .withMessage("Please enter a valid email.")
        .normalizeEmail(),
      check(
        "password",
        "Please enter a password at least 5 characters long."
      ).isLength({ min: 5 }),
    ],
    login
  );
  

export default router;