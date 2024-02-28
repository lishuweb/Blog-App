import express, {NextFunction, Request, Response} from 'express';
const router = express.Router();
import userController from './user.controller';
import multer from 'multer';
import { userSchemaPostValidator } from '../../middleware/userSchemaValidator';
// import { userSchema } from './user.validator';

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
        next(error)
    }
});

router.post('/', upload.single("image"), userSchemaPostValidator, async(req: Request, res: Response, next: NextFunction) => {
    try{
        if(req?.file)
        {
            req.body.image = req.file.filename;
        }
        const userCreate = await userController.userCreate(req.body);
        res.status(201).json({
            data: userCreate
        });
    }
    catch(error)
    {
        next(error);
    }
});

router.post('/verifyUser', async(req: Request, res: Response, next: NextFunction) => {
    try{
        const verifyUser = await userController.verifyUser(req.body);
        console.log(req.body, 'Request Body');
        console.log(verifyUser, "VerigyUser");
        res.status(200).json({
            data: verifyUser,
            message: "User Verified!"
        });
    }
    catch(error)
    {
        next(error);
    }
});

router.post('/login', async(req: Request, res: Response, next: NextFunction) => {
    try{
        const { email, password } = req.body;
        if(!email)
        {
            throw new Error("Email field is required!");
        }
        if(!password)
        {
            throw new Error("Password field is required!")
        }
        const loginData = await userController.userLogin(email, password);
        res.status(200).json({
            message: "User logged in successfully",
            data: loginData 
        });        
    }
    catch(error)
    {
        next(error);
    }
});

router.put('/:id', async(req: Request, res: Response, next: NextFunction) => {
    try{
        const userUpdate = await userController.userUpdate(parseInt(req.params.id),req.body);
        res.status(201).json({
            data: userUpdate
        });
    }
    catch(error)
    {
        next(error);
    }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try{
        const userDelete = await userController.userDelete(parseInt(req.params.id));
        res.status(201).json({
            message: "User deleted successfully",
            userDelete
        });
    }
    catch(error)
    {
        next(error);
    }
});

export default router;

