const express = require("express");
const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended: false})

const { router: usersRoutes } = require("./routes/users")

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

app.use(parser);
app.use(usersRoutes);
app.use((req, res) => {
  res.render("404", { pageTitle: "Page Not Found" });
});

app.listen(3000);
