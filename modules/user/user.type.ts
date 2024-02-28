export interface Registration {
    id?: number,
    name: string,
    email: string,
    password?: string,
    roles?: string,
    image: string
    isEmailVerified?: boolean,
    isActive?: boolean,
    isArchive?: boolean
};

export enum Role {
    USER, 
    ADMIN
};

export interface UserLogin {
    email: string,
    token: string
};
