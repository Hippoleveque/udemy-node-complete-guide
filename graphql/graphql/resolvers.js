import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import "dotenv/config";

import User from "../models/user.js";
import Post from "../models/post.js";

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
  const { isAuthenticated, userId, file } = req;
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
  //   if (!file) {
  //     const error = new Error("File is required");
  //     error.code = 422;
  //     throw err;
  //   }
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

export const root = {
  createUser,
  login,
  createPost,
  posts,
};
