import  express, {NextFunction, Request, Response} from 'express';
const router = express.Router();
import blogController from './blog.controller';
import { Blog } from './blog.type';
import { blogSchemaPostValidator, updateBlogSchemaValidator} from '../../middleware/blogSchemaValidator'; 
import { tokenExtractor } from '../../middleware/tokenExtractor';

router.get('/', async(_req: Request, res: Response): Promise<Response<Blog[]>>=> {
    const blogDetails = await blogController.blogData();
    return res.status(200).json(blogDetails);
});

router.get('/:id', tokenExtractor, async(req: Request, res: Response): Promise<Response<Blog>>=> {
    const id = parseInt(req.params.id);
    const blogById = await blogController.blogDataId(id);
    return res.status(200).json({
        data: blogById,
    });
});

router.post('/', blogSchemaPostValidator, tokenExtractor, async(req: Request, res: Response, next: NextFunction) => {
    try{
        // console.log(req.body.userId, "ID");
        // const name = (req as any).userName;
        // console.log(name, "name");
        const newBlog = await blogController.blogCreate(req.body);
        res.status(201).json(newBlog);
    }
    catch(err)
    {
        next(err);
    }
});

router.put('/:id', updateBlogSchemaValidator, tokenExtractor, async(req: Request, res: Response): Promise<Response<Blog>> => {
    const id = req.body.userId;
    const blogId = parseInt(req.params.id);
    const blog = (await blogController.blogDataId(blogId)) as Blog;
    if(!blog)
    {
        throw new Error ("Blog doesn't exist");
    }
    if(id !== blog.userId)
    {
        throw new Error ("This blog is not created by updating user");
    }
    const newBlog = await blogController.blogUpdate(blogId, req.body);
    return res.status(201).json(newBlog);
});

router.delete('/:id', tokenExtractor, async (req: Request, res: Response): Promise<Response<Blog>> => {
    const id = parseInt(req.params.id);
    const deleteData = await blogController.blogDelete(id);
    return res.status(200).json(deleteData);
});

export default router;