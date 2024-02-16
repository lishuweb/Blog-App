import express, {Request,Response, NextFunction, Router } from 'express';
// import { PrismaClient } from '@prisma/client'; 
// const Prisma = new PrismaClient();
const router: Router = express.Router();



router.get('/', (req:Request,res:Response,next:NextFunction)=>{
try{
    res.send("hellow orld");

}catch(e){
    next(e);
}
});

export default router;
