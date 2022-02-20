const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const rootDir = require("./helpers/path");
const { router: adminRoutes } = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use((req, res) => {
  res.status(404).render("404", { pageTitle: "Page not Found" });
});

app.listen(3000);
