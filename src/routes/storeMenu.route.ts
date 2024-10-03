import express from 'express';
import {
  createMenuItem,
  getMenuItemsByStore,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/storeMenu.controller';
import upload from '../middlewares/upload.middleware'; // Multer middleware for file uploads

const storeMenuRoutes = express.Router();

// Create a new menu item
storeMenuRoutes.post('/add-menu', upload, createMenuItem);

// Get all menu items for a store
storeMenuRoutes.get('/menus/:storeId', getMenuItemsByStore);

// Update a menu item
storeMenuRoutes.put('/menus/update/:menuId', upload, updateMenuItem);

// Delete a menu item
storeMenuRoutes.delete('/menus/:menuId', deleteMenuItem);

export default storeMenuRoutes;
