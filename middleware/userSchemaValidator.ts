import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { userSchema } from '../modules/user/user.validator';

export const userSchemaPostValidator = (req: Request, res: Response, next: NextFunction) => {
    try{
        const { name, email, password, roles } = req.body;
        const userDetails = {
            name,
            email,
            password,
            roles,
            image: req.file?.filename
        };
        console.log(userDetails, 'Checking try block')
        userSchema.parse(userDetails);
        next();
    }
    catch(error)
    {
        if(error instanceof z.ZodError)
        {
            console.log(error.errors, "Catched error");
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
