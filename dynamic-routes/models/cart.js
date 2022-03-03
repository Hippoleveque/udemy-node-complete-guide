const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

const getCartFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb({ totalPrice: 0, products: [] });
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Cart {
  static addProduct(product) {
    getCartFromFile((cart) => {
      const productIdx = cart.products.findIndex((el) => product.id);
      if (productIdx !== -1) {
        // The item is already in the cart, we increment the qty
        cart.products[productIdx].quantity++;
      } else {
        // We add the item
        product.quantity = 1;
        cart.products.push(product);
      }
      cart.totalPrice += parseInt(product.price);
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }
};
