import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// import { Blog } from './blog.type';
import { blog } from '@prisma/client';

const blogData = async(): Promise<blog[]> => {
    return await prisma.blog.findMany();
};

const blogDataId = async(id: string): Promise<blog | null> => {
    return await prisma.blog.findUnique({
        where: { 
            id: Number(id), 
        },
    });
};

const blogCreate = async (blog: blog): Promise<blog> => {
    return await prisma.blog.create({
        data: blog
    });
};

const blogUpdate = async(id: number, updateBlog: blog ): Promise<blog | null>=>{
    return await prisma.blog.update({
        where: {
            id: id     
        },
        data: { ...updateBlog }
    });
};

const blogDelete = async( id : number ): Promise<blog> => {
    return await prisma.blog.delete({
        where: {
            id: id
        },
    });
};

export default { blogData, blogDataId, blogCreate, blogUpdate, blogDelete };