const express = require("express");

const router = express.Router();

router.get("/add-product", (req, res) => {
  res.send(
    "<html><body><form action='/product' method='POST'><input type='text' name='message'><button type='submit'>Submit</button> </form></body></html>"
  );
});

router.post("/product", (req, res) => {
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;
