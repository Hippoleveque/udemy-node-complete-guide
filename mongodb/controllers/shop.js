const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");

exports.getProducts = async (req, res, next) => {
  const { user } = req;
  try {
    let products = await Product.findAll(user._id);
    products = await products.toArray();
    products = products.map((product) => {
      product.id = product._id.toString();
      return product;
    });
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId);
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getIndex = async (req, res) => {
  const { user } = req;
  try {
    let products = await Product.findAll(user._id);
    products = await products.toArray();
    console.log(products);
    products = products.map((product) => {
      product.id = product._id.toString();
      return product;
    });
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCart = async (req, res, next) => {
  const { user } = req;
  const cartProducts = await user.getCart();
  console.log(cartProducts);
  res.render("shop/cart", {
    path: "/cart",
    pageTitle: "Your Cart",
    products: cartProducts,
  });
};

exports.postCart = async (req, res, next) => {
  const { user } = req;
  const prodId = req.body.productId;
  try {
    const product = await Product.findById(prodId);
    await user.addToCart(product);
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const { user } = req;
  const prodId = req.body.productId;
  try {
    await user.removeFromCart(prodId);
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

exports.postOrder = async (req, res, next) => {
  const { user } = req;
  try {
    user.addOrder();
    res.redirect("/orders");
  } catch (err) {
    console.log(err);
  }
};

exports.getOrders = async (req, res, next) => {
  const { user } = req;
  try {
    const orders = await user.getOrders();
    console.log(orders)
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders,
    });
  } catch (err) {
    console.log(err);
  }
};
