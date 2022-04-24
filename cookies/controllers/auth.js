import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const getLogin = (req, res, next) => {
  const { isLoggedIn } = req.session;
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn,
  });
};

export const postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email }).exec();
    if (await bcrypt.compare(password, user.password)) {
        req.session.user = user;
        req.session.isLoggedIn = true;
        await req.session.save();
        res.redirect("/");
    } 
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
  const { isLoggedIn } = req.session;
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: isLoggedIn,
  });
};

export const postSignup = async (req, res, next) => {
  const { isLoggedIn } = req.session;
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
    console.log(password)
    user = User({ email, password: hashedPassword, cart: { items: [] } });
    console.log(user);
    await user.save();
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
};
