const express = require("express");
const connection = require("../config/DB");
const router = express.Router();
const { authenticateToken } = require("../services/authentication");
const { checkRole } = require("../services/checkRole");
const {
  addProduct,
  getProduct,
  getProductCategory,
  deleteProduct,
  updateProduct,
} = require("../controllers/product");

router.post("/add", authenticateToken, checkRole, addProduct);

router.get("/get", authenticateToken, getProduct);

router.get("/getByCategory/:id", authenticateToken, getProductCategory);

router.delete("/delete/:id", authenticateToken, checkRole, deleteProduct);
router.put("/update/:id", authenticateToken, checkRole, updateProduct);
module.exports = router;
