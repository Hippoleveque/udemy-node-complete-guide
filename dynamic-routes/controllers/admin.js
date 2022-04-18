const Product = require("../models/product");
const User = require("../models/user");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

exports.postAddProduct = async (req, res, next) => {
  const { user } = req;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  try {
    await user.createProduct({ title, imageUrl, description, price });
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getEditProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findByPk(productId);
    res.render("admin/edit-product", {
      product,
      path: "/admin/products",
      pageTitle: "Edit Product",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const { productId: id, title, imageUrl, price, description } = req.body;
  await Product.upsert({
    id,
    title,
    imageUrl,
    price,
    description,
  });
  res.redirect("/admin/products");
};

exports.postDeleteProduct = async (req, res, next) => {
  const { productId } = req.body;
  const product = await Product.findByPk(productId);
  await product.destroy();
  res.redirect("/admin/products");
};
