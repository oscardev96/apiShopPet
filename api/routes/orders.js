const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/order");
const checkAuth = require("../middleware/checkAuth");
/// GET LIST ORDER USER
router.get("/", checkAuth, async (req, res, next) => {
  try {
    let listOrder = await Order.find({ user: req.user.id }).populate({
      path: "listProduct",
      populate: {
        path: "product",
        select: ["name", "price", "images"],
      },
    });
    res.status(200).json(listOrder);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});
/// POST ORDER
router.post("/", checkAuth, async (req, res, next) => {
  try {
    let order = new Order({
      _id: new mongoose.Types.ObjectId(),
      user: req.user.id,
      listProduct: req.body.listProduct,
      totalItem: req.body.totalItem,
      totalAmount: req.body.totalAmount,
    });
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    res.status(200).json({
      error: error,
    });
  }
});
/// GET ORDER BY IDORDER
router.get("/:orderId", checkAuth, async (req, res, next) => {
  try {
    const orderSelected = await Order.findById(req.params.orderId).populate({
      path: "listProduct",
      populate: {
        path: "product",
        select: ["name", "price", "images"],
      },
    });
    res.status(200).json(orderSelected);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});
router.delete("/:orderId", checkAuth, async (req, res, next) => {
  let id = req.params.orderId;
  try {
    await Order.remove({ _id: id });
    res.status(200).json({
      message: " Delete Done",
    });
  } catch (error) {
    res.status(200).json({
      error: error,
    });
  }
});
module.exports = router;
