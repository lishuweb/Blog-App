import jwt, { JwtPayload } from 'jsonwebtoken';
import * as dotenv from "dotenv";
dotenv.config();

export const generateToken = (userData: any) => {
    if(!process.env.ACCESS_TOKEN_SECRET)
    {
        throw new Error ("Access Token Secret is not defined.")
    }
    const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '3m'
    }); 
    return accessToken;
};

export const generateRefreshToken = (userData: any) => {
    if(!process.env.REFRESH_TOKEN_SECRET)
    {
        throw new Error ("Refresh Token Secret is not defined.");
    }
    const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1h'
    });
    return refreshToken;
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "") as JwtPayload;
      } catch (error) {
        return null;
      }
};

export const verifyRefreshToken = (refreshToken: string) => {
    try {
        return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "") as JwtPayload;
      } catch (error) {
        return null;
      }
};



