import express, {NextFunction, Request, Response} from 'express';
const router = express.Router();
import userController from './user.controller';
import multer from 'multer';
import { userSchemaPostValidator } from '../../middleware/userSchemaValidator';
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
    res.status(200).json({
        data: userDetails
    }) ;
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try{
        const userDataById = await userController.userById(parseInt(req.params.id));
        res.status(200).json({
            data: userDataById
        });
    }
    catch(error)
    {
        next(error);
    }
});

router.post('/', upload.single("image"), userSchemaPostValidator, userValidation(["admin"]), async (req: Request, res: Response, next: NextFunction) => {
    try{
        req.body.images = req.file;
        req.body.createdBy = (req as any).currentUser;
        req.body.updatedBy = (req as any).currentUser;
        const response = await userController.userCreate(req.body);
        res.status(200).json({
            data: response,
            message: "Success"
        });
    }
    catch(error)
    {
        next(error);
    }
});



export default router;

