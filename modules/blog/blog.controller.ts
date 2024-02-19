import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { Blog } from './blog.type';

const blogData = async(): Promise<Blog[]> => {
    return await prisma.blog.findMany();
};

const blogDataId = async(id: string): Promise<Blog | null> => {
    return await prisma.blog.findUnique({
        where: { 
            id: Number(id), 
        },
    });
};

const blogCreate = async (blog: Blog): Promise<Blog> => {
    return await prisma.blog.create({
        data: blog
    });
};

const blogUpdate = async(id: number, updateBlog: Blog ): Promise<Blog | null>=>{
    return await prisma.blog.update({
        where: {
            id: id     
        },
        data: updateBlog
    });
};

const blogDelete = async( id : number ): Promise<Blog> => {
    return await prisma.blog.delete({
        where: {
            id: id
        },
    });
};

export default { blogData, blogDataId, blogCreate, blogUpdate, blogDelete };