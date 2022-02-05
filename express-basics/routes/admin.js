const express = require("express");
const path = require("path");

const rootDir = require("../helpers/path");

const router = express.Router();
const products = [];

router.get("/add-product", (req, res) => {
  res.render("add-product", { pageTitle: "Add Product" });
});

router.post("/add-product", (req, res) => {
  products.push({ title: req.body.title });
  res.redirect("/");
});

exports.router = router;
exports.products = products;
