import { Request, Response } from "express";
import Menu from "../models/menu";
import { uploadToCloudinary } from "../services/uploadToCloudinary"; // Function for Cloudinary image upload
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;

export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const { name, description, price } = req.body;

    const token = req.cookies.accessToken;

    const decoded = jwt.verify(token, JWT_SECRET) as {
      store: {
        storeId: string;
        name: string;
      } | null;
    };

    const owner = decoded.store?.storeId;

    // Validate required fields
    if (!name || !description || !price || !owner) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Handle image upload
    let imageUrl = "";
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, "menu-images");
    } else {
      return res.status(400).json({ message: "Menu image is required." });
    }

    // Create new menu item
    const menuItem = new Menu({
      name,
      description,
      imageUrl,
      price,
      owner,
    });

    await menuItem.save();

    res
      .status(201)
      .json({ message: "Menu item created successfully", menuItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getMenuItemsByStore = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.accessToken;

    const decoded = jwt.verify(token, JWT_SECRET) as {
      store: {
        storeId: string;
        name: string;
      } | null;
    };

    const storeId = decoded.store?.storeId;
    // Get all menu items for the given store
    const menuItems = await Menu.find({ owner: storeId });

    if (!menuItems.length) {
      return res
        .status(404)
        .json({ message: "No menu items found for this store." });
    }

    res.status(200).json({ menuItems });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateMenuItem = async (req: Request, res: Response) => {
    try {
      const { menuId } = req.params;
      const { name, description, price } = req.body;
  
      // Find the menu item by ID
      const menuItem = await Menu.findById(menuId);
  
      if (!menuItem) {
        return res.status(404).json({ message: 'Menu item not found.' });
      }
  
      // Update menu item fields
      menuItem.name = name || menuItem.name;
      menuItem.description = description || menuItem.description;
      menuItem.price = price || menuItem.price;
  
      // Handle image update
      if (req.file) {
        const imageUrl = await uploadToCloudinary(req.file.buffer, 'menu-images');
        menuItem.imageUrl = imageUrl;
      }
  
      await menuItem.save();
  
      res.status(200).json({ message: 'Menu item updated successfully', menuItem });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

  export const deleteMenuItem = async (req: Request, res: Response) => {
    try {
      const { menuId } = req.params;
  
      // Find and delete the menu item by ID
      const menuItem = await Menu.findByIdAndDelete(menuId);
  
      if (!menuItem) {
        return res.status(404).json({ message: 'Menu item not found.' });
      }
  
      res.status(200).json({ message: 'Menu item deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

  
  
