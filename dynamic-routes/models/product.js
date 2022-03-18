const fs = require("fs");
const path = require("path");
const Cart = require("./cart");
const db = require("../util/database");

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
    db.execute(
      `INSERT INTO products (title, description, price, imageURL) VALUES ('${this.title}', '${this.description}', ${this.price}, '${this.imageUrl}')`
    );
    db.execute(
      "INSERT INTO products (title, description, price, imageURL) VALUES (?, ?, ?, ?)",
      [this.title, this.description, this.price, this.imageUrl]
    );
  }

  static fetch(id) {
    return db.execute("SELECT * FROM products WHERE id=?;", [id]);
  }

  static fetchAll() {
    return db.execute("SELECT * FROM products;");
  }

  static remove(productId) {
    return db.execute("DELETE FROM products WHERE id=?;", [productId]);
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
