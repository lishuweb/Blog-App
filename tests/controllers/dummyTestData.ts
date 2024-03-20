import { Role } from "@prisma/client";

jest.mock("bcrypt", () => ({
    hash: jest.fn().mockResolvedValue("hashedPassword"),
    compare: jest.fn().mockResolvedValue(true)
}));

export const newBlogPost = {
    id: 20,
    createdAt: new Date("2023-08-07"),
    title: "TypeScript",
    author: "Liza",
    likes: 60,
    url: "https://zod.dev/?id=optionals",
    userId: 3
  };
  
export const blogLists = [
    {
        id: 57,
        createdAt: new Date(),
        title: "TypeScript Part 1",
        author: "Lishu",
        likes: 20,
        url: "https://zod.dev/?id=optionals",
        userId: 6
    },
    {
        id: 58,
        createdAt: new Date(),
        title: "TypeScript Part 2",
        author: "Liza",
        likes: 54,
        url: "https://zod.dev/?id=optionals",
        userId: 3
    }
];

export const userGet = {
    id: 40,
    name: "Vedona",
    email: "vedona6586@dovesilo.com",
    password: "hashedPassword",
    image: "1710742896877-5472842.jpg",
    roles: "USER" as Role,
    isEmailVerified: false,
    isActive: false,
    isArchive: false,
    createdBy: 0,
    updatedBy: 0,
    currentRole: "USER" as Role
};

export const authUser = {
    email: userGet.email,
    token: 987654
};

export const userToPost = {
    name: "Myself",
    email: "me@gmail.com",
    password: "Mika@12345678",
    image: "1709805192826-5472842.jpg",
    id: 0, 
    roles: "USER" as Role, 
    isEmailVerified: false, 
    isActive: true, 
    isArchive: false,
    createdBy: 0, 
    updatedBy: 0, 
    currentRole: "USER" as Role, 
}

export const newUser = {
    ...userToPost,
    isEmailVerified: true,
    isActive: true,
    isArchive: false,
    createdBy: 0,
    updatedBy: 0,
}

export const userLists = [
    {
        id: 17,
        name: "Myself",
        email: "me@gmail.com",
        password: "hashedPassword",
        image: "1709805192826-5472842.jpg",
        roles: "USER" as Role,
        isEmailVerified: true,
        isActive: true,
        isArchive: false,
        createdBy: 0,
        updatedBy: 0,
        currentRole: "USER" as Role,
    },
    {
        id: 19,
        name: "MeMe",
        email: "meme@gmail.com",
        password: "hashedPassword",
        image: "1709805192826-5472842.jpg",
        roles: "USER" as Role,
        isEmailVerified: true,
        isActive: true,
        isArchive: false,
        createdBy: 0,
        updatedBy: 0,
        currentRole: "USER" as Role,
    }
];

export const archiveUserLists = [
    {
        id: 17,
        name: "Myself",
        email: "me@gmail.com",
        password: "hashedPassword",
        image: "1709805192826-5472842.jpg",
        roles: "USER" as Role,
        isEmailVerified: true,
        isActive: true,
        isArchive: false,
        createdBy: 0,
        updatedBy: 0,
        currentRole: "USER" as Role,
    },
    {
        id: 19,
        name: "MeMe",
        email: "meme@gmail.com",
        password: "hashedPassword",
        image: "1709805192826-5472842.jpg",
        roles: "USER" as Role,
        isEmailVerified: true,
        isActive: true,
        isArchive: false,
        createdBy: 0,
        updatedBy: 0,
        currentRole: "USER" as Role,
    }
];

