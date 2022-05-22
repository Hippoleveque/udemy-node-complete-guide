import User from "../models/user.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import "dotenv/config";

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

export const root = {
  createUser,
  login
};
