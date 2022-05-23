import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { validationResult } from "express-validator";

export const signup = async (req, res, next) => {
  const { email, name, password } = req.body;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const statusCode = 422;
      const message = "Credentials are incorrect";
      const err = new Error(message);
      err.statusCode = statusCode;
      throw err;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, name, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User has been created", user: user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      const err = new Error("No user with this email address");
      err.statusCode = 401;
      throw err;
    }
    if (!(await bcrypt.compare(password, user.password))) {
      const err = new Error("Invalid password");
      err.statusCode = 401;
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
    res.status(200).json({ token, userId: user._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
