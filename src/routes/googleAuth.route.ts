import express from 'express';
import googleAuthController from '../controllers/googleAuth.controller'; // Adjust the path as necessary

const googleAuthRoutes = express.Router();

googleAuthRoutes.get('/google', googleAuthController.authenticateGoogle);

googleAuthRoutes.get('/google/callback', googleAuthController.googleCallback);

export default googleAuthRoutes;