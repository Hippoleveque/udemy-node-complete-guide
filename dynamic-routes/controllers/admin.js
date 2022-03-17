const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.fetch(productId, (product) => {
    res.render("admin/edit-product", {
      product,
      path: "/admin/products",
      pageTitle: "Edit Product",
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { productId: id, title, imageUrl, price, description } = req.body;
  const newProduct = new Product(id, title, imageUrl, description, price);
  newProduct.save();
  res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.remove(productId);
  res.redirect("/admin/products");
};
