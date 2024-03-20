import { z } from "zod"; 

export const blogSchema = z.object({
    title: z.string().min(3),
    // author: z.string().min(3),
    likes: z.number().nonnegative(),
    url: z.string().url().min(3),
});

export const updateBlogSchema = blogSchema.partial();


