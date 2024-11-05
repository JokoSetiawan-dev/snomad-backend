import { Request, Response } from "express";
import User from "../models/user";
import FavouriteStore from "../models/favouriteStore";
import Store from "../models/store";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;

// Add store to favorite
export const addFavoriteStore = async (req: Request, res: Response) => {
  const { storeId } = req.body;
  const token = req.cookies.accessToken;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      _id: string;
      role: string;
    };
    const userId = decoded._id; // Extract user ID from token

    // Check if the store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the store is already in the user's favorites
    const existingFavorite = await FavouriteStore.findOne({ user: userId, store: storeId });
    if (existingFavorite) {
      return res.status(400).json({ message: 'Store already in favorites' });
    }

    // Add the store to the user's favorite list
    const newFavorite = new FavouriteStore({ user: userId, store: storeId });
    await newFavorite.save();

    res.status(200).json({
      message: 'Store added to favorites',
      favorite: newFavorite,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getFavouriteStoreById = async (req: Request, res: Response) => {
  try {
    const {userId} = req.params // this can fill with user id or store id
    
    const getById = await FavouriteStore.findById({user: userId, store: userId})

    if (!getById) {
      return res.status(404).json({ message: "user or store not found"})
    }

    res.status(200).json(getById)
  } catch (error) {
    res.status(500).json({message: "Server error", error})
  }
}

export const removeFavoriteStore = async (req: Request, res: Response) => {
  const { storeId } = req.body;
  const token = req.cookies.accessToken;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      _id: string;
      role: string;
    };
    const userId = decoded._id; // Extract user ID from token

    // Check if the store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the store is in the user's favorites
    const favorite = await FavouriteStore.findOne({ user: userId, store: storeId });
    if (!favorite) {
      return res.status(400).json({ message: 'Store not found in favorites' });
    }

    // Remove the favorite store entry
    await FavouriteStore.findByIdAndDelete(favorite._id);

    res.status(200).json({ message: 'Store removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};