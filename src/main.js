import {config} from "dotenv"; //prefered to be in the first line for loading env variables before any other imports
//load env variables from .env file
config();

import './common/db/mongoose.js';
import express from "express";
import authRoute from "./app/auth/aut.route.js";
import messageRoute from "./app/message/message.route.js";
import userRoute from "./app/user/user.route.js";
import { OTP } from "./app/auth/model/otp.model.js";
import { Code } from "bson";

const app = express();
//parse incoing requests buffer to object
app.use(express.json());

//routes navigate to features
app.use('/auth', authRoute);
app.use('/message', messageRoute);
app.use('/user', userRoute);

//global error handler
app.use((err,req,res,next) =>{
    res.json({
        message:err.message,
        success:false,
        stack:err.stack
    })
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

OTP.create({
    code:"123456",
    email: "antonesam7@gmail.com",
    expiresAt: Date.now() + 30*1000
});