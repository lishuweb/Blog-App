import express from 'express';
const router = express.Router();
import blogRouter from '../modules/blog/blog.route';
import userRouter from '../modules/user/user.routes';

router.use('/blogs', blogRouter);
router.use('/users', userRouter);
export default router;