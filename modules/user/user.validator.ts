import { z } from "zod";

// const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;    //should contain number, digit, uppercase, lowercase and special character

const passwordRegex = /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{10,16}$/; 

export const userSchema = z.object({
        name: z.string({
            required_error: "Name field should contain some characters."
        }).min(1),
        email: z.string({
            required_error: "Email should be unique."
        }).email().min(1),
        password: z.string({ 
            required_error: "Password must contain 10 to 16 characters with at least one uppercase, one lowercase, one number, and one special character."
        }).min(8)
        .regex(passwordRegex),
        image: z.string({
            required_error: "Image field should contain image."
        })
});

export const updateUserSchema = userSchema.partial();


