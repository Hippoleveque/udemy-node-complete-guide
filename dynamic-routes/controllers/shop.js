const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.findAll();
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
  try {
    const cart = await user.getCart();
    const products = (await cart?.getProducts()) || [];
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: products,
      cart: cart,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postCart = async (req, res, next) => {
  const { user } = req;
  let cart = await user.getCart();
  const productId = req.body.productId;
  let product;
  if (!cart) {
    cart = await user.createCart();
  }
  let qty = 1;
  // first, get the cart Products to check if the relation already exists
  const cartProducts = await cart.getProducts({where: {id: productId}});
  if (cartProducts.length > 0) {
    product = cartProducts[0]
    qty = product.cartItem.dataValues.quantity + 1
  } else {
    product = await Product.findByPk(productId);
  }
  await cart.addProduct(product, { through: { quantity: qty } });
  res.redirect("/cart");
};

exports.deleteCart = async (req, res) => {
  const { user } = req;
  let { productId } = req.body;
  let cart = await user.getCart();
  productId = parseInt(productId);
  const products = await cart.getProducts({where: { id: productId}});
  const product = products[0];
  try {
    await cart.removeProduct(product);
    res.redirect("/cart");
  } catch (error) {
    console.log(error);
  }
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.getProductDetail = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findByPk(productId);
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  } catch (err) {
    console.log(err);
  }
};
