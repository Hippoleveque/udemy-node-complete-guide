const Product = require("../models/product");
const { Cart, CartProducts } = require("../models/cart");


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
    const qtyProducts = products.map((product) => {
      return {
        ...product.dataValues,
        quantity: product.CartProducts.dataValues.quantity,
      };
    });
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: qtyProducts,
      cart: cart,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postCart = async (req, res, next) => {
  const { user } = req;
  const productId = req.body.productId;
  const product = await Product.findByPk(productId);
  let cart = await user.getCart();
  if (!cart) {
    cart = await user.createCart();
  }
  let qty = 1;
  // first, get the cart Products to check if the relation already exists
  const cartProducts = await cart.getProducts();
  let foundProduct = cartProducts.find(
    (product) => product.dataValues.id == productId
  );
  if (foundProduct) {
    qty = foundProduct.CartProducts.dataValues.quantity + 1;
  }
  await cart.addProduct(product, { through: { quantity: qty } });
  await cart.update({
    totalPrice: cart.dataValues.totalPrice + product.dataValues.price,
  });
  res.redirect("/cart");
};

exports.deleteCart = async (req, res) => {
  const { user } = req;
  const { productId, price } = req.body;
  let cart = await user.getCart();
  const product = await Product.findByPk(productId);
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
