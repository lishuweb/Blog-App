import { Request, Response, NextFunction } from "express";
import { generateToken, verifyRefreshToken, verifyToken } from "../utils/jwt";

export const tokenExtractor = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers?.authorization)
    {
        res.status(401).json({
            error: "Token Missing!"
        });
        return;
    }
    const accessToken = req.headers?.authorization?.split(" ")[1];
    // const refreshToken = req.cookies.jwt;
    const refreshToken = String(req.headers["x-authorization"]);

    console.log(refreshToken, "Refresh Token");
    console.log(accessToken, "ACCESS TOKEN");
    
    const isValid = verifyToken(accessToken || "");
    console.log(isValid, "Is Valid");
    console.log(isValid?.id, "Is Valid Id");
    console.log(isValid?.name, "Is Valid Name");

    if(isValid)
    {
        req.body.userId = isValid.id;
        // req.body.userName = isValid.name;
        (req as any).userName = isValid.name;
        next();
    }

    else 
    {
        console.log("Else Block");
        const decoded = verifyRefreshToken(refreshToken); 
        console.log(decoded, "Decoded");
        if(decoded)
        {
            const userData = {
                id: decoded.id,
                email: decoded.email
            }
        
            const newAccessToken = generateToken(userData);
            console.log(newAccessToken, "New Access Token");
            res.setHeader("x-access-token", newAccessToken);
            req.body.userId = decoded.id;
        }
        if(!decoded)
        {
            throw new Error ("Token Expired, Please Login!");
        }
        next();
    }
};
