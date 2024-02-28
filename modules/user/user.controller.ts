import { PrismaClient } from "@prisma/client"; 
const prisma = new PrismaClient();
import bcrypt from 'bcrypt';
import { Registration, UserLogin } from "./user.type"; 
import { generateToken } from "../../utils/jwt";
import { generateOTP, verifyOTP } from "../../utils/otp";
import { mail } from "../../services/mail";

const userData = async(): Promise<Registration[]> => {
    const response = await prisma.registration.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            roles: true,
            image: true,
        }
    });
    return JSON.parse(JSON.stringify(response));
};

const userById = async(id: number): Promise<Registration | null> => {
    const response = await prisma.registration.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            name: true,
            email: true,
            roles: true,
            image: true
        }
    });
    return JSON.parse(JSON.stringify(response));
};

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

const userUpdate = async(id: number, user: any) => {
    console.log(id, "ID");
    return await prisma.registration.update({
        where: {
            id: id
        },
        data: user
    });
};

const userDelete = async (id: number) => {
    return await prisma.registration.delete({
        where: {
            id: id
        }
    })
};

export default { userData, userCreate, userUpdate, userDelete, userById, userLogin, verifyUser };

