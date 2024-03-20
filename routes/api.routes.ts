import express from 'express';
const router = express.Router();
import blogRouter from '../modules/blog/blog.route';
import userRouter from '../modules/user/user.routes';
import authRouter from '../modules/auth/auth.routes';

router.use('/blogs', blogRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);

export default router;