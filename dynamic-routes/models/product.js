const fs = require("fs");
const path = require("path");

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
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    this.id = Math.random().toString();
    getProductsFromFile((products) => {
      products.push(this);
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

  static edit(productId, updatedProduct, cb) {
    getProductsFromFile((products) => {
      const productIdx = products.findIndex((item) => item.id === productId);
      if (productIdx !== -1) {
        products[productIdx] = { ...updatedProduct, id: productId}
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
      cb()
    });
  }

};
