import Product from "../models/product.js";

export const getAddProduct = (req, res, next) => {
  const { user } = req;
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

export const postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title,
    price,
    description,
    imageUrl,
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
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  const product = {
    title: updatedTitle,
    price: updatedPrice,
    description: updatedDesc,
    imageUrl: updatedImageUrl
  }
  
  try {
    await Product.findByIdAndUpdate(prodId, product).exec();
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().exec();
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
  const prodId = req.body.productId;
  try {
    await Product.findByIdAndRemove(prodId).exec();
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};
