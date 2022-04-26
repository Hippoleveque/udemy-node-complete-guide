import express from "express";

import {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset,
  postReset,
  getResetPassword,
  postResetPassword,
} from "../controllers/auth.js";

const router = express.Router();

router.get("/login", getLogin);

router.post("/login", postLogin);

router.post("/logout", postLogout);

router.get("/signup", getSignup);

router.post("/signup", postSignup);

router.get("/reset", getReset);

router.get("/reset-password/:linkId", getResetPassword);

router.post("/reset-password", postResetPassword);

router.post("/reset", postReset);

export default router;
