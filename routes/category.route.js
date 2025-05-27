const express = require("express");
const connection = require("../config/DB");
const router = express.Router();
const { authenticateToken } = require("../services/authentication");
const { checkRole } = require("../services/checkRole");
const {
  addCategory,
  getCategory,
  updateCategory,
} = require("../controllers/category.controller.js");

router.post("/add", authenticateToken, checkRole, addCategory);

router.get("/get", authenticateToken, checkRole, getCategory);

router.put("/put", authenticateToken, checkRole, updateCategory);
module.exports = router;
