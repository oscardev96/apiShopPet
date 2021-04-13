const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");
const checkAuth = require("../middleware/checkAuth");
const checkAdmin = require("../middleware/checkAdmin");
const Category = require("../models/category");
const User = require("../models/user");
const severUrl = "http://localhost:3001/";
const multer = require("multer");
//Storage upload multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/images/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
const upload = multer({ storage: storage });

//// GET PRODUCT
router.get("/:page", async (req, res, next) => {
  try {
    let products = await Product.find({}, { comments: 0 })
      .limit(10)
      .skip(10 * req.params.page)
      .populate("category", ["name", "_id"]);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      error: error,
      message: " not found",
    });
  }
});

// GET PRODUCT BY ID
router.get("/productDetail/:id", async (req, res, next) => {
  let id = req.params.id;
  try {
    let productSelected = await Product.findById(id)
      .populate("category", ["name", "_id"])
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: ["name", "avatar"],
        },
      });
    res.status(200).json(productSelected);
  } catch (error) {
    res.status(500).json({
      error: error,
      message: " nor found",
    });
  }
});

//// CREATE NEW PRODUCT
router.post(
  "/",
  checkAuth,
  checkAdmin,
  upload.array("images", 12),
  (req, res, next) => {
    let images = req.files.map((item) => {
      return severUrl + item.path;
    });

    let product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      overView: req.body.overView,
      description: req.body.description,
      images,
    });
    product
      .save()
      .then()
      .catch((error) => {
        return res.status(500).json({
          message: "Fail",
        });
      });
    res.status(200).json(product);
  }
);
/// EDIT PRODUTCT
router.post(
  "/edit",
  checkAuth,
  checkAdmin,
  upload.array("images"),
  async (req, res, next) => {
    let id = req.body.id;
    try {
      let images = req.files.map((item) => {
        return severUrl + item.path;
      });
      let update = await Product.updateOne(
        { _id: id },
        {
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          images,
        }
      );
      res.status(200).json(update);
    } catch (error) {
      res.status(500).json({
        error: error,
      });
    }
  }
);

/// DELETE PRODUCT
router.delete("/:id", checkAuth, checkAdmin, async (req, res, next) => {
  let id = req.params.id;
  try {
    await Product.remove({ _id: id });
    res.status(200).json({
      message: "Done",
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});

/// COMENT
router.post("/comment/:id", checkAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    const newComment = {
      user: req.user.id,
      text: req.body.text,
      rating: req.body.rating,
    };
    product.comments.unshift(newComment);
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "  FAIL",
    });
  }
});

// SEARCH
router.get("/search/:query", async (req, res, next) => {
  try {
    let query = req.params.query;
    let result = await Product.find(
      {
        name: new RegExp(query, "i"),
      },
      { comments: 0, description: 0, price: 0, overView: 0, category: 0 }
    );
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
