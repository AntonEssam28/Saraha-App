import { OTP } from '../model/otp.model.js';

async function createOTP(otpData){
    return await OTP.create(otpData)
}

export async function getOtpByEmail(email){
    return await OTP.findOne({email:email});
}

export function deleteOTPsByEmail(email){
    return OTP.deleteMany({email:email});
}

export {createOTP}