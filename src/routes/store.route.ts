import express from 'express';
import { createStore } from '../controllers/store.controller';
import upload from '../middlewares/upload.middleware';
import { authenticationMiddleware, authorizationMiddleware } from '../middlewares/auth.middleware';

const storeRoutes = express.Router();

// Route for creating a store with image uploads
storeRoutes.post(
  '/create',
  authenticationMiddleware,
  authorizationMiddleware({ role: ['seller'] }),  // Ensure the user is authenticated
  upload,                    // Multer middleware to handle file uploads
  createStore                // Controller that creates the store
);

export default storeRoutes;