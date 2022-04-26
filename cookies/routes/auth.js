import express from "express";

import {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset,
  postReset
} from "../controllers/auth.js";

const router = express.Router();

router.get("/login", getLogin);

router.post("/login", postLogin);

router.post("/logout", postLogout);

router.get("/signup", getSignup);

router.post("/signup", postSignup);

router.get("/reset", getReset);

router.post("/reset", postReset);

export default router;
