const express = require("express");
const router = express.Router();
const mogoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/users/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
const uploads = multer({ storage: storage });
const checkAuth = require("../middleware/checkAuth");
//// GET PROFILE
router.get("/", checkAuth, async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.user.id });
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
});

////  add PROFILE
router.post(
  "/",
  checkAuth,
  uploads.single("avatar"),
  async (req, res, next) => {
    try {
      let user = await User.findOne({ _id: req.user.id });
      let avatar = "http://localhost:3001/" + req.file.path;
      user.email = req.body.email;
      user.name = req.body.name;
      user.avatar = avatar;
      user.phone = req.body.phone;
      user.address = req.body.address;
      user.username = req.body.username;
      await user.save();
      return res.status(200).json({
        user,
      });
    } catch (error) {
      return (
        res.status(500),
        json({
          error: error,
        })
      );
    }
  }
);
router.post("/changepassword", checkAuth, async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.user.id });
    const salt = await bcrypt.genSalt(10);
    let check = await bcrypt.compare(req.body.oldPassword, salt);
    if (!check) {
      return res.status(500).json({
        message: "Old password is not wrong",
      });
    }
    let newPass = await bcrypt.hash(req.body.newPassword, salt);
    user.password = newPass;
    await user.save();
    return res.status(200).json({
      message: "succes",
    });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});
module.exports = router;
