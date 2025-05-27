const express = require("express");
const connection = require("../config/DB");
/**-----------------------------------------------
 * @desc    Get All Dashboard Details
 * @route   /dashboard/details
 * @method  POST
 * @access  Private
 * @details Fetches counts of categories, products, and bills and returns them as a summary.
 ------------------------------------------------*/
module.exports.getDetails = (req, res, next) => {
  let categoryCount; // Variable to store category count
  let productCount; // Variable to store product count
  let billCount; // Variable to store bill count

  // Fetch the count of categories
  connection.query(
    `SELECT COUNT(id) AS categoryCount FROM category`,
    (err, results) => {
      if (!err) {
        categoryCount = results[0].categoryCount; // Save the result into the variable
      } else {
        return res.status(500).json(err); // Return server error on failure
      }
    }
  );

  // Fetch the count of products
  connection.query(
    `SELECT COUNT(id) AS productCount FROM product`,
    (err, results) => {
      if (!err) {
        productCount = results[0].productCount; // Save the result into the variable
      } else {
        return res.status(500).json(err); // Return server error on failure
      }
    }
  );

  // Fetch the count of bills and send the combined data
  connection.query(
    `SELECT COUNT(id) AS billCount FROM bill`,
    (err, results) => {
      if (!err) {
        billCount = results[0].billCount; // Save the result into the variable

        // Combine all counts into one object and return it
        const data = {
          category: categoryCount,
          product: productCount,
          bill: billCount,
        };

        return res.status(200).json(data); // Return success response
      } else {
        return res.status(500).json(err); // Return server error on failure
      }
    }
  );
};
