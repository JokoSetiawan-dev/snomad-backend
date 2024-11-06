import express from 'express';
import { authenticationMiddleware } from '../middlewares/auth.middleware';
import { changeProfilePicture, editUserProfile } from '../controllers/user.controller';
import upload from '../middlewares/upload.middleware';

const userRoutes = express.Router();

userRoutes.patch('/profile/edit/:userId',authenticationMiddleware, editUserProfile);
userRoutes.patch('/profile/picture/:userId',authenticationMiddleware, upload,changeProfilePicture);

export default userRoutes;
