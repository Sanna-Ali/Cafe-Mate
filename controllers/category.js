const express = require("express");
const connection = require("../config/DB");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const pdf = require("html-pdf");
const uuid = require("uuid");

/**-----------------------------------------------
 * @desc    Add A New Category
 * @route   /category/add
 * @method  POST
 * @access  Private
 * @details Adds a new category to the database.
 ------------------------------------------------*/
module.exports.addCategory = (req, res, next) => {
  let category = req.body; // Extract category data from the request body
  connection.query(
    `INSERT INTO category (name) VALUES (?)`,
    [category.name],
    (err, results) => {
      if (!err) {
        return res.status(200).json({ message: "Added successfully" }); // Return success message
      } else {
        return res.status(500).json(err); // Return server error on failure
      }
    }
  );
};

/**-----------------------------------------------
 * @desc    Get All Categories
 * @route   /category/get
 * @method  POST
 * @access  Private
 * @details Fetches all categories from the database, ordered by name.
 ------------------------------------------------*/
module.exports.getCategory = (req, res, next) => {
  connection.query(`SELECT * FROM category ORDER BY name`, (err, results) => {
    if (!err) {
      return res.status(200).json(results); // Return the list of categories
    } else {
      return res.status(500).json(err); // Return server error on failure
    }
  });
};

/**-----------------------------------------------
 * @desc    Update Category
 * @route   /category/put
 * @method  POST
 * @access  Private
 * @details Updates the name of a category based on its ID.
 ------------------------------------------------*/
module.exports.updateCategory = (req, res, next) => {
  let category = req.body; // Extract category data from the request body
  connection.query(
    `UPDATE category SET name=? WHERE id=?`,
    [category.name, category.id],
    (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: "Category ID not found" }); // Return error if category ID is invalid
        }
        return res
          .status(200)
          .json({ results, message: "Category updated successfully" }); // Return success message
      } else {
        return res.status(500).json(err); // Return server error on failure
      }
    }
  );
};
