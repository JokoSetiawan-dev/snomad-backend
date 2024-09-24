import express from 'express';
import authController from '../controllers/auth.controller';
import { authenticationMiddleware } from '../middlewares/auth.middleware';
import { handleValidationErrors, validateEmail, validateName, validatePassword, validateRole } from '../middlewares/inputValidator.middleware';

const authRoutes = express.Router();

authRoutes.post("/register", [...validateName, ...validateEmail, ...validatePassword, ...validateRole], handleValidationErrors,authController.register)
authRoutes.post("/login", [...validateEmail, ...validatePassword], handleValidationErrors,authController.login)
authRoutes.post('/refresh-token', authenticationMiddleware,authController.refreshToken);
authRoutes.post("/logout", authenticationMiddleware, authController.logout)

export default authRoutes