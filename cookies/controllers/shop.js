import fs from "fs";
import path from "path";

import PDFDocument from "pdfkit";

import Product from "../models/product.js";
import Order from "../models/order.js";

const ITEMS_PER_PAGE = 2;

export const getProducts = async (req, res, next) => {
  const page = +req.query.page || 1;
  try {
    const totalItems = await Product.find().countDocuments();
    const products = await Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .exec();
    return res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
      totalProducts: totalItems,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
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
  const page = +req.query.page || 1;
  try {
    const totalItems = await Product.find().countDocuments();
    const products = await Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .exec();
    return res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      totalProducts: totalItems,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
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
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
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
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
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

export const getInvoice = async (req, res, next) => {
  const { orderId } = req.params;
  const { user } = req;
  const invoiceFileName = `invoice-${orderId}.pdf`;
  const invoiceFilePath = path.join("data", "invoices", invoiceFileName);
  try {
    const order = await Order.findById(orderId).exec();
    let error;
    if (!order) {
      error = new Error("No order found.");
      return next(error);
    } else if (order.user.userId.toString() !== user._id.toString()) {
      error = new Error("Unauthorized.");
      return next(error);
    }
    const pdf = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${invoiceFileName}"`
    );
    pdf.pipe(fs.createWriteStream(invoiceFilePath));
    pdf.pipe(res);
    pdf.fontSize(24).text("Invoice");
    pdf.text("-------------------");
    let totalPrice = 0;
    order.items.forEach((prod) => {
      totalPrice += prod.quantity * prod.product.price;
      pdf
        .fontSize(14)
        .text(
          `${prod.product.title}: ${prod.quantity} x $${prod.product.price}`
        );
    });
    pdf.text("-------------------");
    pdf.fontSize(18).text(`Total price: $${totalPrice}`);
    return pdf.end();
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

export const getCheckout = async (req, res, next) => {
  let { user } = req;
  try {
    user = await user.populate("cart.items.productId").execPopulate();
    const products = user.cart.items;
    let totalPrice = products.reduce((a, b) => a + b.quantity * b.productId.price, 0)
    return res.render("shop/checkout", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: user.cart.items,
      totalPrice
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
}