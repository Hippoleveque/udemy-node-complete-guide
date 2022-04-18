const { getDb } = require("../util/database");
const mongodb = require("mongodb");

class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }

  static findById(userId) {
    const usersCollection = getDb().collection("users");
    const mongoUserId = new mongodb.ObjectId(userId);
    const query = { _id: mongoUserId };
    return usersCollection.findOne(query);
  }

  static findByName(username) {
    const usersCollection = getDb().collection("users");
    const query = { username: username };
    return usersCollection.findOne(query);
  }

  save() {
    const usersCollection = getDb().collection("users");
    return usersCollection.insertOne(this);
  }
}

module.exports = User;
