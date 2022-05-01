import Product from "../models/product.js";
import { validationResult } from "express-validator";
import { deleteFile } from "../util/path.js";
const ITEMS_PER_PAGE = 2;

export const getAddProduct = (req, res, next) => {
  return res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    errorMessage: undefined,
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
  const { title, price, description } = req.body;
  const image = req.file;
  if (!image) {
    return res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      errorMessage: "Image must be a valid image file.",
      product: {
        title,
        imageUrl,
        price,
        description,
      },
    });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      errorMessage: errors.array()[0],
      product: {
        title,
        price,
        description,
      },
    });
  }
  const imageUrl = image.path;
  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: user,
  });
  try {
    await product.save();
    return res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
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
    return res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      errorMessage: undefined,
      editing: editMode,
      product: product,
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

export const postEditProduct = async (req, res, next) => {
  const { user } = req;
  const errors = validationResult(req);
  const {
    productId,
    title: updatedTitle,
    price: updatedPrice,
    description: updatedDesc,
  } = req.body;
  const image = req.file;
  try {
    if (!errors.isEmpty()) {
      return res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: true,
        errorMessage: errors.array()[0],
        product: {
          title: updatedTitle,
          price: updatedPrice,
          description: updatedDesc,
          _id: productId,
        },
      });
    }
    if (req.badImageType) {
      return res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: true,
        errorMessage: { msg: "Image must be a valid image file." },
        product: {
          title: updatedTitle,
          price: updatedPrice,
          description: updatedDesc,
          _id: productId,
        },
      });
    }
    const product = await Product.findOne({
      _id: productId,
      userId: user._id,
    }).exec();
    product.description = updatedDesc;
    product.price = updatedPrice;
    if (image) {
      deleteFile(product.imageUrl);
      product.imageUrl = image.path;
    }
    product.title = updatedTitle;
    await product.save();
    return res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

export const getProducts = async (req, res, next) => {
  const { user } = req;
  const page = +req.query.page || 1;
  try {
    const totalItems = await Product.find().countDocuments();
    const products = await Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .exec();
    return res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
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

export const postDeleteProduct = async (req, res, next) => {
  const { user } = req;
  const { productId } = req.params;
  try {
    const product = await Product.findOne({
      _id: productId,
      userId: user._id,
    }).exec();
    if (!product) {
      const error = new Error("Product Not Found");
      error.httpStatusCode = 500;
      return next(error);
    }
    await Promise.all([
      Product.deleteOne({ _id: product._id }).exec(),
      deleteFile(product.imageUrl),
    ]);
    return res.status(200).json({message: "Success"})
  } catch (err) {
    console.log(err);
    return res.status(500).json({message: "Failed to deleted the product."})
  }
};
