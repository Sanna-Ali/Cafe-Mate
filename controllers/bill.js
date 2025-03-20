const express = require("express");
const connection = require("../config/DB");
const fs = require("fs");
const path = require("path");
let ejs = require("ejs");
let pdf = require("html-pdf");
let uuid = require("uuid");
/**-----------------------------------------------
 * @desc    Generate A Report
 * @route   /bill/generateReport
 * @method  POST
 * @access  Private
 * @details Generates a PDF report for an order and saves it to the server.
 *          Also inserts the order details into the database.
 ------------------------------------------------*/
module.exports.generateReport = (req, res) => {
  const generatedUuid = uuid.v1(); // Generate a unique UUID for the report
  const orderDetails = req.body; // Extract order details from the request body
  const productDetailsJSON = JSON.stringify(orderDetails.productDetails); // Convert product details to JSON

  // Insert order details into the database
  connection.query(
    `INSERT INTO bill (name, uuid, email, contactNumber, paymentMethod, total, productDetails, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      orderDetails.name,
      generatedUuid,
      orderDetails.email,
      orderDetails.contactNumber,
      orderDetails.paymentMethod,
      orderDetails.totalAmount,
      productDetailsJSON,
      res.locals.iat, // Use the issued-at timestamp from the JWT
    ],
    (err, results) => {
      if (!err) {
        // Render the EJS template to generate the PDF
        ejs.renderFile(
          path.join(__dirname, "", "report.ejs"),
          {
            productDetails: orderDetails.productDetails,
            name: orderDetails.name,
            email: orderDetails.email,
            contactNumber: orderDetails.contactNumber,
            paymentMethod: orderDetails.paymentMethod,
            totalAmount: orderDetails.totalAmount,
          },
          (err, results) => {
            if (err) {
              res.status(500).json(err); // Return server error on failure
            } else {
              // Generate the PDF file
              pdf
                .create(results)
                .toFile(
                  "./generated_pdf/" + generatedUuid + ".pdf",
                  function (err, data) {
                    if (err) {
                      console.log(err);
                      return res.status(500).json(err); // Return server error on failure
                    } else {
                      console.log(data);
                      return res.status(200).json({ uuid: generatedUuid }); // Return the UUID of the generated PDF
                    }
                  }
                );
            }
          }
        );
      } else {
        res.status(500).json(err); // Return server error on failure
      }
    }
  );
};

/**-----------------------------------------------
 * @desc    Get PDF Report
 * @route   /bill/getPdf
 * @method  POST
 * @access  Private
 * @details Fetches a generated PDF report by UUID and sends it to the client.
 *          If the PDF does not exist, it generates a new one.
 ------------------------------------------------*/
module.exports.getPdf = (req, res) => {
  const orderDetails = req.body; // Extract order details from the request body
  const pdfPath = "./generated_pdf/" + orderDetails.uuid + ".pdf"; // Define the path to the PDF file

  if (fs.existsSync(pdfPath)) {
    // If the PDF file exists, send it to the client
    res.contentType("application/pdf");
    fs.createReadStream(pdfPath).pipe(res);
  } else {
    // If the PDF file does not exist, generate a new one
    const productDetailReport = JSON.parse(orderDetails.productDetails); // Parse product details from JSON
    ejs.renderFile(
      path.join(__dirname, "", "report.ejs"),
      {
        productDetails: productDetailReport,
        name: orderDetails.name,
        email: orderDetails.email,
        contactNumber: orderDetails.contactNumber,
        paymentMethod: orderDetails.paymentMethod,
        totalAmount: orderDetails.totalAmount,
      },
      (err, results) => {
        if (err) {
          res.status(500).json(err); // Return server error on failure
        } else {
          // Generate the PDF file
          pdf
            .create(results)
            .toFile(
              "./generated_pdf/" + orderDetails.productDetails + ".pdf",
              function (err, data) {
                if (err) {
                  console.log(err);
                  return res.status(500).json(err); // Return server error on failure
                } else {
                  res.contentType("application/pdf");
                  fs.createReadStream(pdfPath).pipe(res); // Send the PDF to the client
                }
              }
            );
        }
      }
    );
  }
};

/**-----------------------------------------------
 * @desc    Get All Bills
 * @route   /bill/getBills
 * @method  POST
 * @access  Private
 * @details Fetches all bills from the database, ordered by ID in descending order.
 ------------------------------------------------*/
module.exports.getBills = (req, res, next) => {
  connection.query(`SELECT * FROM bill ORDER BY id DESC`, (err, results) => {
    if (!err) {
      return res.status(200).json(results); // Return the list of bills
    } else {
      return res.status(500).json(err); // Return server error on failure
    }
  });
};

/**-----------------------------------------------
 * @desc    Delete Bill
 * @route   /bill/delete/:id
 * @method  DELETE
 * @access  Private
 * @details Deletes a bill from the database based on its ID.
 ------------------------------------------------*/
module.exports.deleteBill = (req, res, next) => {
  const id = req.params.id; // Extract the bill ID from the request parameters
  connection.query(`DELETE FROM bill WHERE id=?`, [id], (err, results) => {
    if (!err) {
      if (results.affectedRows == 0) {
        return res.status(404).json({ message: "Bill not found" }); // Return error if bill ID is invalid
      }
      return res.status(200).json({ message: "Deleted successfully" }); // Return success message
    } else {
      return res.status(500).json(err); // Return server error on failure
    }
  });
};
