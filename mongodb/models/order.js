const { getDb } = require("../util/database");
const mongodb = require("mongodb");

class Order {
  constructor(userId, products, id) {
    this.userId = userId;
    this.products = products;
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  static findAll(userId) {
    const ordersCollection = getDb().collection("orders");
    const query = { userId: userId };
    return ordersCollection.find(query)
  }

  save() {
    const ordersCollection = getDb().collection("orders");
    if (this._id) {
      const query = { _id: this._id};
      return ordersCollection.updateOne(query, {
        $set: this,
      });
    } else {
      return ordersCollection.insertOne(this);
    }
  }
}

module.exports = Order;
