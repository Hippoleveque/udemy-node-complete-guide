const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const { mongoConnect } = require("./util/database");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(async (req, res, next) => {
  try {
    const user = await User.findByName("Hippolyte");
    req.user = new User(user.username, user.email, user.cart, user._id);
  } catch (err) {
    console.log(err);
  }
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

const main = async () => {
  const client = await mongoConnect();
  let user = await User.findByName("Hippolyte");
  if (!user) {
    user = new User("Hippolyte", "hippolyte.leveque@gmail.com", { items: []});
    const res = await user.save();
    console.log(res);
  }
  // console.log(client);
  app.listen(3000);
};

main();
