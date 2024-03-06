import jwt from 'jsonwebtoken';
import * as dotenv from "dotenv";
// import { NextFunction, Request, Response } from 'express';
dotenv.config();

export const generateToken = (userData: any) => {
    if(!process.env.ACCESS_TOKEN_SECRET)
    {
        throw new Error ("Access Token Secret is not defined.")
    }
    const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET);
    return accessToken;
};

export const verifyToken = (token: string) => {
    try{
        const isValid = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "");
        return isValid;
    }
    catch(error)
    {
        throw new Error ("Invalid Token!");
    }
};

