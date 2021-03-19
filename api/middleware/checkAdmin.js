const User = require("../models/user");
module.exports = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(200).json({
        message: "User not found",
      });
    }
    if (user.role === "admin") {
      next();
    } else {
      return res.status(500).json({
        message: "Not permission",
      });
    }
  } catch (error) {
    return res.status(200).json({
      message: error,
    });
  }
};
