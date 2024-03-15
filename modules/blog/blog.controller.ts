import prisma from '../../DB/db.config';
// import { Blog } from './blog.type';
import { blog } from '@prisma/client';

const blogData = async(): Promise<blog[]> => {
const allBlog= await prisma.blog.findMany({});
// console.log(allBlog,'allblog frim blog')
return allBlog;
};

const blogDataId = async(id: number): Promise<blog | null> => {
    return await prisma.blog.findUnique({
        where: { 
            id: id, 
        },
    });
};

const blogCreate = async (blog: blog): Promise<blog> => {
    // const blogDetails = {
    //     data:
    // }
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