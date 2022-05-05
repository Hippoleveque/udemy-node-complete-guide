import Post from "../models/post.js";
import { validationResult } from "express-validator";

export const getPosts = async (req, res, next) => {
  const posts = await Post.find();
  return res.status(200).json({ posts: posts });
};

export const createPost = async (req, res, next) => {
  const { title, content } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Something went wrong.", errors: errors.array() });
  }
  let post = {
    title,
    content,
    creator: {
      name: "Hippolyte",
    },
  };
  post = new Post(post);
  await post.save();
  return res.status(201).json(post);
};
