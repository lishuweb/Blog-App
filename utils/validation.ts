import { NextFunction, Request, Response } from "express";
import { verifyToken } from "./jwt";
import { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client"; 
const prisma = new PrismaClient();

export const isValidUser = (inputRole: string[], userRole: string) => {
    console.log(inputRole, "inputRole");
    console.log(userRole, "userRole");
    return inputRole.includes(userRole);
};

export const userValidation = (roles: string[]) => async (req: Request, _res: Response, next: NextFunction): Promise<any> => {
    try{
        const token = req.headers.authorization?.split(' ')[1];
        console.log(token, "TOKEN");
        const decodedToken = verifyToken(token ? token : "") as JwtPayload;
        const { email } = decodedToken;
        const userData = await prisma.registration.findUnique({
            where: {
                email
            }
        });
        console.log(userData, "User Data")
        if(!userData)
        {
            throw new Error ("User Not Found!");
        }
        (req as any).userId = userData.id;
        (req as any).userRole = userData.roles;
        console.log(userData.roles, "Role user")
        const checkRole = isValidUser(roles, userData.roles);
        console.log(checkRole, "Check role")
        if(!checkRole)
        {
            throw new Error ("Role is invalid!");
        }
        // res.json({
        //     checkRole
        // });

        next();
    }
    catch(error)
    {
        next(error);
    }
};