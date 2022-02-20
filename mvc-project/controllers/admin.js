const Product = require("../models/product");

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll((products) =>
    res.render("admin/products", {
      prods: products,
      pageTitle: "Shop",
      path: "/admin/products",
      hasProducts: products.length > 0,
      productCSS: true,
    })
  );
};

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
  const { title, price, description, imageUrl } = req.body;
  const product = new Product(title, imageUrl, price, description);
  product.save();
  res.redirect("/");
};

exports.postDeleteProduct = (req, res, next) => {
  const { productTitle } = req.body;
  Product.remove(productTitle);
  res.redirect("/");
};
