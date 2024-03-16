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

router.get('/', userValidation(["ADMIN"]), async(req: Request, res: Response, next: NextFunction) => {
    try{
        const isAdmin = (req as any).userRole;
        const userDetails = await userController.userData(isAdmin);
        res.status(200).json(userDetails);
    }
    catch(error)
    {
        next(error);
    }
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

router.get('/:id', userValidation(["ADMIN"]), async (req: Request, res: Response, next: NextFunction) => {
    try{
        const id = parseInt(req.params.id);
        const isAdmin = (req as any).userRole;
        const userDataById = await userController.userById(id, isAdmin);
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
        const isAdmin = (req as any).userRole;
        const response = await userController.userCreate(isAdmin, req.body);
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
        const isAdmin = (req as any).userRole;
        const response = await userController.userUpdate(id, req.body, isAdmin);
        res.status(200).json(response);
    }
    catch(error)
    {
        next(error);
    }
});

router.put('/:id', userValidation(["ADMIN"]), async (req: Request, res: Response, next: NextFunction) => {
    try{
        const id = parseInt(req.params.id);
        const isAdmin = (req as any).userRole;
        const response = await userController.userBlock(id, isAdmin, req.body);
        res.status(200).json(response);
    }
    catch(error)
    {
        next(error);
    }
});

router.delete('/:id', userValidation(["ADMIN"]), async (req: Request, res: Response, next: NextFunction) => {
    try{
        const id = parseInt(req.params.id);
        const isAdmin = (req as any).userRole;
        console.log(id, "ID");
        const response = await userController.userDelete(id, isAdmin);
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

