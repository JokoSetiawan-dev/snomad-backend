import express from 'express';
import {
  createMenuItem,
  getMenuItemsByStore,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/storeMenu.controller';
import upload from '../middlewares/upload.middleware'; // Multer middleware for file uploads
import { authenticationMiddleware, authorizationMiddleware } from '../middlewares/auth.middleware';
import { handleValidationErrors, validateDescription, validateName, validatePrice } from '../middlewares/inputValidator.middleware';

const storeMenuRoutes = express.Router();

// Create a new menu item
storeMenuRoutes.post('/add-menu',authenticationMiddleware, authorizationMiddleware({ role: ['seller'] }), [...validateName, ...validateDescription, ...validatePrice], handleValidationErrors,upload, createMenuItem);

// Get all menu items for a store
storeMenuRoutes.get('/menus/:storeId', getMenuItemsByStore);

// Update a menu item
storeMenuRoutes.put('/menus/update/:menuId',authenticationMiddleware, authorizationMiddleware({ role: ['seller'] }), [...validateName, ...validateDescription, ...validatePrice], handleValidationErrors, upload, updateMenuItem);

// Delete a menu item
storeMenuRoutes.delete('/menus/:menuId',authenticationMiddleware, authorizationMiddleware({ role: ['seller'] }), deleteMenuItem);

export default storeMenuRoutes;
