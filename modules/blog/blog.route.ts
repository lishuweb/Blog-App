import  express, {Request, Response} from 'express';
const router = express.Router();
import blogController from './blog.controller';
import { Blog } from './blog.type';

router.get('/', async(_req: Request, res: Response): Promise<Response<Blog[]>>=> {
    const blogDetails = await blogController.blogData();
    return res.status(200).json({blogs: blogDetails});
});
router.get('/:id', async(req: Request, res: Response): Promise<Response<Blog>>=> {
    const blogById = await blogController.blogDataId(req.params.id);
    return res.status(200).json({
        data: blogById,
    });
});

router.post('/', async(req: Request, res: Response): Promise<Response<Blog>> => {
    const newBlog = await blogController.blogCreate(req.body);
    return res.status(201).json(newBlog);
});

router.put('/:id', async(req: Request, res: Response): Promise<Response<Blog>> => {
    const newBlog = await blogController.blogUpdate(parseInt(req.params.id), req.body);
    return res.status(201).json(newBlog);
});
router.delete('/:id', async (req: Request, res: Response): Promise<Response<Blog>> => {
    const id = parseInt(req.params.id);
    const deleteData = await blogController.blogDelete(id);
    return res.status(200).json(deleteData);
});

export default router;