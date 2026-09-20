import { toMs } from "../../../common/utils/time.js";
import * as authService from "../service/auth.service.js"

export async function register (req,res,next){
    try{
        const createdUser = await authService.register(req.body)
        res.status(201).json({
            message:"User Created Successfull",
            success:true,
            data:createdUser
        })
    }catch(error){
        next(error);
    }
}

export async function verifyAccount(req,res,next){
    try{
        const { email,code } = req.body;
        const updateUser =  await authService.verifyAccount(email,code);
        res.json({message: 'User Verified Successfuly' , success:true , data: updateUser})
    }catch(error){
        next(error);
    }
}

export async function login(req,res,next){
    try{
        const {email,password} = req.body
        const token = await authService.login(email,password);
        res.cookie('access_token',token,{
            httpOnly:true, //BE http request -> set or modify not js code
            maxAge: toMs(1,"hours") //session >> 1h >> token >> remove >> logout >> login
        })
        res.json({message:'User Login Successfully' , success:true})
        
    }catch(error){
        next(error)
    }
}

export async function sendOtp(req,res,next){
    try{
        const { email } = req.body;
        await authService.sendOtp(email)
        res.json({message:'New OTP is Send, Please check your Email',success:true});
    }catch(error){
        next(error)
    }
} 