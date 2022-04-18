const path = require("path");
const sequelize = require("./util/database");
const products = require("./data/products.json");

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
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const OrderItem = require("./models/order-item");
const Order = require("./models/order");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(async (req, res, next) => {
  const user = await User.findByPk(1);
  req.user = user;
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Product, { through: CartItem });

User.hasMany(Order);
Order.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

Order.belongsToMany(Product, { through: OrderItem})
Product.belongsToMany(Order, { through: OrderItem})

User.hasOne(Cart);

const main = async () => {
  try {
    const result = await sequelize.sync({ force: true });
    // const result = await sequelize.sync();
    let user = await User.findByPk(1);
    if (!user) {
      user = await User.create({
        name: "Hippolyte",
        email: "hippolyte.leveque@gmail.com",
      });
    }
    let cart = await user.getCart();
    if (!cart) {
      cart = await user.createCart();
    }
    for (let product of products) {
      await user.createProduct(product);
    }
    app.listen(3000);
  } catch (err) {
    console.log(err);
  }
};

main();
