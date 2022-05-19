import Post from "../models/post.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { validationResult } from "express-validator";

const ITEMS_PER_PAGE = 2;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getPosts = async (req, res, next) => {
  console.log("GetPosts Called");
  const page = +req.query.page || 1;
  try {
    const totalPosts = await Post.find().countDocuments();
    const posts = await Post.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .exec();
    return res.status(200).json({ posts: posts, totalItems: totalPosts });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
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
    next(err);
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
    next(err);
  }
};

export const updatePost = async (req, res, next) => {
  const { postId } = req.params;
  const errors = validationResult(req);
  const { title, content } = req.body;
  let imageUrl = req.body.image;
  try {
    if (!errors.isEmpty()) {
      const statusCode = 422;
      const message = "Something in validation went wrong";
      const err = new Error(message);
      err.statusCode = statusCode;
      throw err;
    }

    const post = await Post.findById(postId).exec();
    if (!post) {
      const err = new Error("Not post was found for this ID");
      err.statusCode = 404;
      throw err;
    }
    if (req.file) {
      imageUrl = req.file.path;
    }
    if (!imageUrl) {
      const err = new Error("No file picked.");
      err.statusCode = 422;
      throw err;
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.content = content;
    post.title = title;
    post.imageUrl = imageUrl;
    const result = await post.save();
    res.status(200).json({ message: "postUpdated", post: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId).exec();
    if (!post) {
      const err = new Error("Not post was found for this ID");
      err.statusCode = 404;
      throw err;
    }
    clearImage(post.imageUrl);
    await Post.findByIdAndDelete(postId).exec();
    res.status(200).json({ message: "Post was deleted" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const clearImage = (imageUrl) => {
  const imagePath = path.join(__dirname, "..", imageUrl);
  fs.unlink(imagePath, (err) => {
    console.log(err);
  });
};
