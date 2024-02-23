import jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";
dotenv.config();

export const generateToken = (userData: any) => {
    if(!process.env.ACCESS_TOKEN_SECRET)
    {
        throw new Error ("Access Token Secret is not defined.")
    }
    return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
};
