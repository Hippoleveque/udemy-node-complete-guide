import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function(prodId) {
    const cartProducts = [...this.cart.items];
    const productIdx = cartProducts.findIndex(
      (prod) => prod.productId.toString() === prodId.toString()
    );
    if (productIdx > -1) {
      cartProducts[productIdx].quantity++;
    } else {
      cartProducts.push({ productId: prodId, quantity: 1 });
    }
    this.cart.items = cartProducts;
    return this.save();
}

userSchema.methods.removeFromCart = function(prodId) {
    const cartProducts = this.cart.items.filter(
      (prod) => prod.productId.toString() !== prodId.toString()
    );
    this.cart.items = cartProducts;
    return this.save();
}

export default model("User", userSchema);
