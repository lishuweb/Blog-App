export interface Registration {
    id?: number,
    name: string,
    email: string,
    password?: string,
    roles?: string,
    image: string
};

export enum Role {
    USER, 
    ADMIN
}

