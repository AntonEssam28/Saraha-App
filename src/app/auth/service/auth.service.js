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


export async function register (userData){
    //1. check user exstance
    const userExist = await authRepository.checkUserExistByEmail(userData.email)
    //2. if yes , throw an error
    if (userExist) throw userAlreadyExist
    //3. prepare data [hash-password]
    userData.password = await bcrypt.hash(userData.password,10)
    //4. save user into DB -> isVerified:false
    const createUser = await authRepository.createUser(userData);
    //5. generate and save OTP into DB
    const code = generateOTPCode();
    await OTPRepository.createOTP({
        code:otp,
        email:userData.email,
        expiresAt: new Date(Date.now() + toMs(5,'minutes')),
    })
    //6. send email verification OTP
    await sendEmail(userData.email,'verification code',`<h1>Your verification code is ${otp}</h1>`);
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
    const match =  await bcrypt.compare(password,user.password);
    if(!match) throw invalidPassword;
    //3. generate access token
    const token = jwt.sign({id:user._id,email:user.email,name:user.name},process.env.JWT_SECRET,{expiresIn:toSeconds(1,'hours')});
    return token;
}

export async function sendOtp(email){
    //1. check user existance
    const user = await authRepository.checkUserExistByEmail(email);
    if(!user) throw userNotExist;
    //2.delte old OTP
    await OTPRepository.deleteOTPsByEmail(email);
    //3.generate and save OTP into DB
    const code = generateOTPCode();
    OTPRepository.createOTP({
        code:code,
        email:email,
        expiresAt:Date.now()+toMs(3,'minutes')
    })
    //4.send OTP email
    await sendEmail(email,'new otp', `<p>Your new OTP is ${code}</p>`);
}