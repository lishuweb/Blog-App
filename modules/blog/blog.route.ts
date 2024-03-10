import  express, {NextFunction, Request, Response} from 'express';
const router = express.Router();
import blogController from './blog.controller';
import { Blog } from './blog.type';
import { blogSchemaPostValidator, updateBlogSchemaValidator} from '../../middleware/blogSchemaValidator'; 
import { tokenExtractor, userExtractor } from '../../utils/jwt';

router.get('/', async(_req: Request, res: Response): Promise<Response<Blog[]>>=> {
    const blogDetails = await blogController.blogData();
    return res.status(200).json({data: blogDetails});
});

router.get('/:id', tokenExtractor, async(req: Request, res: Response): Promise<Response<Blog>>=> {
    const blogById = await blogController.blogDataId(req.params.id);
    return res.status(200).json({
        data: blogById,
    });
});

router.post('/', blogSchemaPostValidator, tokenExtractor, userExtractor, async(req: Request, res: Response, next: NextFunction) => {
    try{
        req.body.userId = (req as any).userId; 
        const newBlog = await blogController.blogCreate(req.body);
        res.status(201).json(newBlog);
    }
    catch(err)
    {
        next(err);
    }
});

router.put('/:id', updateBlogSchemaValidator, tokenExtractor, async(req: Request, res: Response): Promise<Response<Blog>> => {
    const newBlog = await blogController.blogUpdate(parseInt(req.params.id), req.body);
    return res.status(201).json(newBlog);
});

router.delete('/:id', tokenExtractor, async (req: Request, res: Response): Promise<Response<Blog>> => {
    const id = parseInt(req.params.id);
    const deleteData = await blogController.blogDelete(id);
    return res.status(200).json(deleteData);
});

export default router;