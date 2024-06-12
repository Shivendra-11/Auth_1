const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 4000;

app.use(express.json());

const cookieParser=require("cookie-parser");
app.use(cookieParser());

const { dbconnect } = require("./config/database");
dbconnect();

// Import route and mount
const user = require("./route/user");
app.use("/api/v1", user);

app.listen(PORT, () => {
    console.log("App is listening at", PORT);
});

app.get("/", (req, res) => {
    res.send("home baby");
});
