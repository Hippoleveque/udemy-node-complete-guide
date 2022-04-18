const { getDb } = require("../util/database");
const mongodb = require("mongodb");

class Cart {
  constructor(userId, products, id) {
    this.userId = userId;
    this.products = products || [];
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  static findByUser(userId) {
    const cartsCollection = getDb().collection("carts");
    const query = { userId: userId };
    return cartsCollection.findOne(query);
  }

  save() {
    const cartsCollection = getDb().collection("carts");
    if (this._id) {
      const query = { _id: this._id};
      return cartsCollection.updateOne(query, {
        $set: this,
      });
    } else {
      return cartsCollection.insertOne(this);
    }
  }
}

module.exports = Cart;
