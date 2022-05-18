import Post from "../models/post.js";
import { validationResult } from "express-validator";

export const getPosts = async (req, res, next) => {
  const posts = await Post.find();
  return res.status(200).json({ posts: posts });
};

export const createPost = async (req, res, next) => {
  const { title, content } = req.body;
  const { file } = req;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const statusCode = 422;
      const message = "Something in validation went wrong";
      const err = new Error(message);
      err.statusCode = statusCode;
      throw err;
    }
    if (!file) {
      const statusCode = 422;
      const message = "File is required";
      const err = new Error(message);
      err.statusCode = statusCode;
      throw err;
    }
    let post = {
      title,
      content,
      imageUrl: file.path,
      creator: {
        name: "Hippolyte",
      },
    };
    post = new Post(post);
    await post.save();
    return res.status(201).json(post);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

export const getPost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId).exec();
    if (!post) {
      const err = new Error("Not post was found for this ID");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({ post });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};
