import {config} from "dotenv"; //prefered to be in the first line for loading env variables before any other imports
//load env variables from .env file
config();

import './common/db/mongoose.js';
import express from "express";
import authRoute from "./app/auth/auth.route.js";
import messageRoute from "./app/message/message.route.js";
import userRoute from "./app/user/user.route.js";
import { OTP } from "./app/auth/model/otp.model.js";
import { Code } from "bson";
import {AppError} from "./common/error/error.js";
import { logger } from "./common/logger/logger.js";
import cors from 'cors';


const app = express();
app.use(cors({origin:'http://localhost:4200'})); // the authorized to talk with the BE alomst the F.E users
//parse incoing requests buffer to object
app.use(express.json());

//routes navigate to features
app.use('/auth', authRoute);
app.use('/message', messageRoute);
app.use('/user', userRoute);

//global error handler
app.use((err,req,res,next) =>{
    logger.error(err.message,err);
    if(err.isOperational==true){
        return res.status(err.statusCode).json({
            message:err.message,
            success:false,
            stack: err.stack, //el line dh will be removednproduction 
    });
}
    return res.status(500).json({
        error: 'Something went wrong',
        success:false
    })
})


app.listen(3000,()=>logger.info('Server Started on Port 3000'));