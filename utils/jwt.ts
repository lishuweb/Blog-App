import jwt, { JwtPayload } from 'jsonwebtoken';
import * as dotenv from "dotenv";
dotenv.config();
import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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

export const tokenExtractor = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers?.authorization)
    {
        res.status(401).json({
            error: "Token Missing!"
        });
    }
    const token = req.headers?.authorization?.split(" ")[1];
    (req as any).token = token;
    // req.token = token;
    next();
};

export const userExtractor = async (req: Request, _res: Response, next: NextFunction) => {
    const token = (req as any);
    const decodedToken = verifyToken(token ? token : "") as JwtPayload;
    const { email } = decodedToken;
    const userData = await prisma.registration.findUnique({
        where: {
            email
        }
    });
    if(!userData)
    {
        throw new Error ("User Not Found");
    }
    (req as any).userId = userData.id;
    next();
};

