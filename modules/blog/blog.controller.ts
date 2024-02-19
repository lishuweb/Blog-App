import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const blogData = async(_req: Request, res: Response) => {
    const blogs = await prisma.blog.findMany();
    return res.status(200).json({blogs});
};

const blogDataId = async(id: string) => {
    return await prisma.blog.findUnique({
        where: { 
            id: parseInt(id) 
        },
    });
};

const blogCreate = async({title, author, likes, url}: any) => {
    return await prisma.blog.create({
        data: {
            title: title,
            author: author,
            likes: likes,
            url: url
        }
    });
};

const blogUpdate = async({id, title, author, likes, url} : any )=>{
    return await prisma.blog.update({
        where: {
            id: id     
        },
        data: {
            title: title,
            author: author,
            likes: likes,
            url: url
        }
    });
};

const blogDelete = async( id : number ) => {
    return await prisma.blog.delete({
        where: {
            id: id
        },
    });
};

export default { blogData, blogDataId, blogCreate, blogUpdate, blogDelete };