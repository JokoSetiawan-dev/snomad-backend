import express from 'express';
import passwordController from '../controllers/password.controller';

const passwordRoutes = express.Router();

passwordRoutes.post("/request-reset", passwordController.requestPasswordReset)
passwordRoutes.post("/otp-validation", passwordController.validateOtp)
passwordRoutes.post("/reset-password", passwordController.resetPassword)

export default passwordRoutes