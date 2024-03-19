import { registration } from "@prisma/client";
import prisma from "../../DB/db.config";
import userController from "../../modules/user/user.controller";
import {  userGet, userLists, userToPost } from "./dummyTestData";
import bcrypt from 'bcrypt';

jest.mock("bcrypt", () => ({
    hash: jest.fn().mockResolvedValue("hashedPassword"),
    compare: jest.fn().mockResolvedValue(true)
}));

describe('User Controller Test Cases', () => {

    beforeAll(async () => {
        await prisma.$connect();
    });
    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('Get all users', () => {
        it('provides lists of users', async () => {
            jest.clearAllMocks();
            jest.spyOn(prisma.registration, "findMany").mockResolvedValue(userLists);
            const isAdmin = true;
            const userDetails = await userController.userData(isAdmin);
            // console.log(userDetails, "User Details");
            expect(userDetails).toBeDefined();
            expect(userDetails).toEqual(userLists);
        });
        it('Throws an error if user is not admin', async () => {
            const isAdmin = false;
            await expect(userController.userData(isAdmin)).rejects.toThrow("You do not have permission to perform this action.");
        });
    });

    describe('Get user by id', () => {
        it('returns users details through id', async () => {
            jest.clearAllMocks();
            jest.spyOn(prisma.registration, "findUnique").mockResolvedValue(userGet);
            const id = 2;
            const isAdmin = true;
            const userDetails = await userController.userById(id, isAdmin);
            expect(userDetails).toBeDefined();
            expect(userDetails).toEqual(userGet);
        });
        it('Throws an error if user is not admin', async () => {
            const id = 2;
            const isAdmin = false;
            await expect(userController.userById(id,isAdmin)).rejects.toThrow("You do not have permission to perform this action.");
        });
    });

    describe('Create new user', () => {
        it('creates a new user', async () => {
            jest.clearAllMocks();
            jest.spyOn(prisma.registration, "create").mockResolvedValue(userGet);
            const isAdmin = true;
            const createUser = await userController.userCreate(isAdmin, userToPost);
            // console.log(createUser, "Create user test")
            expect(bcrypt.hash).toHaveBeenCalledWith(userToPost.password, 10);
            expect(createUser.password).toEqual(userGet.password);
            expect(createUser.email).toEqual(userGet.email);
            expect(userToPost.image).toBeDefined();
            // expect(createUser).toEqual(newUser);
            // expect(prisma.registration.create).toHaveBeenCalledWith({
            //     data: newUser
            // });
        });
        it('Throws error if user is not an admin', async () => {
            const isAdmin = false;
            await expect(userController.userCreate(isAdmin, userToPost)).rejects.toThrow("You do not have permission to perform this action bye!"); 
        });
    });

    describe('Update user', () => {
        it('updates a particular user through its id', async () => {
            jest.clearAllMocks();
            const userUpdateData = {
                id: userGet.id,
                name: "meme",
                email: 'memes@gmail.com',
                password: userGet.password,
                image: userGet.image,
                roles: userGet.roles,
                isEmailVerified: userGet.isEmailVerified,
                isActive: userGet.isActive,
                isArchive: userGet.isArchive,
                createdBy: userGet.createdBy,
                updatedBy: userGet.updatedBy,
                currentRole: userGet.currentRole
            };
            const isAdmin = true;
            jest.spyOn(prisma.registration, 'update').mockResolvedValue(userUpdateData);
            const updatedUser = await userController.userUpdate(userGet.id, userUpdateData, isAdmin);
            expect(updatedUser).toEqual(userUpdateData);
            expect(prisma.registration.update).toHaveBeenCalledWith({
                where: {
                    id: userGet.id
                },
                data: userUpdateData
            });
        });
        it('Throws error it user is not an admin', async () => {
            const isAdmin = userToPost.roles === "ADMIN" ? true : false;
            const id = userGet.id;
            const userUpdateData = {
                id: userGet.id,
                name: "meme",
                email: 'memes@gmail.com',
                password: userGet.password,
                image: userGet.image,
                roles: userGet.roles,
                isEmailVerified: userGet.isEmailVerified,
                isActive: userGet.isActive,
                isArchive: userGet.isArchive,
                createdBy: userGet.createdBy,
                updatedBy: userGet.updatedBy,
                currentRole: userGet.currentRole
            };
            await expect(userController.userUpdate(id, userUpdateData, isAdmin)).rejects.toThrow("You do not have permission to perform this action.");
        })
    });

    describe('Archive user', () => {
        it('Archives a paricular user through its id', async () => {
            jest.clearAllMocks();
            const data = {
                isArchive : true
            };
            const isAdmin = true;
            jest.spyOn(prisma.registration, "update").mockResolvedValue(data as registration);
            const blockUser = await userController.userBlock(userGet.id, isAdmin, data);
            expect(blockUser).toEqual(data);
            expect(prisma.registration.update).toHaveBeenCalledWith({
                where: {
                  id:  userGet.id
                },
                data: data
            });
        });
        it('Throws error it user is not an admin', async () => {
            const isAdmin = false;
            const id = userGet.id;
            const data = {
                isArchive : true
            };
            await expect(userController.userBlock(id, isAdmin, data)).rejects.toThrow("You don't have permission to perform this action.");
        });
    });

    describe('Delete User', () => {
        it('Deletes a particular user through its id', async () => {
            jest.clearAllMocks();
            const id = userGet.id;
            const isAdmin = true;
            jest.spyOn(prisma.registration, "delete").mockResolvedValue(userGet);
            const deleteUser = await userController.userDelete(id, isAdmin);
            expect(deleteUser).toEqual(userGet);
            expect(prisma.registration.delete).toHaveBeenCalledWith({
                where: {
                    id: userGet.id
                }
            });
        });
        it('Throws error if isAdmin is false', async () => {
            const isAdmin = false;
            const id = userGet.id;
            await expect(userController.userDelete(id, isAdmin)).rejects.toThrow("You do not have permission to perform this action.");
        });
    });

    describe('Get EmailVerified and Active Users', () => {
        it('Returns lists of user whose email is verified and is active', async () => {
            jest.clearAllMocks();
            const data = [{
                isEmailVerified: true,
                isActive: true
            }];
            jest.spyOn(prisma.registration, "findMany").mockResolvedValue(data as registration[]);
            const isAdmin = true;
            const activeUsers = await userController.activeUsers(isAdmin);
            // console.log(activeUsers, "Active Users");
            expect(prisma.registration.findMany).toHaveBeenCalledWith({
                where: {
                    isEmailVerified: true,
                    isActive: true
                }
            });
            expect(activeUsers).toEqual(data);
        });
        it('Throws error if isAdmin is false', async () => {
            jest.clearAllMocks();
            const isAdmin = false;
            const expectedErrorMessage = 'Not Valid User!';
            try{
                await userController.activeUsers(isAdmin);
                fail('Expected an error to be thrown');
            }
            catch(error)
            {
                expect(error.message).toEqual(expectedErrorMessage);
            }
        });
    });

    describe('Get Archive Users', () => {
        it('Returns lists of user who are archived', async () => {
            jest.clearAllMocks();
            const archiveData = [{
                isArchive: true
            }];
            jest.spyOn(prisma.registration, "findMany").mockResolvedValue(archiveData as registration[]);
            const isAdmin = true;
            const archiveUsers = await userController.archiveUsers(isAdmin);
            // console.log(archiveUsers, "Archive Users");
            expect(archiveUsers).toEqual(archiveData);
            expect(prisma.registration.findMany).toHaveBeenCalledWith({
                where: {
                    isArchive: true
                }
            });
        });
        it('should throw an error when called with a non-admin user', async () => {
            // Set up a mock non-admin user
            const isAdmin = false;
        
            // Call the function with the mock non-admin user
            await expect(userController.archiveUsers(isAdmin)).rejects.toThrow('Not Valid User!');
        });
    });

});