const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/checkAuth");
const checkAdmin = require("../middleware/checkAdmin");

router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    let check = await User.findOne({ email });
    if (check) {
      return res.status(500).json({ message: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    let hashpassword = await bcrypt.hash(password, salt);
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      email,
      name,
      password: hashpassword,
    });

    await user.save();
    const token = jwt.sign({ id: user._id }, "secret", {
      expiresIn: "5 days",
    });
    return res.status(200).json({
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
});
// DELETE USER
router.delete("/:userId", checkAuth, checkAdmin, async (req, res) => {
  const id = req.padding.userId;
  try {
    await User.remove({ _id: id });
    return res.status(200).json({ message: "succes" });
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
});
module.exports = router;
