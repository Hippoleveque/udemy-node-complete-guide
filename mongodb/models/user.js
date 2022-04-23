const { getDb } = require("../util/database");
const mongodb = require("mongodb");

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
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

  addToCart(product) {
    const productIdx = this.cart.items.findIndex(
      (prod) => prod.productId.toString() === product._id.toString()
    );
    let updatedProducts = [...this.cart.items];
    console.log(productIdx);
    if (productIdx > -1) {
      updatedProducts[productIdx].quantity++;
    } else {
      updatedProducts.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: 1,
      });
    }
    const updatedCart = { items: updatedProducts };
    const usersCollection = getDb().collection("users");
    const query = { _id: this._id };
    return usersCollection.updateOne(query, {
      $set: { cart: updatedCart },
    });
  }

  async getCart() {
    const productIds = this.cart.items.map((product) => product.productId);
    const productsCollection = getDb().collection("products");
    const productsCursor = await productsCollection.find({
      _id: { $in: productIds },
    });
    let cartProducts = await productsCursor.toArray();
    cartProducts = cartProducts.map((prod) => {
      prod.quantity = this.cart.items.find(
        (prd) => prd.productId.toString() === prod._id.toString()
      ).quantity;
      return prod;
    });
    return cartProducts;
  }

  removeFromCart(productId) {
    const updatedItems = this.cart.items.filter(
      (prod) => prod.productId.toString() !== productId
    );
    const updatedCart = { items: updatedItems };
    const usersCollection = getDb().collection("users");
    const query = { _id: this._id };
    return usersCollection.updateOne(query, {
      $set: { cart: updatedCart },
    });
  }

  async addOrder() {
    const ordersCollection = getDb().collection("orders");
    const items = await this.getCart();
    const order = {
      items: items,
      user: {
        _id: this._id,
        username: this.username,
        email: this.email,
      },
    };
    await ordersCollection.insertOne(order);
    const updatedCart = { items: [] };
    const usersCollection = getDb().collection("users");
    const query = { _id: this._id };
    return usersCollection.updateOne(query, {
      $set: { cart: updatedCart },
    });
  }

  async getOrders() {
    const ordersCollection = getDb().collection("orders");
    let orders = await ordersCollection.find({ "user._id": this._id });
    orders = await orders.toArray();
    console.log(orders)
    return orders;
  }

  save() {
    const usersCollection = getDb().collection("users");
    return usersCollection.insertOne(this);
  }
}

module.exports = User;
