import { z } from "zod";
import { Request, Response, NextFunction } from "express"; 

export const blogSchemaPostValidator = (schema: any) => async(req: Request, res: Response, next: NextFunction) => {
    try{
        const blogData = await schema.parseAsync(req.body);
        req.body = blogData;
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

export const updateBlogSchemaValidator = (schema: any) => async(req: Request, res: Response, next: NextFunction) => {
    try{
        const updateData = await schema.parseAsync(req.body);
        req.body = updateData;
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
                error: 'Invalid data', errorMessage
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