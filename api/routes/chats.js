const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");
const checkAuth = require("../middleware/checkAuth");
const checkAdmin = require("../middleware/checkAdmin");
const Chat = require("../models/chat");
const User = require("../models/user");
const { json } = require("body-parser");
router.get("/", checkAuth, async (req, res) => {
  try {
    let message = await Chat.find().populate({
      path: "user",
      select: ["name", "avatar"],
    });
    res.status(200).json(message);
  } catch (error) {
    res.status(500),
      json({
        error: error,
      });
  }
});
module.exports = router;
