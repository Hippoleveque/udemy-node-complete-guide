import User from "../models/user.js";
import bcrypt from "bcrypt";

const createUser = async ({ inputData }, req) => {
  const { email, name, password } = inputData;
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

export const root = {
  createUser,
};
