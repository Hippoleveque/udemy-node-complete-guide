const { getDb } = require("../util/database");
const mongodb = require("mongodb");

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    if (id) {
      this._id = new mongodb.ObjectId(id);;
    }
  }

  static findAll() {
    const productsCollection = getDb().collection("products");
    return productsCollection.find();
  }

  static findById(prodId) {
    const mongoProdId = new mongodb.ObjectId(prodId);
    const productsCollection = getDb().collection("products");
    const query = { _id: mongoProdId };
    return productsCollection.findOne(query);
  }

  static deleteById(prodId) {
    const mongoProdId = new mongodb.ObjectId(prodId);
    const productsCollection = getDb().collection("products");
    const query = { _id: mongoProdId };
    return productsCollection.deleteOne(query);
  }

  save() {
    const productsCollection = getDb().collection("products");
    if (this._id) {
      const mongoProdId = new mongodb.ObjectId(this._id);
      const filter = { _id: mongoProdId };
      return productsCollection.updateOne(filter, {
        $set: this,
      });
    } else {
      return productsCollection.insertOne(this);
    }
  }
}

module.exports = Product;
