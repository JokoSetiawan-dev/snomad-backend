import express from 'express';
import { createStore, editStoreProfile, getAllStores } from '../controllers/store.controller';
import upload from '../middlewares/upload.middleware';
import { authenticationMiddleware, authorizationMiddleware } from '../middlewares/auth.middleware';
import { handleValidationErrors, validateDescription, validateName } from '../middlewares/inputValidator.middleware';

const storeRoutes = express.Router();

// Route for creating a store with image uploads
storeRoutes.post(
  '/create',
  authenticationMiddleware,
  authorizationMiddleware({ role: ['seller'] }),  // Ensure the user is authenticated
  upload,                    // Multer middleware to handle file uploads
  [...validateName, ...validateDescription],
  handleValidationErrors,
  createStore                
);

storeRoutes.get(
  '/:storeId',
  authenticationMiddleware,
  getAllStores
);

storeRoutes.get(
  '/',
  authenticationMiddleware,
  getAllStores
);

storeRoutes.put(
  '/update',
  authenticationMiddleware,
  authorizationMiddleware({ role: ['seller'] }),  // Ensure the user is authenticated
  upload,                    // Multer middleware to handle file uploads
  [...validateName, ...validateDescription],
  handleValidationErrors,
  editStoreProfile                // Controller that creates the store
);

export default storeRoutes;
