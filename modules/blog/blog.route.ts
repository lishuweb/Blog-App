import express, { Router, Request, Response } from 'express';
const router: Router  = express.Router();
import blogController from './blog.controller';

router.get('/', blogController.blogData);
router.get('/:id', async(req: Request, res: Response) => {
    const blogById = await blogController.blogDataId(req.params.id);
    res.status(200).json({
        data: blogById,
    });
});
router.post('/create', async(req: Request, res: Response) => {
    const myData = {
        title: req.body.title,
        author: req.body.author,
        likes: req.body.likes,
        url: req.body.url
    }
    const newBlog = await blogController.blogCreate(myData);
    res.status(201).json(newBlog);
});

router.put('/update/:id', async(req: Request, res: Response) => {
    const updateData = {
        id: parseInt(req.params.id),
        title: req.body.title,
        author: req.body.author,
        likes: req.body.likes,
        url: req.body.url
    }
    const newBlog = await blogController.blogUpdate(updateData);
    res.status(201).json(newBlog);
});
router.delete('/delete/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const deleteData = await blogController.blogDelete(id);
    res.status(200).json(deleteData);
  });

export default router;