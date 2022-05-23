import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import "dotenv/config";

import User from "../models/user.js";
import Post from "../models/post.js";
import { clearImage } from "../middlewares/images.js";

const ITEMS_PER_PAGE = 2;

const createUser = async ({ inputData }, req) => {
  const { email, name, password } = inputData;
  const validationErrs = [];
  if (!validator.isEmail(email)) {
    validationErrs.push({ message: "Email is invalid" });
  }
  if (
    validator.isEmpty(password) ||
    !validator.isLength(password, { min: 5 })
  ) {
    validationErrs.push({ message: "Password too short" });
  }
  if (validationErrs.length > 0) {
    const err = new Error("Invalid Input.");
    err.data = validationErrs;
    err.code = 422;
    throw err;
  }
  try {
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      const error = new Error("A user with this mail address already exists");
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPassword, name });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

const login = async ({ email, password }, req) => {
  const validationErrs = [];
  if (!validator.isEmail(email)) {
    validationErrs.push({ message: "Email is invalid" });
  }
  if (
    validator.isEmpty(password) ||
    !validator.isLength(password, { min: 5 })
  ) {
    validationErrs.push({ message: "Password too short" });
  }
  if (validationErrs.length > 0) {
    const err = new Error("Invalid Input.");
    err.data = validationErrs;
    err.code = 422;
    throw err;
  }
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      const error = new Error("User not found");
      error.code = 404;
      throw err;
    }
    if (!(await bcrypt.compare(password, user.password))) {
      const err = new Error("Invalid password");
      err.code = 401;
      throw err;
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return { userId: user._id.toString(), token };
  } catch (err) {
    if (!err.statusCode) {
      err.code = 500;
    }
    throw err;
  }
};

const createPost = async ({ inputData }, req) => {
  const { title, content, imageUrl } = inputData;
  const { isAuthenticated, userId } = req;
  const validationErrs = [];
  if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
    validationErrs.push({ message: "Title too short." });
  }
  if (validator.isEmpty(content) || !validator.isLength(content, { min: 5 })) {
    validationErrs.push({ message: "Content too short." });
  }
  if (validationErrs.length > 0) {
    const err = new Error("Invalid Input.");
    err.data = validationErrs;
    err.code = 422;
    throw err;
  }
  if (!isAuthenticated) {
    const error = new Error("Not Authenticated");
    error.code = 401;
    throw error;
  }
  try {
    const creator = await User.findById(userId).exec();
    if (!creator) {
      const error = new Error("Invalid User");
      error.code = 401;
      throw error;
    }
    let post = {
      title,
      content,
      imageUrl,
      creator: userId,
    };
    post = new Post(post);
    const createdPost = await post.save();

    creator.posts.push(post);
    await creator.save();
    return {
      ...createdPost._doc,
      _id: createdPost._doc._id.toString(),
      creator: { ...creator._doc, _id: creator._doc._id.toString() },
      updatedAt: createdPost._doc.updatedAt.toISOString(),
      createdAt: createdPost._doc.createdAt.toISOString(),
    };
  } catch (err) {
    if (!err.code) {
      err.code = 500;
    }
    throw err;
  }
};

const posts = async ({ page }, req) => {
  const queryPage = page || 1;
  const { isAuthenticated } = req;
  if (!isAuthenticated) {
    const error = new Error("Not Authenticated");
    error.code = 401;
    throw error;
  }
  try {
    const totalPosts = await Post.find().countDocuments();
    let posts = await Post.find()
      .populate("creator")
      .sort({ createdAt: -1 })
      .skip((queryPage - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .exec();
    posts = posts.map((el) => {
      return {
        ...el._doc,
        _id: el._doc._id.toString(),
        updatedAt: el._doc.updatedAt.toISOString(),
        createdAt: el._doc.createdAt.toISOString(),
      };
    });
    return { posts, totalItems: totalPosts };
  } catch (err) {
    if (!err.code) {
      err.code = 500;
    }
    next(err);
  }
};

const post = async ({ postId }, req) => {
  const { isAuthenticated } = req;
  if (!isAuthenticated) {
    const error = new Error("Not Authenticated");
    error.code = 401;
    throw error;
  }
  try {
    const post = await Post.findById(postId).populate("creator").exec();
    if (!post) {
      const err = new Error("No post was found for this ID");
      err.code = 404;
      throw err;
    }
    return {
      ...post._doc,
      _id: post._doc._id.toString(),
      updatedAt: post._doc.updatedAt.toISOString(),
      createdAt: post._doc.createdAt.toISOString(),
    };
  } catch (err) {
    if (!err.code) {
      err.code = 500;
    }
    throw err;
  }
};

export const updatePost = async ({ postId, inputData }, req) => {
  const { title, content, imageUrl } = inputData;
  const { userId, isAuthenticated } = req;
  const validationErrs = [];
  if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
    validationErrs.push({ message: "Title too short." });
  }
  if (validator.isEmpty(content) || !validator.isLength(content, { min: 5 })) {
    validationErrs.push({ message: "Content too short." });
  }
  if (validationErrs.length > 0) {
    const err = new Error("Invalid Input.");
    err.data = validationErrs;
    err.code = 422;
    throw err;
  }
  if (!isAuthenticated) {
    const error = new Error("Not Authenticated");
    error.code = 401;
    throw error;
  }
  try {
    const post = await Post.findById(postId).exec();
    if (!post) {
      const err = new Error("Not post was found for this ID");
      err.code = 404;
      throw err;
    }
    if (post.creator._id.toString() !== userId) {
      const err = new Error("You are not the author of this post !");
      err.statusCode = 401;
      throw err;
    }
    post.content = content;
    post.title = title;
    post.imageUrl = imageUrl;
    const creator = await User.findById(userId).exec();
    const createdPost = await post.save();
    return {
      ...createdPost._doc,
      _id: createdPost._doc._id.toString(),
      creator: { ...creator._doc, _id: creator._doc._id.toString() },
      updatedAt: createdPost._doc.updatedAt.toISOString(),
      createdAt: createdPost._doc.createdAt.toISOString(),
    };
  } catch (err) {
    if (!err.code) {
      err.code = 500;
    }
    throw err;
  }
};

export const deletePost = async ({ postId }, req) => {
  const { userId, isAuthenticated } = req;
  if (!isAuthenticated) {
    const error = new Error("Not Authenticated");
    error.code = 401;
    throw error;
  }
  try {
    const post = await Post.findById(postId).populate("creator").exec();
    if (!post) {
      const err = new Error("Not post was found for this ID");
      err.statusCode = 404;
      throw err;
    }
    if (post.creator._id.toString() !== userId.toString()) {
      const err = new Error("You are not the author of this post !");
      err.code = 401;
      throw err;
    }
    clearImage(post.imageUrl);
    await Post.findByIdAndDelete(postId).exec();
    const user = await User.findById(userId).exec();
    user.posts.pull(postId);
    await user.save();
    return {
      ...post._doc,
      _id: post._doc._id.toString(),
      creator: { ...post._doc.creator, _id: post._doc.creator._id.toString() },
      updatedAt: post._doc.updatedAt.toISOString(),
      createdAt: post._doc.createdAt.toISOString(),
    };
  } catch (err) {
    if (!err.code) {
      err.code = 500;
    }
    throw err;
  }
};

const updateStatus = async ({ newStatus }, req) => {
  const { userId, isAuthenticated } = req;
  if (!isAuthenticated) {
    const error = new Error("Not Authenticated");
    error.code = 401;
    throw error;
  }
  try {
    const user = await User.findById(userId).exec();
    user.status = newStatus;
    const updatedUser = await user.save();
    return { ...updatedUser._doc, _id: updatedUser._doc._id.toString() };
  } catch (err) {
    if (!err.code) {
      err.code = 500;
    }
    throw err;
  }
};

const status = async (_, req) => {
  const { userId, isAuthenticated } = req;
  if (!isAuthenticated) {
    const error = new Error("Not Authenticated");
    error.code = 401;
    throw error;
  }
  try {
    const user = await User.findById(userId).exec();
    return user.status;
  } catch (err) {
    if (!err.code) {
      err.code = 500;
    }
    throw err;
  }
};

export const root = {
  createUser,
  login,
  createPost,
  posts,
  post,
  updatePost,
  deletePost,
  updateStatus,
  status,
};
