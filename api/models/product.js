const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, require: true },
  price: { type: Number, require: true },
  overView: { type: String, require: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  images: [{ type: String, require: true }],
  description: { type: String, require: true },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User",
      },
      text: {
        type: String,
      },
      rating: {
        type: Number,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});
module.exports = mongoose.model("Product", productSchema);
