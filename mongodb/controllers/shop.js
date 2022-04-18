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
  const cart = await Cart.findByUser(user._id);
  const cartProducts = cart ? cart.products : [];
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
    const cart = await Cart.findByUser(user._id);
    let cartProducts = cart?.products || [];
    const newProduct = await Product.findById(prodId);
    const foundProduct = cartProducts.find(
      (product) => product._id.toString() === newProduct._id.toString()
    );
    if (foundProduct) {
      foundProduct.quantity++;
    } else {
      cartProducts.push({ ...newProduct, quantity: 1 });
    }
    const newCart = new Cart(user._id, cartProducts, cart?._id || null);
    await newCart.save();
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const { user } = req;
  const prodId = req.body.productId;
  try {
    const cart = await Cart.findByUser(user._id);
    const newProducts = cart.products.filter(
      (product) => product._id.toString() !== prodId.toString()
    );
    const newCart = new Cart(user._id, newProducts, cart._id);
    await newCart.save();
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

exports.postOrder = async (req, res, next) => {
  const { user } = req;
  try {
    const cart = await Cart.findByUser(user._id);
    const cartProducts = cart.products;
    const newOrder = new Order(user._id, cartProducts);
    await newOrder.save();
    res.redirect("/orders");
  } catch (err) {
    console.log(err);
  }
};

exports.getOrders = async (req, res, next) => {
  const { user } = req;
  try {
    let orders = await Order.findAll(user._id);
    orders = await orders.toArray();
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders,
    });
  } catch (err) {
    console.log(err);
  }
};
