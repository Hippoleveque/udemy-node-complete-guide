import User from "../models/user.js";
import bcrypt from "bcryptjs";
import sgMail from '@sendgrid/mail';
import 'dotenv/config';

sgMail.setApiKey(process.env.SENDGRID_KEY);

export const getLogin = (req, res, next) => {
  const errorMessage = req.flash("error");
  const infoMessage = req.flash("info");
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: errorMessage,
    infoMessage: infoMessage
  });
};

export const postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email }).exec();
    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = user;
      req.session.isLoggedIn = true;
      await req.session.save();
      res.redirect("/");
    }
    req.flash("error", "Invalid email / password");
    res.redirect("/login");
  } catch (err) {
    console.log(err);
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
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
  });
};

export const postSignup = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  let user = await User.findOne({ email: email }).exec();
  if (user) {
    res.render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      isAuthenticated: isLoggedIn,
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    user = User({ email, password: hashedPassword, cart: { items: [] } });
    await user.save();
    const msg = {
      to: email,
      from: 'hippolyte.leveque@gmail.com',
      subject: 'Automation test',
      text: 'Zemmour 2027',
      html: '<strong>Zemmour Président</strong>',
    }
    await sgMail.send(msg);
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
};

export const getReset = (req, res, next) => {
  const errorMessage = req.flash("error");
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: errorMessage,
  });
};

export const postReset = async (req, res, next) => {
  const { email } = req.body;
  try {
    let user = await User.findOne({ email: email }).exec();
    if (!user) {
      req.flash("error", "Invalid email / password");
      res.redirect("/reset");
    }
    const msg = {
      to: email,
      from: 'hippolyte.leveque@gmail.com',
      subject: 'Reset password',
      text: 'Zemmour 2027',
      html: '<strong> Reseting your password </strong>',
    }
    await sgMail.send(msg);
    req.flash("info", "A link to reset your password has been sent to your inbox.")
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
}
