import mongoose from "mongoose";
const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Post", postSchema);
