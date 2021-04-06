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
/// LOGIN FACEBOOK
router.post("/loginSocial", async (req, res, next) => {
  const { idSocial, email, name, avatar, type } = req.body;
  console.log(req.body);
  try {
    let check = await User.findOne({ idSocial });

    if (check) {
      const token = jwt.sign({ id: check._id }, "secret", {
        expiresIn: "5 days",
      });
      res.status(200).json({
        token: token,
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      let hashpassword = await bcrypt.hash(email, salt);
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        idSocial,
        email,
        name,
        password: hashpassword,
        avatar,
        type,
      });

      await user.save();
      const token = jwt.sign({ id: user._id }, "secret", {
        expiresIn: "5 days",
      });
      console.log(user);
      res.status(200).json({
        token: token,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
    });
  }
});

//// LOGIN GOOGLE

module.exports = router;
