const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const chatSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  text: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Chat", chatSchema);
