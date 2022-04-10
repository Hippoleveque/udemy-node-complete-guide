const path = require("path");
const sequelize = require("./util/database");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const Product = require("./models/product");
const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(async (req, res, next) => {
  const user = await User.findByPk(1);
  req.user = user;
  next()
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);



Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

const main = async () => {
  try {
    const result = await sequelize.sync({ force: true });
    let user = await User.findByPk(1);
    if (!user) {
      user = await User.create({
        name: "Hippolyte",
        email: "hippolyte.leveque@gmail.com",
      });
    }
    app.listen(3000);
  } catch (err) {
    console.log(err);
  }
};

main();