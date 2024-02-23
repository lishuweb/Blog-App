import { z } from "zod";

// const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;    //should contain number, digit, uppercase, lowercase and special character

export const userSchema = z.object({
    name: z.string().min(1),
    email: z.string().email().min(1, {
        message: "Email should be unique."
    }),
    // password: z.string().min(8, {
    //     message: "Password must contain 8 or more characters."
    // }),
    password: z.string().min(8, { message: "Password must contain 8 or more characters."}),
    image: z.string()
});
