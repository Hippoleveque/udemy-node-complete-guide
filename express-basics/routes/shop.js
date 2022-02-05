const express = require("express");
const path = require("path");
const { products } = require("./admin");

const rootDir = require("../helpers/path");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log(products);
  res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = router;
