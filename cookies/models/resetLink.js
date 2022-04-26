import mongoose from "mongoose";
const { Schema, model } = mongoose;

const resetLinkSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default model("ResetLink", resetLinkSchema);
