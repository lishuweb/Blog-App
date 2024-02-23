import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const userSchemaPostValidator = (schema: any) => async(req: Request, res: Response, next: NextFunction) => {
    try{
        const userData = await schema.parseAsync(req.body);
        req.body = userData;
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
