import mongoose from "mongoose";
const { Schema, model } = mongoose;

const orderSchema = new Schema({
  items: [
    {
      product: {
        type: Object,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  user: {
    name: {
      type: String,
      requiered: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
});

export default model("Order", orderSchema);
