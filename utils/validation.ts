import { NextFunction, Request, Response } from "express";
import { verifyToken } from "./jwt";
import { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client"; 
const prisma = new PrismaClient();

export const userValidation = () => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try{
            const token = req?.headers?.authorization;
            if(!token)
            {
                throw new Error ("Authentication is required");
            }
            const bearerHeader = token.split("Bearer ")[1];
            const { payload }  = verifyToken(bearerHeader) as JwtPayload;
            if(!payload)
            {
                throw new Error ("Payload not available!");
            }
            const { email } = payload;
            const user = await prisma.registration.findUnique({
                where: {
                    email: email
                }
            });
            if(!user)
            {
                throw new Error ("Email Not Found!");
            }
            (req as any).currentUser = user.id;
            (req as any).currentRole = user.roles;
            next();
        }
        catch(error)
        {
            next(error);
        }
    };
};