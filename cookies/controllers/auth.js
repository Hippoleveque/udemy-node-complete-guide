import User from "../models/user.js";

export const getLogin = (req, res, next) => {
  const { isLoggedIn } = req.session;
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn,
  });
};

export const postLogin = async (req, res, next) => {
  req.session.isLoggedIn = true;
  try {
      const user = await User.findOne({userName: "Hippolyte"}).exec();
      req.session.user = user
      await session.save();
  } catch (err) {
      console.log(err)
  }
  res.redirect("/");
};


export const postLogout = async (req, res, next) => {
    try {
        await req.session.destroy();
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
  };