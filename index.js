const express=require("express");
const app=express();

require("dotenv").config();
const PORT=process.env.PORT || 4000;

app.use(express.json());

require("./config/database").dbconnect();


// import route an dmount 

const user=require("./route/user");
app.use("./api/v1",user);

app.listen(PORT,()=>{
    console.log("app is listening at ",PORT);
})
app.get("/",(req,res)=>{
    res.send("home baby");
})