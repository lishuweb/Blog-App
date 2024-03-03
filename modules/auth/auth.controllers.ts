import { PrismaClient } from "@prisma/client"; 
const prisma = new PrismaClient();
import bcrypt from 'bcrypt';
import { generateOTP } from "../../utils/otp";
import { mail } from "../../services/mail";
import { Registration } from "../user/user.type";
import { verifyOTP } from "../../utils/otp";
import { UserLogin } from "./auth.type";
import { generateToken } from "../../utils/jwt";

const userCreate = async(user: any): Promise<Registration> => {
    const salt = 10;
    const {
        name, 
        email, 
        roles, 
        image, 
        isEmailVerified, 
        isActive, 
        isArchive
    } = user;
    console.log(user, "Lidhsu")
    const passwordHash = await bcrypt.hash(user.password, salt);
    const newUser = {
        name,
        email,
        password: passwordHash,
        roles,
        image,
        isEmailVerified,
        isActive,
        isArchive
    };
    const otpToken = generateOTP();
    const authUser = {
        email: newUser.email,
        token: +otpToken                 //converting into string
    };
    await prisma.auth.create({
        data: authUser,
    });
    await mail(user.email, +otpToken);      //sending OTP
    console.log(newUser, "NEW User");
    return await prisma.registration.create({
        data: newUser,
    });
};

const verifyUser = async(authUser: any) => {
    const {email, token} = authUser;
    console.log(authUser, "Auth Usre");
    const foundUser = await prisma.auth.findUnique({
        where: {
            email
        },
    });
    if(!foundUser)
    {
        throw new Error("Auth User Not Found, Do Register First");
    }
    const isValidToken = verifyOTP(String(token));
    if(!isValidToken)
    {
        throw new Error("Token is invalid");
    }
    const validUser = foundUser.token === token;
    if(!validUser)
    {
        throw new Error("User is not valid.")
    }
    await prisma.registration.update({
        where: {
            email: email
        },
        data: {
            isEmailVerified: true,
            isActive: true
        }
    });
    await prisma.auth.delete({
        where:{
            email: email
        }
    });
    return true;
};

const userLogin = async (email: string, password: string): Promise<UserLogin> => {
    const userCheck = await prisma.registration.findUnique({
        where: {
            email
        }
    });
    if(!userCheck)
    {
        throw new Error("User doesn't exist, do register first!");
    }
    if(!userCheck.isEmailVerified)
    {
        throw new Error("Email isn't verified, please verify your email first!");
    }
    if(!userCheck.isActive)
    {
        throw new Error("Email is not active, please activate your email first!");
    }
    const isPassword = await bcrypt.compare(password, userCheck.password);
    if(isPassword)
    {
        const userForToken = {
            email: userCheck.email,
            id: userCheck.id
        }
        const token = generateToken(userForToken);
        return {
            email: userCheck.email,
            token
        };
    }
    else 
    {
        throw new Error("Password didn't matched!");
    }
};

const forgotPasswordToken = async (email: string) => {
    const findUser = await prisma.registration.findUnique({
        where: {
            email: email,
            isEmailVerified: true,
            isActive: true
        }
    });
    console.log(findUser, "Find User");
    if(!findUser)
    {
        throw new Error("User Not Found, Please provide valid email!");
    }
    const token = generateOTP();
    await prisma.auth.create({
        data: {
            email: email,
            token: Number(token)
        }
    });
    await mail(email, token);
    return true;
};

const forgotPassword = async ( email: string, password: string, token: number ): Promise<boolean> => {
    const findUser = await prisma.auth.findUnique({
        where: {
            email
        }
    });
    if(!findUser)
    {
        throw new Error("User Not Found!");
    }
    const isValidToken = await verifyOTP(String(token));
    if(!isValidToken)
    {
        throw new Error("Token isnot Valid");
    }
    const isToken = findUser.token === token;
    if(!isToken)
    {
        throw new Error("Token didn't matched!");
    }
    const saltRounds = 10;
    await prisma.registration.update({
        where: {
            email
        },
        data: {
            password: await bcrypt.hash(password, saltRounds)
        }
    });
    await prisma.auth.delete({
        where: {
            email
        }
    });
    return true;
};

const changePasswordToken = async ( email: string ): Promise<Boolean> => {
    const user = await prisma.registration.findUnique({
        where: {
            email: email
        }
    });
    if(!user)
    {
        throw new Error('User not found!');
    }
    const token = generateOTP();
    await prisma.auth.create({
        data: {
            email,
            token: Number(token)
        }
    });
    await mail(email, token);
    return true;
};

const changePassword = async ( email: string, oldPassword: string, newPassword: string, token: number ) => {
    const userCheck = await prisma.auth.findUnique({
        where: {
            email
        }
    });
    console.log(oldPassword, "OLD PASSWORD");
    console.log(newPassword, "NEW PASSWORD");
    const saltRounds = 10;
    if(!userCheck)
    {
        throw new Error ("User Not Found, Please verify first!");
    }
    const tokenValid = verifyOTP(String(token));
    if(!tokenValid)
    {
        throw new Error ("Token is invalid, Please enter valid token!");
    }
    const tokenCheck = userCheck.token === token;
    if(!tokenCheck)
    {
        throw new Error ("Email is invalid!");
    }
    const registerUser = await prisma.registration.findUnique({
        where: {
            email,
            isEmailVerified: true,
            isActive: true
        }
    });
    if(!registerUser)
    {
        throw new Error ("User is not registered, Please register first!");
    }
    const passwordHash = await bcrypt.compare(oldPassword, registerUser.password);
    if(!passwordHash)
    {
        throw new Error ("Password didn't matched");
    }
    await prisma.registration.update({
        where: {
            email
        },
        data: {
            password: await bcrypt.hash(newPassword, saltRounds)
        }
    });
    return true;
};

export default { userCreate, verifyUser, userLogin, forgotPasswordToken, forgotPassword, changePasswordToken, changePassword };

// hffy yxeu lpuf szxb
