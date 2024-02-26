import { z } from "zod";

// const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;    //should contain number, digit, uppercase, lowercase and special character

export const userSchema = z.object({
        name: z.string({
            required_error: "Name field should contain some characters."
        }).min(1),
        email: z.string({
            required_error: "Email should be unique."
        }).email().min(1),
        password: z.string({ 
            required_error: "Password must contain 8 or more characters."
        }).min(8),
        // roles: z.string({
        //     required_error: "Role is required"
        // }).min(1),
        image: z.string({
            required_error: "Image field should contain image."
        })
});

