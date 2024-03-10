import jwt, { JwtPayload } from 'jsonwebtoken';
import * as dotenv from "dotenv";
dotenv.config();
import { NextFunction, Request, Response } from 'express';

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
        const isValid = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "") as JwtPayload;
        return isValid;
    }
    catch(error)
    {
        throw new Error ("Invalid Token!");
    }
};

export const tokenExtractor = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers?.authorization)
    {
        res.status(401).json({
            error: "Token Missing!"
        });
    }
    const token = req.headers?.authorization?.split(" ")[1];
    console.log(token, "TOKEN");
    const isValid = verifyToken(token || "");
    if(!isValid)
    {
        throw new Error ("Token invalid");
    }
    req.body.userId = isValid.id;
    // req.token = token;
    next();
};


