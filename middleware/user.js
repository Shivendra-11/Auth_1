const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware to authenticate JWT token
exports.auth = async (req, res, next) => {
  try {
    // Extract token from header
    const token = req.body.token  || req.cookies.token || req.header("Authorization").replace("Bearer ","");        

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found in body",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is not valid",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Middleware to check if user is a student
exports.isStudent = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authorized",
      });
    }

    if (req.user.role !== "Student") {
      return res.status(403).json({
        success: false,
        message: "User is not authorized to access student route",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Middleware to check if user is an admin
exports.isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authorized",
      });
    }

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "User is not authorized to access admin route",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
