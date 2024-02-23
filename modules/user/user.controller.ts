import { PrismaClient } from "@prisma/client"; 
const prisma = new PrismaClient();
import bcrypt from 'bcrypt';
import { Registration } from "./user.type"; 
import { generateToken } from "../../utils/jwt";

const userData = async(): Promise<Registration[]> => {
    return await prisma.registration.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            roles: true,
            image: true
        }
    });
};

const userById = async(id: number): Promise<Registration | null> => {
    return await prisma.registration.findUnique({
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
};

const userCreate = async(user: any): Promise<Registration> => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(user.password, salt);
    return await prisma.registration.create({
        data: {
            ...user, 
            password: passwordHash
        }
    });
};

const userLogin = async (user: any): Promise<any> => {
    const userCheck = await prisma.registration.findUnique({
        where: {
            email: user.email
        }
    });
    if(userCheck)
    {
        const passwordCheck = await bcrypt.compare(user.password, userCheck.password);
        if(passwordCheck)
        {
            const userForToken = {
                email: userCheck.email,
                id: userCheck.id
            };
            const token = generateToken(userForToken)
            return {
                email: userCheck.email,
                token
            };
        }
        else 
        {
            throw new Error ("Email or Password is incorrect");
        }
    }
    else 
    {
        throw new Error ("User Not Found");
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

export default { userData, userCreate, userUpdate, userDelete, userById, userLogin };

