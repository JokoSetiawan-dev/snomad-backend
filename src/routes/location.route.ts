import express from 'express';
import locationController from '../controllers/location.controller';
import { authenticationMiddleware, authorizationMiddleware } from '../middlewares/auth.middleware';

const locationRoutes = express.Router();

// Protected routes (seller needs to be authenticated to activate/deactivate location sharing)
locationRoutes.post(
    "/activate", 
    authenticationMiddleware, // Ensure the user is authenticated
    authorizationMiddleware({ role: ['seller'] }), // Only sellers can share their location
    locationController.shareLocationOn // Activate location sharing
);

locationRoutes.post(
    "/deactivate", 
    authenticationMiddleware, // Ensure the user is authenticated
    authorizationMiddleware({ role: ['seller'] }), // Only sellers can stop sharing their location
    locationController.shareLocationOff // Deactivate location sharing
);

export default locationRoutes;