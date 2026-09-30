import * as authRepository from "../repository/auth.repository.js"
import * as OTPRepository from "../repository/otp.repsoitory.js"
import { sendEmail } from "../../../common/email/nodemailer.js"
import * as userRepository from "../../user/repository/user.repository.js"
import bcrypt from "bcrypt"
import crypto from "node:crypto"
import jwt from 'jsonwebtoken'
import {toMs,toSeconds} from "../../../common/utils/time.js"
import { invalidOtp, invalidPassword, otpExpired} from "../errors.js"
import { userAlreadyExist, userAlreadyVerified, userNotExist, userNotVerified } from "../../user/errors.js"
import {  generateOTPCode } from "../../../common/utils/otp.js"
import { logger } from "../../../common/logger/logger.js"
import { generateToken } from "../utils/token.js"
import { comparePassword, hashPassword } from "../utils/hash.js"
import { OAuth2Client } from "google-auth-library"
import { AppError } from "../../../common/error/error.js"
import { verifyGoogleToken } from "../../../common/utils/google-auth.js"
import { email } from "zod"


export async function register (userData){
    //1. check user exstance
    const userExist = await authRepository.checkUserExistByEmail(userData.email)
    //2. if yes , throw an error
    if (userExist) throw userAlreadyExist
    //3. prepare data [hash-password]
    userData.password = await hashPassword(userData.password)
    //4. save user into DB -> isVerified:false
    const createUser = await authRepository.createUser(userData);
    //5. generate and save OTP into DB
    const code = generateOTPCode();
    await OTPRepository.createOTP({
        code:code,
        email:userData.email,
        expiresAt: new Date(Date.now() + toMs(5,'minutes')),
    })
    //6. send email verification OTP
    await sendEmail(userData.email,'verification code',`<h1>Your verification code is ${code}</h1>`);
    return createUser

}

export async function verifyAccount(email,code){
    //1.check user existece
    const user = await authRepository.checkUserExistByEmail(email); //{} null
    //1.1 if not exist >> error "User not exist" 
    if(!user) throw userNotExist;
    //1.2 if isVerified = true >> "you already verified"
    if(user.isVerified === true)throw userAlreadyVerified;
    //2. check otp validationb
    const otp = await OTPRepository.getOtpByEmail(email); //{} null
    //2.1 not exist in DB >> error >> "otp expired" >> resend otp
    if(!otp) throw otpExpired;
    //2.2 otp stored in DB >> code not equal code stored >> >> error >> 'Invalid otp
    if(otp.code !== code) throw invalidOtp;
    //3. Switch your isVerified to true [Update User] 
    const updatedUser = await userRepository.updateUserByEmail(email,{isVerified:true});
    //4. Delete otp from DB
    await OTPRepository.deleteOTP(email);
    return updatedUser;
}

export async function login(email,password){
    //1.check user existance
    const user = await authRepository.checkUserExistByEmail(email);
    //1.1.not exist
    if(!user) throw userNotExist;
    //1.2not verified
    if(user.isVerified === false) throw userNotVerified;
    //2. comapre passwords
    const match =  await comparePassword(password,user['password']);
    if(!match) throw invalidPassword;
    //3. generate access token
    return generateToken({id:user._id,name:user.name});
}

export async function sendOtp(email){
    //1. check user existance
    const user = await authRepository.checkUserExistByEmail(email);
    if(!user) throw userNotExist;
    //2.delte old OTP
    await OTPRepository.deleteOTPsByEmail(email);
    //3.generate and save OTP into DB
    const code = generateOTPCode();
    logger.info(code)
    await OTPRepository.createOTP({
        code:code,
        email:email,
        expiresAt:Date.now()+toMs(3,'minutes')
    })
    //4.send OTP email
    await sendEmail(email,'new otp', `<p>Your new OTP is ${code}</p>`);
}

export async function resetPassword(email,code,newPassword){
    //1.verify otp code
    const otp = await OTPRepository.getOtpByEmail(email); //{}/null
    if(!otp)throw otpExpired;
    if(otp.code !== code) throw invalidOtp;
    //2.hash password
    const hashedPassword = await hashPassword(newPassword);
    //3.update user password
    await userRepository.updateUserByEmail(email,{password:hashedPassword});
    //4.delete otp
    await OTPRepository.deleteOTPsByEmail(email)
}

export async function loginWithGoogle(idToken){
    //1.verify id token
    const payload = await verifyGoogleToken(idToken);
    //2.check if userexist
    const user = await authRepository.checkUserExistByEmail(payload.email);
    //3.if exist >> generate token
    if(user){
        return generateToken({
            id:user._id,
            email:user.email,
        })
    }
    //4.if not exist create user and generae token
    const createdUser = await authRepository.createUser({
        name:payload.name,
        email:payload.email,
        provider: 'google',
        isVerified: true,
    }); // 30%
    return generatedToken({
        id: createdUser._id,
        email:createdUser.email,
    })
}

//zod-joi-yup-class-validatr