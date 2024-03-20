export interface Registration {
    id?: number,
    name: string,
    email: string,
    password?: string,
    roles?: string,
    image: string
    isEmailVerified?: boolean,
    isActive?: boolean,
    isArchive?: boolean,
    createdBy?: number,
    updatedBy?: number,
    currentRole?: string,
    blogs: number[]
};

export enum Role {
    USER, 
    ADMIN
};

export interface UserLogin {
    email: string,
    token: string
};
