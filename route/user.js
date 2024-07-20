const express = require("express");
const router = express.Router();

// Import the signup controller
const { login,signup } = require("../controller/auth");
const {auth,isStudent,isAdmin}=require("../middleware/user");

// Define the signup route
router.post("/signup", signup);
router.post("/login", login);


// protected route

// authentication route -- check that user is registetred or not 
router.get("/test",auth,(req,res)=>{
    res.json({
        success:true,
        message:"user is authenticated welcome "
    })
})

router.get("/student", auth,isStudent,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to the protected route of student portal "
    });

});


// protected route for admin portal 

router.get("/admin",auth,isAdmin,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to the protected route of Admin portal "
    });

})
// Export the router
module.exports = router;
