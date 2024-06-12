const bcrypt = require("bcrypt");
const User = require("../model/usermodels");

 require("dotenv").config();

exports.signup = async (req, res) => {
    try {
        // Destructure data from request body
        const { name, email, password, role } = req.body;

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
