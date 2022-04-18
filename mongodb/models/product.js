const { getDb } = require("../util/database");
const mongodb = require("mongodb");

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  static findAll(userId) {
    const productsCollection = getDb().collection("products");
    const query = { userId: userId };
    return productsCollection.find(query);
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
