import Product from "../models/product.js";
import User from "../models/user.js";
import Order from "../models/order.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().exec();
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  } catch (err) {
    console.log(err);
  }
};

export const getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId).exec();
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  } catch (err) {
    console.log(err);
  }
};

export const getIndex = async (req, res, next) => {
  try {
    const products = await Product.find().exec();
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  } catch (err) {
    console.log(err);
  }
};

export const getCart = async (req, res, next) => {
  let { user } = req;
  try {
    user = await User.findById(user._id)
      .populate("cart.items.productId")
      .exec();
    console.log(user.cart.items);
    res.render("shop/cart", {
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
  const cartProducts = [...user.cart.items];
  const productIdx = cartProducts.findIndex(
    (prod) => prod.productId.toString() === prodId.toString()
  );
  if (productIdx > -1) {
    cartProducts[productIdx].quantity++;
  } else {
    cartProducts.push({ productId: prodId, quantity: 1 });
  }
  user.cart.items = cartProducts;
  try {
    await user.save();
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

export const postCartDeleteProduct = async (req, res, next) => {
  const { user } = req;
  const prodId = req.body.productId;
  const cartProducts = user.cart.items.filter(
    (prod) => prod.productId.toString() !== prodId.toString()
  );
  user.cart.items = cartProducts;
  try {
    await user.save();
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

export const postOrder = async (req, res, next) => {
  const { user } = req;
  try {
    const order = new Order({items: user.cart.items, userId: user._id});
    user.cart.items = [];
    await Promise.all([order.save(), user.save()])
    res.redirect("/orders");
  } catch (err) {
    console.log(err);
  }
};

export const getOrders = async (req, res, next) => {
  const { user } = req;
  try {
    const orders = await Order.find({userId: user._id}).populate("items.productId").exec();
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders,
    });
  } catch (err) {
    console.log(err);
  }

};
