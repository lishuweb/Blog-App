import { PrismaClient, registration } from "@prisma/client"; 
const prisma = new PrismaClient();
import { Registration } from "./user.type"; 
// import bcrypt from 'bcrypt';
import { bcryptPassword } from "../../utils/bcrypt";

const userData = async(): Promise<Registration[]> => {
    const response = await prisma.registration.findMany();
    return JSON.parse(JSON.stringify(response));
};

const userById = async(id: number): Promise<Registration> => {
    console.log(id, "ID");
    const response = await prisma.registration.findUnique({
        where: {
            id: id
        }
    });
    return JSON.parse(JSON.stringify(response));
};

const userCreate = async (payload: registration): Promise<registration> => {
    const passwordHash = await bcryptPassword(payload.password ? payload.password : "");
    const newUser = {
        ...payload, password: passwordHash, isEmailVerified: true, isActive: true
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

const activeUsers = async (isAdmin: boolean) => {
    console.log(isAdmin, 'isAdmin');
    if(isAdmin)
    {
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
    }
    else 
    {
        throw new Error ("Not Valid User!");
    }
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

