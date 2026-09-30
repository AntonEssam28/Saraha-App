import { email, success } from "zod";
import { toMs } from "../../../common/utils/time.js";
import { validateBody } from "../../../common/validation/validation.js";
import { loginDTO, registerDTO, resetPasswordDTO, sendOtpDTO, verifyaccountDTO } from "../dto/auth.dto.js";
import * as authService from "../service/auth.service.js"

export async function register (req,res,next){
    try{
        const data = validateBody(registerDTO, req.body);
        const createdUser = await authService.register(body);
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
        const data = validateBody(verifyaccountDTO,req.body)
        const {email,code} = data;

        const updateUser =  await authService.verifyAccount(email,code);
        res.json({message: 'User Verified Successfuly' , success:true , data: updateUser})
    }catch(error){
        next(error);
    }
}

export async function login(req,res,next){
    try{
        const data = validateBody(loginDTO,req.body)
        const {email,password} = data
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
        const data = validateBody(sendOtpDTO,req.body);
        const { email } = data;
        await authService.sendOtp(email)
        res.json({message:'New OTP is Send, Please check your Email',success:true});
    }catch(error){
        next(error)
    }
} 

export async function resetPassword(req,res,next){
    try{
        const data = validateBody(resetPasswordDTO,req.body);
        const {email , code , newPassword} = data;
        await authService.resetPassword(email,code,newPassword);
        res.json({
            message: 'Password reset Successfully',
            success: true,
        })
    }catch(error){
        next(error)
    }
}

export async function loginWithGoogle(req,res,next){
    try{
        const token = await authService.loginWithGoogle(req.body.idToken);
        res.cookie('access_token',token,{
            httpOnly: true,
            maxAge: toMs(1,'hours'),
        });
        res.json({message:"User Login Successfully", success: true});
    }catch(error){
        next(error)
    }
}