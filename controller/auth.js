const bcrypt = require("bcrypt"); // Import bcrypt for hashing passwords
const User = require("../model/usermodels"); // Import the User model
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for creating and verifying JWTs
require("dotenv").config(); // Load environment variables from a .env file

// Signup handler
exports.signup = async (req, res) => {
  try {
    // Destructure data from request body
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required", // Return error if any field is missing
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists", // Return error if user already exists
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user entry
    const user = await User.create({
      name,
      email,
      password: hashedPassword, // Store the hashed password
      role,
    });

    // Return success response
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user, // Include the created user in the response
    });
  } catch (error) {
    console.error(error); // Log any error
    return res.status(500).json({
      success: false,
      message: "User cannot be registered, please try again later", // Return a generic error message
    });
  }
}; 

// Login handler
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "Enter all fields correctly", // Return error if email or password is missing
      });
    }

    // Check if the user is registered
    const user = await User.findOne({ email });

    // If user does not exist
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exist", // Return error if user is not found
      });
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (! isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Password entered is incorrect", // Return error if password is incorrect
      });
    }

    // Create the payload for the JWT
    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };

    // Generate JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" }); // Token expires in 2 hours

    // Convert user to a plain object and add the token
    const userObject = user.toObject();
    userObject.token = token; // Add token to the user object
    userObject.password = undefined; // Remove the password from the user object

    // Set the cookie options
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Cookie expires in 3 days
      httpOnly: true, // Cookie cannot be accessed via JavaScript
    };

    // Set the token in the cookie and send the response
    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user: userObject, // Include user object in the response
      message: "User logged in successfully",
    });

  } catch (error) {
    console.error(error); // Log any error
    return res.status(500).json({
      success: false,
      message: "Login failed", // Return a generic error message
    });
  }
};
