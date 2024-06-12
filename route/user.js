const express = require("express");
const router = express.Router();

// Import the signup controller
const { signup } = require("../controller/auth");

// Define the signup route
router.post("/signup", signup);

// Export the router
module.exports = router;
