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

///////////////////////////3/2
//
// const staticImages = express.static(path.join(path.resolve(), "files")); //pdf true
////////////////////////////////
// routes
// const google = require("./routes/authgoogleRoute");
// const auth = require("./routes/auth");
// const admin = require("./routes/admin");
// const account = require("./routes/accountManagement");
// const password = require("./routes/password");
// const initializePassport = require("./config/passportConfig");
// const photoUpload = require("./middlewares/photoUpload");

// const i18next = require("i18next");
//routes
// const staticFiles = express.static(path.join(path.resolve(), "files"));
// const staticImages = express.static(path.join(path.resolve(), "images"));
// app.use("/images", staticImages);
// app.use("/files", staticFiles);
// app.use("/api/auth", auth);
// app.use("/api/admin", admin);
// app.use("/api/account", account);
// app.use("/api/password", password);
// app.use("/api/g", google);
// // Error Handler Middleware
// app.use(notFound);
// app.use(errorHandler);
