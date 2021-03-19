const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return req.status(500).json({
        message: "Invalid Credentials",
      });
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return req.status(500).json({
        message: "Invalid Credentials",
      });
    }
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
module.exports = router;
