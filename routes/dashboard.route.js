const express = require("express");
const connection = require("../config/DB");
const router = express.Router();
const { authenticateToken } = require("../services/authentication");
const { checkRole } = require("../services/checkRole");
const { getDetails } = require("../controllers/dashbord.controller.js");
router.get("/details", authenticateToken, checkRole, getDetails);
module.exports = router;
