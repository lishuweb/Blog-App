import { z } from 'zod';

export const authSchema = z.object({
    email: z.string({
        required_error: "Email should be unique."
    }).email(),
    token: z.string()
});