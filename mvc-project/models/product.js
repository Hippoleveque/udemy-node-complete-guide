const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (callback) => {
  fs.readFile(p, (err, data) => {
    let products = [];
    if (!err) {
      products = JSON.parse(data);
    }
    callback(products);
  });
};

module.exports = class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  static getProductsFromFile(callback) {
    fs.readFile(p, (err, data) => {
      let products = [];
      if (!err) {
        products = JSON.parse(data);
      }
      callback(products);
    });
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(callback) {
    getProductsFromFile((products) => callback(products));
  }

  static remove(productTitle) {
    getProductsFromFile((products) => {
      const filterProducts = products.filter(product => product.title !== productTitle);
      fs.writeFile(p, JSON.stringify(filterProducts), (err) => {
        console.log(err);
      });
    })
  }
};
