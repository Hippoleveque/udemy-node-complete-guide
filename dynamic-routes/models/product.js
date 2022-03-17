const fs = require("fs");
const path = require("path");
const Cart = require("./cart");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const productIdx = products.findIndex((el) => el.id === this.id);
        products[productIdx] = this;
      } else {
        this.id = Math.random().toString();
        products.push(this);
      }
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetch(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((item) => item.id === id);
      if (product) {
        cb(product);
      }
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static remove(productId) {
    getProductsFromFile((products) => {
      const productPrice = products.find(
        (product) => product.id === productId
      ).price;
      products = products.filter((product) => product.id !== productId);
      Cart.getProductsFromFile((products) => {
        if (products.find((el) => el.id === productId)) {
          Cart.remove(productId, productPrice);
        }
      });
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  // static edit(productId, updatedProduct, cb) {
  //   getProductsFromFile((products) => {
  //     const productIdx = products.findIndex((item) => item.id === productId);
  //     if (productIdx !== -1) {
  //       products[productIdx] = { ...updatedProduct, id: productId}
  //       fs.writeFile(p, JSON.stringify(products), (err) => {
  //         console.log(err);
  //       });
  //     }
  //     cb()
  //   });
  // }
};
