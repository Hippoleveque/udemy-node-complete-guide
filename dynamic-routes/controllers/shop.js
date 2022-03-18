const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    const cartProducts = [];
    Product.fetchAll((products) => {
      for (var prod of products) {
        const findedProd = cart.products.find((el) => el.id === prod.id);
        if (findedProd) {
          cartProducts.push({
            productData: prod,
            quantity: findedProd.quantity,
          });
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts,
        cart: cart,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.fetch(productId)
    .then(([rows]) => {
      Cart.addProduct(rows[0]);
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.deleteCart = (req, res) => {
  let { productId, price } = req.body;
  price = parseFloat(price);
  Cart.remove(productId, price);
  res.redirect("/cart");
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

exports.getProductDetail = (req, res, next) => {
  const productId = req.params.productId;
  Product.fetch(productId).then(([rows]) => {
    res.render("shop/product-detail", {
      product: rows[0],
      pageTitle: product.title,
      path: "/products",
    }).catch(err => console.log(err));
  });
};
