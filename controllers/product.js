/**-----------------------------------------------
 * @desc    Add A New Product
 * @route   /product/add
 * @method  POST
 * @access  Private
 * @details Adds a new product to the database with the provided details.
 ------------------------------------------------*/
module.exports.addProduct = (req, res) => {
  const product = req.body; // Extract product details from request body

  // Insert a new product into the database
  connection.query(
    `INSERT INTO product (name, categoryId, description, price, status) VALUES (?, ?, ?, ?, "true")`,
    [product.name, product.categoryId, product.description, product.price], // Parameters for query
    (err, results) => {
      if (!err) {
        return res.status(200).json({ message: "Product added successfully" }); // Success response
      } else {
        return res.status(500).json(err); // Return server error on failure
      }
    }
  );
};

/**-----------------------------------------------
 * @desc    Get All Products
 * @route   /product/get
 * @method  POST
 * @access  Private
 * @details Retrieves all products and their associated category details.
 ------------------------------------------------*/
module.exports.getProduct = (req, res) => {
  // Fetch all products and join them with their category details
  connection.query(
    `SELECT p.id, p.name, p.description, p.price, p.status, c.id AS categoryId, c.name AS categoryName 
     FROM product AS p 
     INNER JOIN category AS c 
     WHERE p.categoryId = c.id`,
    (err, results) => {
      if (!err) {
        return res.status(200).json(results); // Success response with products
      } else {
        return res.status(500).json(err); // Return server error on failure
      }
    }
  );
};

/**-----------------------------------------------
 * @desc    Get Products By Category
 * @route   /product/getByCategory/:id
 * @method  POST
 * @access  Private
 * @details Retrieves all products in a specific category by category ID.
 ------------------------------------------------*/
module.exports.getProductCategory = (req, res, next) => {
  const id = req.params.id; // Extract category ID from request parameters

  // Fetch products belonging to a specific category
  connection.query(
    `SELECT id, name FROM product WHERE categoryId = ? AND status = "true"`,
    [id], // Category ID parameter
    (err, results) => {
      if (!err) {
        return res.status(200).json(results); // Success response with products
      } else {
        return res.status(500).json(err); // Return server error on failure
      }
    }
  );
};

/**-----------------------------------------------
 * @desc    Delete A Product
 * @route   /product/delete/:id
 * @method  DELETE
 * @access  Private
 * @details Deletes a product from the database by its ID.
 ------------------------------------------------*/
module.exports.deleteProduct = (req, res, next) => {
  const id = req.params.id; // Extract product ID from request parameters

  // Delete the product from the database
  connection.query(`DELETE FROM product WHERE id = ?`, [id], (err, results) => {
    if (!err) {
      if (results.affectedRows == 0) {
        return res.status(404).json({ message: "Product not found" }); // If product doesn't exist
      }
      return res.status(200).json({ message: "Deleted successfully" }); // Success response
    } else {
      return res.status(500).json(err); // Return server error on failure
    }
  });
};

/**-----------------------------------------------
 * @desc    Update A Product
 * @route   /product/update/:id
 * @method  PUT
 * @access  Private
 * @details Updates a product's details by its ID.
 ------------------------------------------------*/
module.exports.updateProduct = (req, res) => {
  const productId = req.params.id; // Extract product ID from request parameters
  const updates = req.body; // Extract updated fields from request body

  // Validate request body
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "Invalid data" }); // Return error for empty updates
  }

  // Generate update query based on provided fields
  const fields = Object.keys(updates)
    .map((key) => `${key}=?`)
    .join(",");
  const values = Object.values(updates);

  // Update the product in the database
  connection.query(
    `UPDATE product SET ${fields} WHERE id = ?`,
    [...values, productId], // Append product ID to the query parameters
    (err, results) => {
      if (!err) {
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Product not found" }); // If product doesn't exist
        }
        return res
          .status(200)
          .json({ message: "Updated successfully", results }); // Success response
      } else {
        return res.status(500).json(err); // Return server error on failure
      }
    }
  );
};
