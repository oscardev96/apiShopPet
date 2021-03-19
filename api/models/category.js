const mongoose = require("mongoose");
const categorySchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String, require: true },
  description: { type: String, require: true },
  image: { type: String },
});
module.exports = mongoose.model("Category", categorySchema);
