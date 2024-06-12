const bcrypt = require("bcrypt");
const User = require("../model/usermodels");
const jwt = require("jsonwebtoken");
require("dotenv").config();

require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    // Destructure data from request body
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user entry
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Return success response
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered, please try again later",
    });
  }
};

// Login Handler



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "Enter all fields correctly",
      });
    }

    // Check if the user is registered
    const user = await User.findOne({ email });

    // If user does not exist
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exist",
      });
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Password entered is incorrect",
      });
    }

    // Create the payload for the JWT
    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };

    // Generate JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

    // Convert user to a plain object and add the token
    const userObject = user.toObject();
    userObject.token = token;
    userObject.password = undefined;

    // Set the cookie options
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true,
    };

    // Set the token in the cookie and send the response
    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user: userObject,
      message: "User logged in successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};
