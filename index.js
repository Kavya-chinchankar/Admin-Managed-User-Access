const mongoose = require("mongoose");
mongoose.connect("mongodb://0.0.0.0:27017/user_management_system");

const express = require("express");
const app = express();

//for user route

const userRoute = require('./routes/userRoute');
app.use('/',userRoute);

// for admin route

const adminRoute = require('./routes/adminRoute');
app.use('/admin',adminRoute);


app.listen(3000,function(){
    console.log("Server is running")
})