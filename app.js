const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");
const authRouters = require("./api/routes/auth");
const profileRouters = require("./api/routes/profile");
const categoryRouters = require("./api/routes/categories");
const { static } = require("express");

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//set header
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTION") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE,GET,PATCH");
    return res.status(200).json({});
  }
  next();
});
// const mongoose.connect(mongodb);mongodb = " ' + process.env.MONGO_ATLAS_PW + ";
mongoose.connect(
  "mongodb+srv://shop-app:shop-app@cluster0.hv6oj.mongodb.net/shop-app?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
//  ROUTERS
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);
app.use("/auth", authRouters);
app.use("/profile", profileRouters);
app.use("/category", categoryRouters);
app.use((req, res, next) => {
  let error = new Error("Not Found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
module.exports = app;
