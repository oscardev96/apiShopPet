const mongoose = require("mongoose");
const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "User" },
  listProduct: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  done: { type: Boolean, default: false },
});
module.exports = mongoose.model("Order", orderSchema);
