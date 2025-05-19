import express from 'express';
import { checkAuth, login, signup, updateProfile } from '../controller/userController.js';
import { protectedRoute } from '../middleware/auth.js';

const userRouter = express.Router();


userRouter.post("/signup", signup);
userRouter.post("/login",login)
userRouter.get("/check",protectedRoute,checkAuth)
userRouter.put('/update-profile',protectedRoute,updateProfile);


export default userRouter;