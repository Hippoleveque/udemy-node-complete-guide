const express = require("express");
const path = require("path");
const { products } = require("./admin");

const rootDir = require("../helpers/path");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log(products);
  res.render("shop", { pageTitle: "Shop", prods: products });
});

module.exports = router;
