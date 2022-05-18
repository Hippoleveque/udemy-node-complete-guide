import express from "express";

import { body } from "express-validator";
import {
  getPosts,
  createPost,
  getPost,
  updatePost,
} from "../controllers/feed.js";

const router = express.Router();

router.get("/posts", getPosts);

router.post(
  "/posts",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  createPost
);

router.get("/post/:postId", getPost);

router.put(
  "/post/:postId",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  updatePost
);

export default router;
