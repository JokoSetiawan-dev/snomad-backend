import { Request, Response } from "express";
import User from "../models/user";
import Store from "../models/store";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;

// Add store to favorite
export const addFavoriteStore = async (req: Request, res: Response) => {
  const { storeId } = req.body;
  const token = req.cookies.accessToken;

  const decoded = jwt.verify(token, JWT_SECRET) as {
    _id: string;
    role: string;
  };
  const userId = decoded._id; // Extract user ID from token

  try {
    // Check if store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if store is already in favorites
    if (user.favoriteStores.includes(storeId)) {
      return res.status(400).json({ message: "Store already in favorites" });
    }

    // Add store to user's favorite list
    user.favoriteStores.push(storeId);
    await user.save();

    res
      .status(200)
      .json({
        message: "Store added to favorites",
        favoriteStores: user.favoriteStores,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const removeFavoriteStore = async (req: Request, res: Response) => {
  const { storeId } = req.body;
  const token = req.cookies.accessToken;

  const decoded = jwt.verify(token, JWT_SECRET) as {
    _id: string;
    role: string;
  };
  const userId = decoded._id;

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if store is in favorites
    const index = user.favoriteStores.indexOf(storeId);
    if (index === -1) {
      return res.status(400).json({ message: "Store not found in favorites" });
    }

    // Remove store from favorites
    user.favoriteStores.splice(index, 1);
    await user.save();

    res
      .status(200)
      .json({
        message: "Store removed from favorites",
        favoriteStores: user.favoriteStores,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
