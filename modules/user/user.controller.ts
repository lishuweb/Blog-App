import { PrismaClient } from "@prisma/client"; 
const prisma = new PrismaClient();
import { Registration } from "./user.type"; 
import bcrypt from 'bcrypt';

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

const userCreate = async (payload: Registration): Promise<Registration | null> => {
    let { password, roles, ...rest } = payload as {
        password: string,
        roles?: string,
    }
    const saltRounds = 10;
    rest.password = await bcrypt.hash(password, saltRounds);
    rest.roles = roles ? [roles] : [];
    rest.isEmailVerified = true;
    rest.isActive = true;
    const response = await prisma.registration.create({
        data: {
            rest
        }
    });
    return response;
};


export default { userData, userById, userCreate };

