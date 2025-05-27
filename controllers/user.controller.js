const connection = require("../config/DB");
const jwt = require("jsonwebtoken");

/**-----------------------------------------------
 * @desc    Add A New User
 * @route   /user/signup
 * @method  POST
 * @access  Private
 * @details Registers a new user by inserting their details into the database.
 *          Checks if the email already exists before creating the user.
 ------------------------------------------------*/
module.exports.signup = (req, res) => {
  let user = req.body; // Extract user data from the request body
  if (Object.keys(user).length === 0) {
    return res.status(400).json({ message: "Invalid data" }); // Return error if request body is empty
  }

  // Check if the email already exists in the database
  connection.query(
    `SELECT email, password, role, status FROM user WHERE email = ?`,
    [user.email],
    (err, results) => {
      if (!err) {
        if (results.length <= 0) {
          // If email does not exist, insert the new user
          connection.query(
            `INSERT INTO user (name, contactNumber, email, password, status, role) VALUES (?, ?, ?, ?, "false", "user")`,
            [user.name, user.contactNumber, user.email, user.password],
            (err, results) => {
              if (!err) {
                res
                  .status(200)
                  .json({ message: "Successfully registered", results }); // Return success message
              } else {
                res.status(500).json(err); // Return server error on failure
              }
            }
          );
        } else {
          return res
            .status(400)
            .json({ message: "Email already exists", results }); // Return error if email already exists
        }
      } else {
        return res.status(500).json(err); // Return server error on failure
      }
    }
  );
};

/**-----------------------------------------------
 * @desc    Login User
 * @route   /user/login
 * @method  POST
 * @access  Private
 * @details Authenticates a user by checking their email and password.
 *          If successful, generates a JWT token for the user.
 ------------------------------------------------*/
module.exports.login = (req, res) => {
  const user = req.body; // Extract user data from the request body

  // Fetch user details from the database
  connection.query(
    `SELECT email, password, role, status FROM user WHERE email = ?`,
    [user.email],
    (err, results) => {
      if (!err) {
        if (results.length <= 0 || results[0].password !== user.password) {
          return res
            .status(401)
            .json({ message: "Incorrect email or password" }); // Return error if email or password is incorrect
        } else if (results[0].status === "false") {
          return res.status(401).json({ message: "Wait for admin approval" }); // Return error if user is not approved
        } else if (results[0].password === user.password) {
          const respo = { email: results[0].email, role: results[0].role }; // Create payload for JWT
          const token = jwt.sign(respo, process.env.JWT_SECRET); // Generate JWT token
          res.status(200).json({ token }); // Return the token
        } else {
          return res
            .status(400)
            .json({ message: "Something went wrong, please try again later" }); // Return generic error
        }
      } else {
        return res.status(500).json(err); // Return server error on failure
      }
    }
  );
};

/**-----------------------------------------------
 * @desc    Get All Users
 * @route   /user/get
 * @method  GET
 * @access  Private
 * @details Fetches all users with the role "user" from the database.
 ------------------------------------------------*/
module.exports.getUser = (req, res) => {
  connection.query(
    `SELECT id, name, email, contactNumber, status FROM user WHERE role = "user"`,
    (err, results) => {
      if (!err) {
        return res.status(200).json(results); // Return the list of users
      } else {
        return res.status(500).json(err); // Return server error on failure
      }
    }
  );
};

/**-----------------------------------------------
 * @desc    Update User Status
 * @route   /user/updatestatus
 * @method  PUT
 * @access  Private
 * @details Updates the status of a user (e.g., active/inactive) based on their ID.
 ------------------------------------------------*/
module.exports.updateStatus = (req, res) => {
  let user = req.body; // Extract user data from the request body
  connection.query(
    `UPDATE user SET status = ? WHERE id = ?`,
    [user.status, user.id],
    (err, results) => {
      if (!err) {
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "User ID does not exist" }); // Return error if user ID is invalid
        }
        return res
          .status(200)
          .json({ message: "User updated successfully", results }); // Return success message
      } else {
        return res.status(500).json(err); // Return server error on failure
      }
    }
  );
};

/**-----------------------------------------------
 * @desc    Update User Details
 * @route   /user/update/:id
 * @method  PUT
 * @access  Private
 * @details Updates user details (e.g., name, email, contactNumber) based on their ID.
 ------------------------------------------------*/
module.exports.update = (req, res) => {
  const userId = req.params.id; // Extract user ID from the request parameters
  const updates = req.body; // Extract updates from the request body

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "Invalid data" }); // Return error if request body is empty
  }

  const fields = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(", "); // Create SQL fields string
  const values = Object.values(updates); // Extract values from the updates

  // Update the user details in the database
  connection.query(
    `UPDATE user SET ${fields} WHERE id = ?`,
    [...values, userId],
    (err, results) => {
      if (!err) {
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "User not found" }); // Return error if user ID is invalid
        }
        return res
          .status(200)
          .json({ message: "User updated successfully", results }); // Return success message
      } else {
        return res.status(500).json(err); // Return server error on failure
      }
    }
  );
};

/**-----------------------------------------------
 * @desc    Delete User
 * @route   /user/delete/:id
 * @method  DELETE
 * @access  Private
 * @details Deletes a user from the database based on their ID.
 ------------------------------------------------*/
module.exports.deleteUser = (req, res, next) => {
  const id = req.params.id; // Extract user ID from the request parameters

  // Delete the user from the database
  connection.query(`DELETE FROM user WHERE id = ?`, [id], (err, results) => {
    if (!err) {
      if (results.affectedRows == 0) {
        return res.status(404).json({ message: "User not found" }); // Return error if user ID is invalid
      }
      return res.status(200).json({ message: "User deleted successfully" }); // Return success message
    } else {
      return res.status(500).json(err); // Return server error on failure
    }
  });
};
