import express, {NextFunction, Request, Response} from 'express';
const router = express.Router();
import multer from 'multer';
import { userSchemaPostValidator } from '../../middleware/userSchemaValidator';
import authControllers from './auth.controllers';
import { authVerifyValidator } from '../../middleware/authSchemaValidator';

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        return cb(null, './public/users')
    },
    filename: function(_req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

router.post('/', upload.single("image"), userSchemaPostValidator, async(req: Request, res: Response, next: NextFunction) => {
    try{
        if(req?.file)
        {
            req.body.image = req.file.filename;
        }
        const userCreate = await authControllers.userCreate(req.body);
        res.status(201).json(userCreate);
    }
    catch(error)
    {
        next(error);
    }
});

router.post('/verifyUser', authVerifyValidator, async(req: Request, res: Response, next: NextFunction) => {
    try{
        const verifyUser = await authControllers.verifyUser(req.body);
        // console.log(req.body, 'Request Body');
        // console.log(verifyUser, "VerigyUser");
        res.status(200).json(verifyUser);
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
        console.log(email, "email");
        console.log(password, "password");
        const loginData = await authControllers.userLogin(req.body.email, req.body.password);

        console.log(loginData, "Login Data");
        const {userEmail, name, accessToken, refreshToken} = loginData;
        res.cookie(
            'jwt', refreshToken, {
                httpOnly: true,
                sameSite: 'none',                                           //'None' - Typescript Error
                secure: true,                                 
                maxAge: 24 * 60 * 60 * 1000
            }
        );
        res.status(200).json({
            userEmail,
            name,
            accessToken
        });        
    }
    catch(error)
    {
        next(error);
    }
});

router.post('/forgotpasswordtoken', async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {email} = req.body;
        if(!email)
        {
            throw new Error("Email field is missing!");
        }
        const response = await authControllers.forgotPasswordToken(email);
        res.status(201).json({
            data: response
        });
    }
    catch(error)
    {
        next(error);
    }
});

router.post('/forgotpassword', async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { email, password, token } = req.body;
        const data = await authControllers.forgotPassword( email, password, token );
        res.status(201).json({
            data: data
        });
    }
    catch(error)
    {
        next(error);
    }
});

router.post('/changepasswordtoken', async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { email } = req.body;
        if(!email)
        {
            throw new Error ("Email field is required!");
        }
        const data = await authControllers.changePasswordToken( email );
        res.status(201).json({
            data: data
        });
    }
    catch(error)
    {
        next(error);
    }
});

router.put('/changepassword', async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { email, oldPassword, newPassword, token } = req.body;
        const data = await authControllers.changePassword( email, oldPassword, newPassword, token );
        res.status(201).json({
            data: data
        });
    }
    catch(error)
    {
        next(error);
    }
});

export default router;