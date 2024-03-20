import { NextFunction, Request, Response } from "express";
import { authSchema } from "../modules/auth/auth.validator";

export const authVerifyValidator = (req: Request, _res: Response, next: NextFunction) => {
    try{
        const data = req.body;
        authSchema.parse(data);
        next();
    }
    catch(error)
    {
        next(error);
    }
};