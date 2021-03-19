const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, require: true },
  password: { type: String, require: true },
  name: { type: String, require: true },
  avatar: {
    type: String,
    default: "http://localhost:3001/uploads/users/default-avatar.png",
  },
  phone: { type: Number },
  address: { type: String },
  username: { type: String, default: "" },
  role: { type: String, default: "customer" },
});
module.exports = mongoose.model("User", userSchema);
