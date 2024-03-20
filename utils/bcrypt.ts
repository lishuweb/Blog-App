import bcrypt from 'bcrypt';

export const bcryptPassword = async (password: string) => {
    // const passwordHashed = bcrypt.hash(password, process.env.SALT_ROUNDS || "");
    return bcrypt.hash(password, Number(process.env.SALT_ROUNDS || ""));
    // return passwordHashed;
};

export const comparePassword = async (password: string, passwordHash: string) => {
    return bcrypt.compare(password, passwordHash);
};

// "hash" is asynchronous and hashSync is synschronous.