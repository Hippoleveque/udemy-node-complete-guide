const express = require("express");

const router = express.Router();

const users = [];

router.get("/", (req, res) => {
  res.render("home", { pageTitle: "Home" });
});

router.post("/add-user", (req, res) => {
  const { user } = req.body;
  users.push({ name: user });
  res.redirect("/users")
});

router.get("/users", (req, res) => {
  res.render("users", { pageTitle: "Users", users });
});

exports.router = router;
exports.users = users;
