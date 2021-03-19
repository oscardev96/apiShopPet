const express = require("express");
const router = express.Router();
const checkAdmin = require("../middleware/checkAdmin");
const mongoose = require("mongoose");
const Category = require("../models/category");
const checkAuth = require("../middleware/checkAuth");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/categories/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
const uploads = multer({ storage: storage });

//// GET CATEGORY
router.get("/", async (req, res) => {
  try {
    let list = await Category.find();
    return res.status(200).json(list);
  } catch (error) {
    return res.status(500).json({
      error: "Error",
    });
  }
});

/// post category
router.post(
  "/",
  checkAuth,
  checkAdmin,
  uploads.single("category"),
  async (req, res, next) => {
    try {
      let check = await Category.findOne({ name: req.body.name });
      if (check) {
        return res.status(500).json({ message: "Category already exists" });
      }
      let categoryImage = "http://localhost:3001/" + req.file.path;
      const newCategory = new Category({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        image: categoryImage,
      });
      await newCategory.save();
      return res.status(200).json(newCategory);
    } catch (error) {
      return res.status(500).json({
        error: "fail",
      });
    }
  }
);

//EDIT CATEGORY
router.post(
  "/edit",
  checkAuth,
  checkAdmin,
  uploads.single("category"),
  async (req, res, next) => {
    console.log(req.body);
    try {
      let categoryEdit = await Category.findOne({ _id: req.body.id });
      if (!categoryEdit) {
        return res.status(500).json({ message: "Category not found" });
      }
      categoryEdit.name = req.body.name;
      categoryEdit.description = req.body.description;
      if (req.file) {
        let categoryImage = "http://localhost:3001/" + req.file.path;
        categoryEdit.image = categoryImage;
      }

      await categoryEdit.save();
      return res.status(200).json(newCategory);
    } catch (error) {
      return res.status(500).json({
        error: "fail",
      });
    }
  }
);

//DELETE CATEGORY
router.delete("/:id", checkAuth, checkAdmin, async (req, res) => {
  try {
    let id = req.params.id;
    const deleteCategory = await Category.remove({ _id: id });
    return res.status(200).json({
      message: "Done",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error",
    });
  }
});
module.exports = router;
