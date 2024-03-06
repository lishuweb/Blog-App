import { PrismaClient, registration } from "@prisma/client"; 
const prisma = new PrismaClient();
import { Registration } from "./user.type"; 
// import bcrypt from 'bcrypt';
import { bcryptPassword } from "../../utils/bcrypt";

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
            id
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

const userCreate = async (payload: registration): Promise<registration> => {
    // const saltRounds = 10;
    // const passwordHash = await bcrypt.hash(payload.password ? payload.password : "", saltRounds);
    const passwordHash = await bcryptPassword(payload.password ? payload.password : "");
    const newUser = {
        ...payload, password: passwordHash
    };
    console.log(newUser, "New User");
    return await prisma.registration.create({
        data: newUser
    });
};

const userUpdate = async (id: number, payload: registration): Promise<registration> => {
    return await prisma.registration.update({
        where: {
            id: id
        },
        data: payload
    });
};

export const userBlock = async (id: number, payload: any) => {
    const findUser = await prisma.registration.findUnique({
        where: {
            id: id
        }
    });
    if(!findUser)
    {
        throw new Error ("User Not Found!");
    }
    return await prisma.registration.update({
        where: {
            id: id
        },
        data: payload
    });
};

export const userDelete = async (id: number) => {
    const findUser = await prisma.registration.findUnique({
        where: {
            id: id
        }
    });
    console.log(findUser, "Find User");
    if(!findUser)
    {
        throw new Error ("User Not Found!");
    }
    return await prisma.registration.delete({
        where: {
            id: id
        }
    });
};

const activeUsers = async () => {
    return await prisma.registration.findMany({
        // where: {
        //     isEmailVerified: true,
        //     isActive: true
        // },
        select: {
            id: true,
            email: true,
            name: true,
            roles: true,
            image: true,
            isEmailVerified: true,
            isActive: true,
            createdBy: true
        }
    });
};

const archiveUsers = async () => {
    return await prisma.registration.findMany({
        where: {
            isArchive: true
        },
        select: {
            email: true,
            name: true,
            roles: true,
            image: true,
            isEmailVerified: true,
            isActive: true,
            isArchive: true,
            createdBy: true
        }
    });
};

export default { userData, userById, userCreate, userUpdate, userBlock, userDelete, activeUsers, archiveUsers };

