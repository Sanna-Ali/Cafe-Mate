//6
const router = require("express").Router();
const express = require("express");
const connection = require("../config/DB");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../services/authentication");
const { checkRole } = require("../services/checkRole");
const {
  signup,
  login,
  getUser,
  updateStatus,
  update,
  deleteUser,
} = require("../controllers/user");
require("dotenv").config();
//const connectToDb = require("./config/DB");

router.post("/signup", signup);
router.post("/login", login);
// get users
router.get("/get", getUser); //[]

//update admin
router.put("/updatestatus", updateStatus);
// my code
router.put("/update/:id", update);

router.delete("/delete/:id", authenticateToken, checkRole, deleteUser);

module.exports = router;

/////mycode
// console.log("lll");
// let user = req.body;
// query = `select email,password,role,status from user where email =?`;
// connection.query(query, [user.email], (err, results) => {
//   if (!err) {
//     if (results.length <= 0) {
//       console.log("11", results);
//       query = `insert into user(name,contactNumber,email,password,status,role) values (?,?,?,?,"false","user") `;
//       connection.query(
//         query,
//         [user.name, user.contactNumber, user.email, user.password, user.role],
//         (err, results) => {
//           if (!err) {
//             console.log("12221", results);
//             res.status(200).json({ message: "successfully registered" });
//           } else {
//             res.status(500).json(err);
//           }
//         }
//       );
//     } else {
//       return res.status(400).json("Emaily Already Exist");
//     }
//   } else {
//     return res.status(500).json(err);
//   }
// });
// });

////////////////////////////////////
// router.post("/signup", (req, res) => {
//   let user = req.body;
//   query = `SELECT email, password, role, status FROM user WHERE email = ?`;
//   connection.query(query, [user.email], (err, results) => {
//     if (err) {
//       return res.status(500).json(err);
//     }
//     if (results.length > 0) {
//       return res.status(400).json({ message: "Email already exists" });
//     } else {
//       query = `INSERT INTO user (name, contactNumber, email, password, status, role) VALUES (?, ?, ?, ?, "false", "user")`;
//       connection.query(
//         query,
//         [user.name, user.contactNumber, user.email, user.password],
//         (err, results) => {
//           if (err) {
//             return res.status(500).json(err);
//           }
//           return res.status(200).json({ message: "Successfully registered" });
//         }
//       );
//     }
//   });
// });
// const express = require('express');
// const mysql = require('mysql');
// const bodyParser = require('body-parser');

// const app = express();
// app.use(bodyParser.json());

// // إنشاء اتصال بقاعدة البيانات
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'your_database_name'
// });

// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to database:', err);
//     return;
//   }
//   console.log('Connected to database');
// });

// // تحديث المستخدم بناءً على الحقل المطلوب
// router.put("/update", (req, res) => {
//   const userId = req.body.id;
//   const updates = req.body.updates; // هذا سيكون كائنًا يحتوي على الحقول التي يرغب المستخدم في تحديثها

//   if (!userId || !updates) {
//     return res.status(400).json({ message: "User ID and updates are required" });
//   }

//   const updateQuery = `UPDATE user SET ? WHERE id = ?`;

//   connection.query(updateQuery, [updates, userId], (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: "Database error", error: err });
//     }

//     if (results.affectedRows === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     return res.status(200).json({ message: "User updated successfully", results });
//   });
// });

// // بدء الخادم
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
// Express route to handle the request
// router.put('/updateUser/:id', (req, res) => {
//   const id = req.params.id; // The ID of the user to be updated
//   const updates = req.body; // The values to be updated (an object containing columns and values)

//   // Validate the input data
//   if (!id || Object.keys(updates).length === 0) {
//     return res.status(400).json({ message: 'Invalid data' });
//   }

//   // Create a dynamic SQL query
//   const fields = Object.keys(updates)
//     .map((key) => `${key} = ?`) // Convert each column to the format "columnName = ?"
//     .join(', '); // Join the columns with commas

//   const values = Object.values(updates); // The values for the columns
//   values.push(id); // Add the user ID to the end of the values array

//   const query = `UPDATE user SET ${fields} WHERE id = ?`;

//   // Execute the query
//   connection.query(query, values, (err, results) => {
//     if (err) {
//       console.error('Error updating user:', err);
//       return res.status(500).json({ message: 'Database error', error: err });
//     }

//     // Send a success response
//     return res.status(200).json({ message: 'User updated successfully', results });
//   });
// });
//new
// router.put("/:id/update", (req, res) => {
//   const userId = req.params.id; // الحصول على معرف المستخدم من الرابط
//   const updates = req.body; // البيانات التي سيتم تحديثها

//   // تحقق من أن هناك بيانات للتحديث
//   if (Object.keys(updates).length === 0) {
//     return res.status(400).json({ message: "Invalid data" });
//   }

//   // بناء الحقول والقيم للتحديث
//   const fields = Object.keys(updates)
//     .map((key) => `${key}=?`) // إنشاء صيغة "field=?"
//     .join(","); // تحويل المصفوفة إلى سلسلة نصوص مفصولة بفاصلة
//   const values = Object.values(updates); // القيم الجديدة التي سيتم استخدامها في التحديث

//   console.log("fields", fields); // عرض الحقول للتصحيح
//   console.log("values", values); // عرض القيم للتصحيح

//   // تنفيذ استعلام التحديث
//   const query = `UPDATE user SET ${fields} WHERE id = ?`; // استعلام SQL
//   connection.query(query, [...values, userId], (err, results) => {
//     if (!err) {
//       if (results.affectedRows === 0) {
//         return res.status(404).json({ message: "User not found" }); // إذا لم يتم العثور على المستخدم
//       }
//       return res
//         .status(200)
//         .json({ message: "Update successfully", results }); // نجاح التحديث
//     } else {
//       return res.status(500).json(err); // خطأ في الخادم
//     }
//   });
// });
