import User from "../models/user.js";
import bcrypt from "bcryptjs";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import { validationResult } from "express-validator";
import "dotenv/config";

sgMail.setApiKey(process.env.SENDGRID_KEY);

export const getLogin = (req, res, next) => {
  const errorMessage = req.flash("error");
  const infoMessage = req.flash("info");
  return res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: errorMessage,
    infoMessage: infoMessage,
    oldInput: {
      email: "",
      password: "",
    },
  });
};

export const postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: errors.array()[0].msg,
        infoMessage: "",
        oldInput: {
          email,
          password,
        },
      });
    }
    const user = await User.findOne({ email: email }).exec();
    if (await bcrypt.compare(password, user.password)) {
      req.session.user = user;
      req.session.isLoggedIn = true;
      await req.session.save();
      return res.redirect("/");
    }
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: "Invalid email / password",
      oldInput: {
        email,
        password,
      },
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

export const postLogout = async (req, res, next) => {
  try {
    await req.session.destroy();
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};

export const getSignup = (req, res, next) => {
  const errorMessage = req.flash("error");
  return res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: errorMessage,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
};

export const postSignup = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0],
      oldInput: {
        email,
        password,
        confirmPassword,
      },
    });
  }
  let user = await User.findOne({ email: email }).exec();
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    user = User({ email, password: hashedPassword, cart: { items: [] } });
    await user.save();
    const msg = {
      to: email,
      from: "hippolyte.leveque@gmail.com",
      subject: "Automation test",
      text: "Welcome",
      html: "<strong>Welcome</strong>",
    };
    await sgMail.send(msg);
    return res.redirect("/login");
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

export const getReset = (req, res, next) => {
  const errorMessage = req.flash("error");
  return res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: errorMessage,
  });
};

export const postReset = async (req, res, next) => {
  const { email } = req.body;
  const buffer = crypto.randomBytes(32);
  const token = buffer.toString("hex");
  try {
    let user = await User.findOne({ email: email }).exec();
    if (!user) {
      req.flash("error", "Invalid email / password");
      return res.redirect("/reset");
    }
    user.resetPwdToken = token;
    user.resetPwdTokenExpirationDate = Date.now() + 3600000;
    const msg = {
      to: email,
      from: "hippolyte.leveque@gmail.com",
      subject: "Reset password",
      text: "Reset password",
      html: `Click this <a href="${process.env.HOST_URL}/reset/${token}">link </a> for resetting your password.`,
    };
    await Promise.all([user.save(), sgMail.send(msg)]);
    req.flash(
      "info",
      "A link to reset your password has been sent to your inbox."
    );
    res.redirect("/login");
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

export const getNewPassword = async (req, res, next) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({
      resetPwdToken: token,
      resetPwdTokenExpirationDate: { $gt: Date.now() },
    }).exec();
    if (!user) {
      req.flash("error", "The link has expired.");
      return res.redirect("/reset");
    }
    return res.render("auth/new-password", {
      path: `/reset/${token}`,
      pageTitle: "Reset Password",
      userId: user._id.toString(),
      resetPwdToken: token,
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

export const postNewPassword = async (req, res, next) => {
  const { userId, password, resetPwdToken } = req.body;
  try {
    const user = await User.findOne({
      _id: userId,
      resetPwdToken: resetPwdToken,
      resetPwdTokenExpirationDate: { $gt: Date.now() },
    }).exec();
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.resetPwdToken = undefined;
    user.resetPwdTokenExpirationDate = undefined;
    await user.save();
    res.redirect("/login");
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
