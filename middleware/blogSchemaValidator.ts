import { z } from "zod";
import { Request, Response, NextFunction } from "express"; 
import { blogSchema, updateBlogSchema } from "../modules/blog/blog.validator";

export const blogSchemaPostValidator = (req: Request, res: Response, next: NextFunction) => {
    try{
        blogSchema.parseAsync(req.body);
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

export const updateBlogSchemaValidator = (req: Request, res: Response, next: NextFunction) => {
    try{
        updateBlogSchema.parseAsync(req.body);
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