import express, {NextFunction, Request, Response} from 'express';
const router = express.Router();
import userController from './user.controller';
import multer from 'multer';
import { updateUserSchemaValidator, userSchemaPostValidator } from '../../middleware/userSchemaValidator';
import { userValidation } from '../../utils/validation';

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        return cb(null, './public/users')
    },
    filename: function(_req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

router.get('/', async(_req: Request, res: Response) => {
    const userDetails = await userController.userData();
    res.status(200).json(userDetails);
});

router.get('/activeUsers', userValidation(["ADMIN"]), async (req: Request, res: Response, next: NextFunction) => {
    try{
        const isAdmin = (req as any).userRole;
        const response = await userController.activeUsers(isAdmin);
        res.status(200).json(response);
    }
    catch(error)
    {
        next(error);
    }
});

router.get('/archiveUsers', userValidation(["ADMIN"]), async (req: Request, res: Response, next: NextFunction) => {
    try{
        const isAdmin = (req as any).userRole;
        const response = await userController.archiveUsers(isAdmin);
        res.status(200).json(response);
    }
    catch(error)
    {
        next(error);
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try{
        const id = parseInt(req.params.id);
        const userDataById = await userController.userById(id);
        res.status(200).json({
            data: userDataById
        });
    }
    catch(error)
    {
        next(error);
    }
});

router.post('/', upload.single("image"), userSchemaPostValidator, userValidation(["ADMIN"]), async (req: Request, res: Response, next: NextFunction) => {
    try{
        req.body.image = req.file?.filename;
        req.body.createdBy = (req as any).userId;
        req.body.currentRole = (req as any).userRole;
        const response = await userController.userCreate(req.body);
        res.status(200).json(response);
    }
    catch(error)
    {
        next(error);
    }
});

router.put('/:id', upload.single("image"), updateUserSchemaValidator, userValidation(["ADMIN"]), async (req: Request, res: Response, next: NextFunction) => {
    try{
        const id = parseInt(req.params.id);
        req.body.image = req.file?.filename;
        req.body.createdBy = (req as any).userId;
        req.body.updatedBy = (req as any).userId;
        req.body.currentRole = (req as any).userRole;
        const response = await userController.userUpdate(id, req.body);
        res.status(200).json({
            data: response,
            message: "User Updated Successfully"
        });
    }
    catch(error)
    {
        next(error);
    }
});

router.put('/:id', userValidation(["ADMIN"]), async (req: Request, res: Response, next: NextFunction) => {
    try{
        const id = parseInt(req.params.id);
        const response = await userController.userBlock(id, req.body);
        res.status(200).json({
            data: response,
            message: "User is Archived!"
        });
    }
    catch(error)
    {
        next(error);
    }
});

router.delete('/:id', userValidation(["ADMIN"]), async (req: Request, res: Response, next: NextFunction) => {
    try{
        const id = parseInt(req.params.id);
        console.log(id, "ID");
        const response = await userController.userDelete(id);
        res.status(200).json({
            data: response,
            message: "User Deleted Successfully"
        });
    }
    catch(error)
    {
        next(error);
    }
});


export default router;

