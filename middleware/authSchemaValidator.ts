import { NextFunction, Request, Response } from "express";
import { authSchema } from "../modules/auth/auth.validator";
import { z } from 'zod';

export const authSchemaPostValidator = (req: Request, res: Response, next: NextFunction) => {
    try{
        // const { email, token } = req.body;
        authSchema.parse(req.body);
        next();
    }
    catch(error)
    {
        if(error instanceof z.ZodError)
        {
            const errorMessage = error.errors.map((issue: any) => ({
                message: `${issue.path.join('.')} is ${issue.message}`,
            }));
            res.status(400).json({
                error: 'Invalid data', details: errorMessage
            });
        }
        else 
        {
            res.status(500).json({
                error: 'Server Error'
            });
        }
    }
};