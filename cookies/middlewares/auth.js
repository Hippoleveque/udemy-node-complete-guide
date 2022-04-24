export const isAuth = (req, res, next) => {
  const { isLoggedIn } = req.session;
  if (isLoggedIn) {
    return next();
  }
  return res.redirect("/login");
};
