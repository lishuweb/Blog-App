import express, { Request, Response } from 'express';
const router = express.Router();
import blogRouter from '../modules/user/user.routes';

router.use('/users',blogRouter);






export default router;