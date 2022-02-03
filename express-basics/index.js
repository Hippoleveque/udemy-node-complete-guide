const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/add-product", (req, res) => {
  res.send(
    "<html><body><form action='/products' method='POST'><input type='text' name='message'><button type='submit'>Submit</button> </form></body></html>"
  );
});

app.use("/products", (req, res) => {
  console.log(req.body);
  res.redirect("/");
});

app.use("/", (req, res, next) => {
  res.send("<h1>Bonjour</h1>");
});

app.listen(3000);
