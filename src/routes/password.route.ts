import express from 'express';
import passwordController from '../controllers/password.controller';
import { handleValidationErrors, validateEmail, validateOtp, validatePassword } from '../middlewares/inputValidator.middleware';

const passwordRoutes = express.Router();

passwordRoutes.post("/request-reset", validateEmail,handleValidationErrors,passwordController.requestPasswordReset)
passwordRoutes.post("/otp-validation", [...validateEmail, ...validateOtp],handleValidationErrors, passwordController.validateOtp)
passwordRoutes.post("/reset-password", [...validateEmail, ...validatePassword], handleValidationErrors, passwordController.resetPassword)
passwordRoutes.post("/change-password", [...validatePassword], handleValidationErrors, passwordController.changePassword)

export default passwordRoutes