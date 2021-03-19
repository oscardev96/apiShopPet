const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const token = req.header("authorization");
  if (!token) {
    return res.status(200).json({
      message: "Auth Fail",
    });
  }
  try {
    const dataDecode = jwt.verify(token, "secret");
    req.user = dataDecode;
    next();
  } catch (error) {
    return res.status(200).json({
      message: error,
    });
  }
};
