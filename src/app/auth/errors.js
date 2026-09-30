import {AppError} from "../../common/error/error.js";

export const invalidOtp = new AppError ('Invalid OTP.',404)
export const otpExpired = new AppError ('OTP Expired , Please resned OTP',400)
export const invalidPassword = new AppError ('Invalid Password.',403)