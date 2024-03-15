import prisma from "../../DB/db.config";
import { Registration } from "./user.type"; 
import { registration } from "@prisma/client";
// import bcrypt from 'bcrypt';
import { bcryptPassword } from "../../utils/bcrypt";

const userData = async(): Promise<registration[]> => {
    const response = await prisma.registration.findMany({});
    return JSON.parse(JSON.stringify(response));
    // return response;
};

const activeUsers = async (isAdmin: boolean): Promise<registration[]> => {
    console.log(isAdmin, 'isAdmin');
    if(isAdmin)
    {
        return await prisma.registration.findMany({
            where: {
                isEmailVerified: true,
                isActive: true
            },
        });
    }
    else 
    {
        throw new Error ("Not Valid User!");
    }
};

const archiveUsers = async (isAdmin: boolean): Promise<registration[]> => {
    console.log(isAdmin, 'isAdmin');
    if(isAdmin)
    {
        return await prisma.registration.findMany({
            where: {
                isArchive: true
            }
        });
    }
    else 
    {
        throw new Error ("Not Valid User!");
    }
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

export default { userData, userById, userCreate, userUpdate, userBlock, userDelete, activeUsers, archiveUsers };

