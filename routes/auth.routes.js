import { Router } from 'express';
import { 
    activateAccount, 
    signIn, 
    signOut, 
    signUp 
} from '../controllers/auth.controller.js';

const authRouter = Router();

// Path: /api/v1/auth/sign-up
authRouter.post('/sign-up', signUp)

// Path: /api/v1/auth/activate/:token
authRouter.get('/activate/:token', activateAccount)

// Path: /api/v1/auth/sign-in
authRouter.post('/sign-in', signIn)

// Path: /api/v1/auth/sign-out
authRouter.post('/sign-out', signOut)


export default authRouter;