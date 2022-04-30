import Product from "../models/product.js";
import { validationResult } from "express-validator";

export const getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    errorMessage: null,
    oldInput: {
      title: "",
      imageUrl: "",
      price: undefined,
      description: "",
    },
  });
};

export const postAddProduct = async (req, res, next) => {
  const { user } = req;
  const { title, imageUrl, price, description  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      errorMessage: errors.array()[0],
      product: {
        title,
        imageUrl,
        price,
        description,
      },
    });
  }
  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: user,
  });
  try {
    await product.save();
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};

export const getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId).exec();
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  } catch (err) {
    console.log(err);
  }
};

export const postEditProduct = async (req, res, next) => {
  const { user } = req;
  const {
    productId,
    title: updatedTitle,
    price: updatedPrice,
    imageUrl: updatedImageUrl,
    description: updatedDesc,
  } = req.body;

  try {
    const product = await Product.findOne({
      _id: productId,
      userId: user._id,
    }).exec();
    product.description = updatedDesc;
    product.price = updatedPrice;
    product.imageUrl = updatedImageUrl;
    product.title = updatedTitle;
    await product.save();
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};

export const getProducts = async (req, res, next) => {
  const { user } = req;
  try {
    const products = await Product.find({ userId: user._id }).exec();
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  } catch (err) {
    console.log(err);
  }
};

export const postDeleteProduct = async (req, res, next) => {
  const { user } = req;
  const { productId } = req.body.productId;
  try {
    await Product.deleteOne({ _id: productId, userId: user._id }).exec();
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};
