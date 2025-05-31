const express = require("express");
require("dotenv").config();
//const { connection } = require("./config/DB");
const userRouter = require("./routes/user.route.js");
const categoryRouter = require("./routes/category.route.js");
const productRouter = require("./routes/product.route.js");
const billRoute = require("./routes/bill.route.js");
const dashpord = require("./routes/dashboard.route.js");
//const { errorHandler, notFound } = require("./middlewares/error");
//const cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const cors = require("cors");

//connection();

// Init App
const app = express();
//app.use(photoUpload.any("oo"));
// for parsing application/json
//app.use(bodyParser.json());
// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cookieParser());
// Middlewares
app.use(express.json());
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/bill", billRoute);
app.use("/dashpord", dashpord);
module.exports = app;
