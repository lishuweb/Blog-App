import prisma from "../../DB/db.config";
// import { generateOTP, verifyOTP } from "../../utils/otp";
import * as OTP from "../../utils/otp";       
import * as JWT from "../../utils/jwt";                              //importing everything in OTP
import { mail } from "../../services/mail";
import authControllers from "../../modules/auth/auth.controllers";
import bcrypt from 'bcrypt';
import { auth, registration, Role } from "@prisma/client";
// import { authUser, userGet } from "./dummyTestData";

const userGet = {
    id: 40,
    name: "Vedona",
    email: "vedona6586@dovesilo.com",
    password: "hashedPassword",
    image: "1710742896877-5472842.jpg",
    roles: "USER" as Role,
    isEmailVerified: true,
    isActive: true,
    isArchive: false,
    createdBy: 0,
    updatedBy: 0,
    currentRole: "USER" as Role
};

const authUser = {
    email: "vedona6586@dovesilo.com",
    token: 987654
};

const userLoginData = {
    id: 40,
    name: "Vedona",
    email: "vedona6586@dovesilo.com",
    password: "hashedPassword",
    image: "1710742896877-5472842.jpg",
    roles: "USER" as Role,
    isEmailVerified: true,
    isActive: true,
    isArchive: false,
    createdBy: 0,
    updatedBy: 0,
    currentRole: "USER" as Role
};

jest.mock("bcrypt", () => ({
    hash: jest.fn().mockResolvedValue("hashedPassword"),
    compare: jest.fn().mockResolvedValue(true)
}));

jest.mock("../../utils/otp", () => ({
    generateOTP: jest.fn(() => 987654),
    verifyOTP: jest.fn(),
}));

jest.mock("../../services/mail", () => ({
    mail: jest.fn(
        () => "abc@gmail.com"
    )
}));

jest.mock("../../utils/jwt", () => ({
    generateToken: jest.fn().mockResolvedValue("jwtToken"),
    generateRefreshToken: jest.fn().mockResolvedValue("jwtToken"),
    verifyToken: jest.fn()
}));

describe('Auth Controller Test Cases', () => {

    beforeAll(async () => {
        await prisma.$connect();
    });
    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('Create Auth User', () => {
        it('Creates new auth user', async () => {
            jest.clearAllMocks();
            
            jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword" as never);
            jest.spyOn(OTP, "generateOTP").mockReturnValue("987654");
            jest.spyOn(prisma.registration, "create").mockResolvedValue(userGet as registration);
            jest.spyOn(prisma.auth, "create").mockResolvedValue(authUser as auth);
            const data = {
                name: "Lizna",
                email: "lizna@gmail.com",
                password: "Lizna@123456",
                image: "lizna.jpg"
            };
            const response = await authControllers.userCreate(data);
            // console.log(response, "Auth USer Responsw");
            expect(response).toEqual(userGet);
            expect(bcrypt.hash).toHaveBeenCalledWith(data.password, 10);
            expect(OTP.generateOTP).toHaveBeenCalledWith();
            const authUserCreate = await prisma.auth.create({
                data: authUser
            });
            expect(authUserCreate).toEqual(authUser);
            expect(mail).toHaveBeenCalledWith("lizna@gmail.com", 987654);
        });
    });

    describe('Verify Auth User', () => {
        it('Verifies Auth User', async () => {
            jest.clearAllMocks();
            const authUser = {
                email: 'test@example.com',
                token: 123456
            };
            jest.spyOn(prisma.auth, "findUnique").mockResolvedValue(authUser as auth);
            jest.spyOn(prisma.registration, "update").mockResolvedValue({
                isEmailVerified: true,
                isActive: true
            } as registration);
            jest.spyOn(prisma.auth, "delete").mockResolvedValue(authUser as auth);
            jest.spyOn(OTP, "verifyOTP").mockResolvedValue(true);
            const result = await authControllers.verifyUser({...authUser, token: '123456'});
            expect(result).toBe(true);
            expect(prisma.auth.findUnique).toHaveBeenCalledWith({
                where: {
                    email: authUser.email
                }
            });
            expect(prisma.auth.delete).toHaveBeenCalledWith({
                where: {
                    email: authUser.email
                }
            });
            expect(prisma.registration.update).toHaveBeenCalledWith({
                where: {
                    email: authUser.email
                },
                data: {
                    isEmailVerified: true,
                    isActive: true
                }
            });
            expect(OTP.verifyOTP).toHaveBeenCalledWith(String(authUser.token));
        });

        it('Throws error if user is not valid', async () => {
            jest.clearAllMocks();
            const data = {
                email: "lll@gmail.com",
                token: 987654
            };
            jest.spyOn(prisma.auth, "findUnique").mockResolvedValue(null);
            await expect(authControllers.verifyUser(data)).rejects.toThrow("Auth User Not Found, Do Register First");
            expect(prisma.auth.findUnique).toHaveBeenCalledWith({
                where: {
                    email: data.email
                }
            });
        });

        it('Throws error if token is not valid or expires', async () => {
            jest.clearAllMocks();
            const data = {
                email: "sss@gmail.com",
                token: 909090
            };
            jest.spyOn(prisma.auth, "findUnique").mockResolvedValue({
                email: data.email,
                token: data.token
            } as auth);
            jest.spyOn(OTP, "verifyOTP").mockResolvedValue(false);
            await expect(authControllers.verifyUser(data)).rejects.toThrow("Token doesnot matches.");
            // await expect(OTP.verifyOTP(String(data.token))).rejects.toThrow("Token is invalid");
            expect(OTP.verifyOTP).toHaveBeenCalledWith(String(data.token));
            expect(prisma.auth.findUnique).toHaveBeenCalledWith({
                where: {
                    email: data.email
                }
            });
        });

        it('Throws error if token doesnot matches', async () => {
            jest.clearAllMocks();
            const data = {
                email: "sss@gmail.com",
                token: 101010
            };
            jest.spyOn(prisma.auth, "findUnique").mockResolvedValue({
                email: data.email,
                token: data.token
            } as auth);
            jest.spyOn(OTP, "verifyOTP").mockResolvedValue(true);
            // const result = await authControllers.verifyUser(data);
            // console.log(result, "Mismatch Resut");
            // expect(result).toBe(true);
            await expect(authControllers.verifyUser(data)).rejects.toThrow("Token is not valid.");
            expect(OTP.verifyOTP).toHaveBeenCalledWith(String(data.token));
            expect(prisma.auth.findUnique).toHaveBeenCalledWith({
                where: {
                    email: data.email
                }
            });
        });

    });

    describe('User Login and Token Generates', () => {
        it('Login for auth user, generates access token and refresh token', async () => {
            jest.clearAllMocks();
            const userLogin = {
                email: "vedona6586@dovesilo.com",
                password: "Vedona@12345"
            };
            jest.spyOn(prisma.registration, "findUnique").mockResolvedValue(userLoginData);
            jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);
            await authControllers.userLogin(userLogin.email, userLogin.password);
            const userForToken = {
                email: userLogin.email,
                id: 40,
                name: userGet.name
            };
        
            jest.spyOn(JWT, "generateToken").mockReturnValue("jwtToken");
            jest.spyOn(JWT, "generateRefreshToken").mockReturnValue("jwtToken");
            expect(prisma.registration.findUnique).toHaveBeenCalledWith({
                where: {
                    email: userLogin.email
                }
            });
            expect(bcrypt.compare).toHaveBeenCalledWith(userLogin.password, "hashedPassword");
            expect(JWT.generateToken).toHaveBeenCalledWith(userForToken);
            expect(JWT.generateRefreshToken).toHaveBeenCalledWith(userForToken);
        });

        it('should throw an error for an invalid password', async () => {
            const userLogin = {
                email: userGet.email,
                password: "incorrectPassword"
            };
            jest.spyOn(prisma.registration, "findUnique").mockResolvedValue(userLoginData)
            jest.spyOn(bcrypt, "compare").mockReturnValue(false as never);
            await expect(authControllers.userLogin(userLogin.email, userLogin.password)).rejects.toThrow("Password did not matched!");
            expect(prisma.registration.findUnique).toHaveBeenCalledWith({
                where: {
                    email: userLogin.email
                }
            });
            expect(bcrypt.compare).toHaveBeenCalledWith(userLogin.password, "hashedPassword");
        });

        it('Throws error if user is not valid', async () => {
            const userLogin = {
                email: "invalidEmail",
                password: "Vedona@12345"
            };
            jest.spyOn(prisma.registration, "findUnique").mockResolvedValue(null);
            await expect(authControllers.userLogin(userLogin.email, userLogin.password)).rejects.toThrow("User does not exist, do register first!");
            expect(prisma.registration.findUnique).toHaveBeenCalledWith({
                where: {
                    email: userLogin.email
                }
            });
        });

        it('Throws error if user email is not verified or is true', async () => {
            const userLogin = {
                id: 40,
                name: "Vedona",
                email: "vedona6586@dovesilo.com",
                password: "hashedPassword",
                image: "1710742896877-5472842.jpg",
                roles: "USER",
                isEmailVerified: false,
                isActive: true,
                isArchive: false,
                createdBy: 0,
                updatedBy: 0,
                currentRole: "USER"
            };
            jest.spyOn(prisma.registration, "findUnique").mockResolvedValue(userLogin as registration);
            await expect(authControllers.userLogin(userLogin.email, userLogin.password)).rejects.toThrow("Email is not verified, please verify your email first!");
            expect(prisma.registration.findUnique).toHaveBeenCalledWith({
                where: {
                    email: userLogin.email
                }
            });
        });

        it('Throws error if user is not active', async () => {
            const userLogin = {
                id: 40,
                name: "Vedona",
                email: "vedona6586@dovesilo.com",
                password: "hashedPassword",
                image: "1710742896877-5472842.jpg",
                roles: "USER",
                isEmailVerified: true,
                isActive: false,
                isArchive: false,
                createdBy: 0,
                updatedBy: 0,
                currentRole: "USER"
            };
            jest.spyOn(prisma.registration, "findUnique").mockResolvedValue(userLogin as registration);
            await expect(authControllers.userLogin(userLogin.email, userLogin.password)).rejects.toThrow("Email is not active, please activate your email first!");
            expect(prisma.registration.findUnique).toHaveBeenCalledWith({
                where: {
                    email: userLogin.email
                }
            });
        });
    });

    describe('Forgot Password Token Generate', () => {
        it('Generates token for user if user forgets his/her password', async () => {
            jest.spyOn(prisma.registration, "findUnique").mockResolvedValue(userGet);
            jest.spyOn(OTP, "generateOTP").mockReturnValue("987654");
            const details = {
                email: userGet.email,
                token: 987654
            };
            jest.spyOn(prisma.auth, "create").mockResolvedValue(details as auth);
            const result = await authControllers.forgotPasswordToken(userGet.email);
            expect(result).toBe(true);
            // expect(OTP.generateOTP).toEqual("987654");
            expect(mail).toHaveBeenCalledWith("vedona6586@dovesilo.com", 987654);
            expect(prisma.registration.findUnique).toHaveBeenCalledWith({
                where: {
                    email: userGet.email
                }
            });
            expect(OTP.generateOTP).toHaveBeenCalledWith();
            expect(prisma.auth.create).toHaveBeenCalledWith({
                data: details
            });
        });

        it("Throws error if user is not found", async () => {
            const userDetails = {
                email: "invalidEmail",
                password: "Invalid@12345"
            }
            jest.spyOn(prisma.registration, "findUnique").mockResolvedValue(null);
            await expect(authControllers.forgotPasswordToken(userDetails.email)).rejects.toThrow("User Not Found, Please provide valid email!");
            expect(prisma.registration.findUnique).toHaveBeenCalledWith({
                where: {
                    email: userDetails.email
                }
            });
        });

    });

    describe('Forgot Password', () => {
        it('Generates new password if users forgets password', async () => {
            const userDetails = {
                email: userGet.email,
                password: "NewPassword@1",
                token: 987654
            };
            jest.spyOn(prisma.auth, "findUnique").mockResolvedValue(authUser as auth);
            jest.spyOn(OTP, "verifyOTP").mockReturnValue(true as never);
            jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword" as never);
            await authControllers.forgotPassword(userDetails.email, userDetails.password, userDetails.token);
            jest.spyOn(prisma.registration, "update").mockResolvedValue(
                {email: userDetails.email} as registration
            );
            jest.spyOn(prisma.auth, "delete").mockResolvedValue(authUser as auth);  
            expect(prisma.registration.findUnique).toHaveBeenCalledWith({
                where: {
                    email: userDetails.email
                }
            });
            expect(OTP.verifyOTP).toHaveBeenCalledWith("987654");
            expect(bcrypt.hash).toHaveBeenCalledWith(userDetails.password, 10);
            expect(prisma.registration.update).toHaveBeenCalledWith({
                where: {
                    email: userDetails.email
                },
                data: {
                    password: "hashedPassword"
                }
            });
            expect(prisma.auth.delete).toHaveBeenCalledWith({
                where: {
                    email: userDetails.email
                }
            })
        });

        it('Throws error if user is not valid', async () => {
            const userDetails = {
                email: userGet.email,
                password: "NewPassword@1",
                token: 987654
            };
            jest.spyOn(prisma.auth, "findUnique").mockResolvedValue(null);
            await expect(authControllers.forgotPassword(userDetails.email, userDetails.password, userDetails.token)).rejects.toThrow("User Not Found!");
            expect(prisma.auth.findUnique).toHaveBeenCalledWith({
                where: {
                    email: userDetails.email
                }
            });
        });

        it('Throws error if token is not valid', async () => {
            const userDetails = {
                email: userGet.email,
                password: "NewPassword@1",
                token: 987654
            };
            jest.spyOn(prisma.auth, "findUnique").mockResolvedValue(authUser as auth);
            jest.spyOn(OTP, "verifyOTP").mockResolvedValue(false);
            await expect(authControllers.forgotPassword(userDetails.email, userDetails.password, userDetails.token)).rejects.toThrow("Token isnot Valid");
            expect(prisma.auth.findUnique).toHaveBeenCalledWith({
                where: {
                    email: userDetails.email
                }
            });
        });

        it('Throws error if token does not matches', async () => {
            const userDetails = {
                email: userGet.email,
                password: "NewPassword@1",
                token: 989898
            };
            jest.spyOn(prisma.auth, "findUnique").mockResolvedValue(authUser as auth);
            jest.spyOn(OTP, "verifyOTP").mockReturnValue(true as never);
            await expect(authControllers.forgotPassword(userDetails.email, userDetails.password, userDetails.token)).rejects.toThrow("Token didn't matched!");
            expect(prisma.auth.findUnique).toHaveBeenCalledWith({
                where: {
                    email: userDetails.email
                }
            });
            expect(OTP.verifyOTP).toHaveBeenCalledWith(String(userDetails.token));
        });
    });

    describe('Token for Change Password', () => {
        it('Provides token if user wants to change password', async () => {
            jest.clearAllMocks();
            jest.spyOn(prisma.registration, "findUnique").mockResolvedValue(userGet);
            jest.spyOn(OTP, "generateOTP").mockReturnValue("987654");
            const userDetails = {
                email: userGet.email,
                token: 987654
            };
            jest.spyOn(prisma.auth, "create").mockResolvedValue(userDetails as auth);
            const result = await authControllers.changePasswordToken(userDetails.email);
            expect(result).toEqual(true);
            expect(mail).toHaveBeenCalledWith("vedona6586@dovesilo.com", 987654);
            expect(prisma.registration.findUnique).toHaveBeenCalledWith({
                where: {
                    email: userGet.email
                }
            });
            expect(OTP.generateOTP).toHaveBeenCalledWith();
            expect(prisma.auth.create).toHaveBeenCalledWith({
                data: userDetails
            }); 
        });

        it('Throws error if user is not valid', async () => {
            jest.spyOn(prisma.registration, "findUnique").mockResolvedValue(null);
            await expect(authControllers.changePasswordToken(userGet.email)).rejects.toThrow("User not found!");
            expect(prisma.registration.findUnique).toHaveBeenCalledWith({
                where: {
                    email: userGet.email
                }
            });
        });
    });

    describe('Change Password', () => {
        it('Changes Password for the user with new one', async () => {
            const userDetails = {
                email: "vedona6586@dovesilo.com",
                oldPassword: "Vedona@12345",
                newPassword: "Vedona@123456",
                token: 987654
            };
            jest.spyOn(prisma.auth, "findUnique").mockResolvedValue(authUser as auth);
            jest.spyOn(OTP, "verifyOTP").mockResolvedValue(true as never);
            jest.spyOn(prisma.registration, "findUnique").mockResolvedValue(userGet);
            jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);
            jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword" as never);
            jest.spyOn(prisma.registration, "update").mockResolvedValue(userGet);
            const result = await authControllers.changePassword(userDetails.email, userDetails.oldPassword, userDetails.newPassword, userDetails.token);
            expect(result).toEqual(true);
            expect(prisma.auth.findUnique).toHaveBeenCalledWith({
                where: {
                    email: userDetails.email
                }
            });
            expect(OTP.verifyOTP).toHaveBeenCalledWith("987654");
            expect(prisma.registration.findUnique).toHaveBeenCalledWith({
                where: {
                    email: userDetails.email
                }
            });
            expect(bcrypt.compare).toHaveBeenCalledWith(userDetails.oldPassword, "hashedPassword");
            expect(bcrypt.hash).toHaveBeenCalledWith(userDetails.newPassword, 10);
            expect(prisma.registration.update).toHaveBeenCalledWith({
                where: {
                    email: userDetails.email
                },
                data: {
                    password: "hashedPassword"
                }
            });
        });

        it('Throws error if user is not valid', async () => {
            const userDetails = {
                email: "invalidEmail",
                oldPassword: "Vedona@12345",
                newPassword: "Vedona@123456",
                token: 987654
            };
            jest.spyOn(prisma.auth, "findUnique").mockResolvedValue(null);
            await expect(authControllers.changePassword(userDetails.email, userDetails.oldPassword, userDetails.newPassword, userDetails.token)).rejects.toThrow("User Not Found, Please verify first!");
            expect(prisma.auth.findUnique).toHaveBeenCalledWith({
                where: {
                    email: userDetails.email
                }
            });
        });

        it('Throws error is token is not valid', async () => {
            const userDetails = {
                email: "vedona6586@dovesilo.com",
                oldPassword: "Vedona@12345",
                newPassword: "Vedona@123456",
                token: 98769854
            };
            jest.spyOn(prisma.auth, "findUnique").mockResolvedValue(authUser as auth);
            jest.spyOn(OTP, "verifyOTP").mockReturnValue(false as never);
            await expect(authControllers.changePassword(userDetails.email, userDetails.oldPassword, userDetails.newPassword, userDetails.token)).rejects.toThrow("Token is invalid, Please enter valid token!");
            expect(prisma.auth.findUnique).toHaveBeenCalledWith({
                where: {
                    email: userDetails.email
                }
            });
            expect(OTP.verifyOTP).toHaveBeenCalled();
        });

        it('Throws error if token does not matches', async () => {
            const userDetails = {
                email: "vedona6586@dovesilo.com",
                oldPassword: "Vedona@12345",
                newPassword: "Vedona@123456",
                token: 937847
            };
            jest.spyOn(prisma.auth, "findUnique").mockResolvedValue(authUser as auth);
            jest.spyOn(OTP, "verifyOTP").mockReturnValue(true as never);
            await expect(authControllers.changePassword(userDetails.email, userDetails.oldPassword, userDetails.newPassword, userDetails.token)).rejects.toThrow("Token expired!");
            expect(prisma.auth.findUnique).toHaveBeenCalledWith({
                where: {
                    email: userDetails.email
                }
            });
            expect(OTP.verifyOTP).toHaveBeenCalledWith(String(userDetails.token));
        });

        it('Throws error if user is not registered and active', async () => {
            const userLogin = {
                id: 40,
                name: "Vedona",
                email: "vedona6586@dovesilo.com",
                password: "hashedPassword",
                image: "1710742896877-5472842.jpg",
                roles: "USER",
                isEmailVerified: false,
                isActive: false,
                isArchive: false,
                createdBy: 0,
                updatedBy: 0,
                currentRole: "USER"
            };
            const userDetails = {
                email: userLogin.email,
                oldPassword: "Vedona@12345",
                newPassword: "Vedona@123456",
                token: 987654
            };
            jest.spyOn(prisma.auth, "findUnique").mockResolvedValue(authUser as auth);
            jest.spyOn(OTP, "verifyOTP").mockReturnValue(true as never);
            jest.spyOn(prisma.registration, "findUnique").mockResolvedValue(null);
            await expect(authControllers.changePassword(userDetails.email, userDetails.oldPassword, userDetails.newPassword, userDetails.token)).rejects.toThrow("User is not registered, Please register first!");
            expect(prisma.auth.findUnique).toHaveBeenCalledWith({
                where: {
                    email: userDetails.email
                }
            });
            expect(prisma.registration.findUnique).toHaveBeenCalledWith({
                where: {
                    email: userLogin.email,
                    isEmailVerified: true,
                    isActive: true
                }
            });
        });

        it('Throws error if old password does not matches', async () => {
            jest.clearAllMocks();
            const userDetails = {
                email: "vedona6586@dovesilo.com",
                oldPassword: "wrongPassword",
                newPassword: "Vedona@123456",
                token: 987654
            };
            jest.spyOn(prisma.auth, "findUnique").mockResolvedValue(authUser as auth);
            jest.spyOn(OTP, "verifyOTP").mockReturnValue(true as never);
            jest.spyOn(prisma.registration, "findUnique").mockResolvedValue(userLoginData);
            jest.spyOn(bcrypt, "compare").mockReturnValue(false as never);
            await expect(authControllers.changePassword(userDetails.email, userDetails.oldPassword, userDetails.newPassword, userDetails.token)).rejects.toThrow("Password didn't matched");
            expect(prisma.auth.findUnique).toHaveBeenCalledWith({
                where: {
                    email: userDetails.email
                }
            });
            expect(OTP.verifyOTP).toHaveBeenCalledWith("987654");
            expect(prisma.registration.findUnique).toHaveBeenCalledWith({
                where: {
                    email: userLoginData.email,
                    isEmailVerified: true,
                    isActive: true
                }
            });;
            expect(bcrypt.compare).toHaveBeenCalledWith(userDetails.oldPassword, "hashedPassword")

        });
    });

});