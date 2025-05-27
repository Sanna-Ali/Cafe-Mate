const express = require("express");
const connection = require("../config/DB");
const router = express.Router();
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");
let fs = require("fs");
const asyncHandler = require("express-async-handler");
let uuid = require("uuid");
const { authenticateToken } = require("../services/authentication");
const { checkrole } = require("../services/checkRole");
const {
  getPdf,
  generateReport,
  getBills,
  deleteBill,
} = require("../controllers/bill.controller.js");

router.post("/generateReport", authenticateToken, generateReport);
router.post("/getPdf", authenticateToken, getPdf);
router.get("/getBills", authenticateToken, getBills);
router.delete("/delete/:id", authenticateToken, deleteBill);

module.exports = router;
