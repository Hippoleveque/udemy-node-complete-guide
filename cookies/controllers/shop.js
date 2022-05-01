import Product from "../models/product.js";
import User from "../models/user.js";
import Order from "../models/order.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().exec();
    return res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

export const getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId).exec();
    return res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

export const getIndex = async (req, res, next) => {
  try {
    const products = await Product.find().exec();
    return res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

export const getCart = async (req, res, next) => {
  let { user } = req;
  try {
    user = await user.populate("cart.items.productId").execPopulate();
    return res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: user.cart.items,
    });
  } catch (err) {
    console.log(err);
  }
};

export const postCart = async (req, res, next) => {
  const { user } = req;
  const prodId = req.body.productId;
  try {
    await user.addToCart(prodId);
    return res.redirect("/cart");
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

export const postCartDeleteProduct = async (req, res, next) => {
  const { user } = req;
  const prodId = req.body.productId;
  try {
    await user.removeFromCart(prodId);
    return res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

export const postOrder = async (req, res, next) => {
  let { user } = req;
  try {
    user = await user.populate("cart.items.productId").execPopulate();
    const products = user.cart.items.map((prod) => {
      return { product: { ...prod.productId._doc }, quantity: prod.quantity };
    });
    const order = new Order({
      items: products,
      user: { userId: user, name: user.userName },
    });
    await Promise.all([order.save(), user.clearCart()]);
    return res.redirect("/orders");
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

export const getOrders = async (req, res, next) => {
  let { user } = req;
  try {
    const orders = await Order.find({ "user.userId": user._id }).exec();
    return res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders,
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
