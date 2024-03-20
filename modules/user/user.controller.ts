import prisma from "../../DB/db.config";
import { Registration } from "./user.type"; 
import { registration } from "@prisma/client";
// import bcrypt from 'bcrypt';
import { bcryptPassword } from "../../utils/bcrypt";

const userData = async(isAdmin: Boolean): Promise<registration[]> => {
    if(isAdmin)
    {
        try{
            const response = await prisma.registration.findMany({});
            return JSON.parse(JSON.stringify(response));
        }
        catch(error)
        {
            throw new Error ("Users Not Available!");
        }
    }
    else 
    {
        throw new Error ("You do not have permission to perform this action.");
    }
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

const userById = async(id: number, isAdmin: Boolean): Promise<Registration> => {
    if(isAdmin)
    {
        try{
            console.log(id, "ID");
            const response = await prisma.registration.findUnique({
                where: {
                    id: id
                }
            });
            return JSON.parse(JSON.stringify(response));
        }
        catch(error)
        {
            throw new Error ("User Not Found!");
        }
    }
    else 
    {
        throw new Error ("You do not have permission to perform this action.");
    }
};

const userCreate = async (isAdmin: boolean, payload: registration): Promise<registration> => {
    if(isAdmin)
    {
        try{
            const passwordHash = await bcryptPassword(payload.password ? payload.password : "");
            const newUser = {
                ...payload, password: passwordHash, isEmailVerified: true, isActive: true
            };
            console.log(newUser, "New User");
            return await prisma.registration.create({
                data: newUser
            });
        }
        catch(error)
        {
            throw new Error ("Error occured while creating user!");
        }
    }
    else 
    {
        throw new Error ("You do not have permission to perform this action bye!");
    }
};

const userUpdate = async (id: number, payload: registration, isAdmin: Boolean): Promise<registration> => {
    if(isAdmin)
    {
        try{
            return await prisma.registration.update({
                where: {
                    id: id
                },
                data: payload
            });
        }
        catch (error)
        {
            throw new Error ("User Not Found!");
        }
    }
    else 
    {
        throw new Error ("You do not have permission to perform this action.");
    }
};

export const userBlock = async (id: number, isAdmin: Boolean, payload: any): Promise<registration> => {
    if(isAdmin)
    {
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
    }
    else 
    {
        throw new Error ( "You don't have permission to perform this action.")
    }
};

export const userDelete = async (id: number, isAdmin: boolean) => {
    if(isAdmin)
    {
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
    }
    else 
    {
        throw new Error ("You do not have permission to perform this action.");
    }
};

export default { userData, userById, userCreate, userUpdate, userBlock, userDelete, activeUsers, archiveUsers };

