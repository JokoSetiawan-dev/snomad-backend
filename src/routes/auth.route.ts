import express from 'express';
import authController from '../controllers/auth.controller';
import { authenticationMiddleware } from '../middlewares/auth.middleware';

const authRoutes = express.Router();

authRoutes.post("/register", authController.register)
authRoutes.post("/login", authController.login)
authRoutes.post("/logout", authenticationMiddleware, authController.logout)

export default authRoutes