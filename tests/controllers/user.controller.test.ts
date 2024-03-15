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
            const userDetails = await userController.userData();
            // console.log(userDetails, "User Details");
            expect(userDetails).toBeDefined();
            expect(userDetails).toEqual(userLists);
        });
    });

    describe('Get user by id', () => {
        it('returns users details through id', async () => {
            jest.clearAllMocks();
            jest.spyOn(prisma.registration, "findUnique").mockResolvedValue(userGet);
            const id = 2;
            const userDetails = await userController.userById(id);
            expect(userDetails).toBeDefined();
            expect(userDetails).toEqual(userGet);
        });
    });

    describe('Create new user', () => {
        it('creates a new user', async () => {
            jest.clearAllMocks();
            jest.spyOn(prisma.registration, "create").mockResolvedValue(userGet);
            const createUser = await userController.userCreate(userToPost);
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
            jest.spyOn(prisma.registration, 'update').mockResolvedValue(userUpdateData);
            const updatedUser = await userController.userUpdate(userGet.id, userUpdateData);
            expect(updatedUser).toEqual(userUpdateData);
            expect(prisma.registration.update).toHaveBeenCalledWith({
                where: {
                    id: userGet.id
                },
                data: userUpdateData
            });
        });
    });

    describe('Archive user', () => {
        it('Archives a paricular user through its id', async () => {
            jest.clearAllMocks();
            const blockData = {
                isArchive: true
            };

            jest.spyOn(prisma.registration, "update").mockResolvedValue(blockData as registration);
            const blockUser = await userController.userBlock(userGet.id, blockData);
            expect(blockUser).toEqual(blockData);
            expect(prisma.registration.update).toHaveBeenCalledWith({
                where: {
                  id:  userGet.id
                },
                data: blockData
              });
        });
    });

    describe('Delete User', () => {
        it('Deletes a particular user through its id', async () => {
            jest.clearAllMocks();
            const id = userGet.id;
            jest.spyOn(prisma.registration, "delete").mockResolvedValue(userGet);
            const deleteUser = await userController.userDelete(id);
            expect(deleteUser).toEqual(userGet);
            expect(prisma.registration.delete).toHaveBeenCalledWith({
                where: {
                    id: userGet.id
                }
            });
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
            console.log(archiveUsers, "Archive Users");
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