import { totp } from "otplib";

totp.options = { digits: 6, step: Number(process.env.OTP_DURATION) };
require("dotenv").config();

export const generateOTP = () => {                                              //generates token  for user to enter in the app
    totp.options = { 
        digits: 6, 
        step: 120
    };
    return totp.generate(process.env.OTP_SECRET || "");
};

export const verifyOTP = async (token: string) => {                             //returns boolean true if token is valid otherwise false
    totp.options = {
        digits: 6,
        step: 120
    };
    const isValid = totp.check(token, process.env.OTP_SECRET || "");
    return isValid;
};
