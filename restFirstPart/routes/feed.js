import express from "express";

import { body } from "express-validator";
import {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  updateStatus,
  getStatus,
} from "../controllers/feed.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.get("/posts", isAuth, getPosts);

router.post(
  "/posts",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  isAuth,
  createPost
);

router.get("/post/:postId", isAuth, getPost);

router.put(
  "/post/:postId",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  isAuth,
  updatePost
);

router.delete("/post/:postId", isAuth, deletePost);

router.get("/status", isAuth, getStatus);

router.post(
  "/status",
  [body("status").trim().isLength({ min: 5 })],
  isAuth,
  updateStatus
);

export default router;
