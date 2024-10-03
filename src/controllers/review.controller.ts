import { Request, Response } from 'express';
import Review from '../models/review';
import Store from '../models/store';
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;

// Create a new review
export const createReview = async (req: Request, res: Response) => {
  const { rating, comment, storeId } = req.body;
  const token = req.cookies.accessToken
  const decoded = jwt.verify(token, JWT_SECRET) as {
    _id: string;
  };

  const userId = decoded._id; // Assuming you have user authentication and can access user ID from req.user

  try {
    // Check if store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Create and save the review
    const review = new Review({
      rating,
      comment,
      user: userId,
      store: storeId,
    });
    await review.save();

    // Optionally update the store's average rating (if needed)
    const reviews = await Review.find({ store: storeId });
    const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    store.rating = avgRating;
    await store.save();

    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getStoreReviews = async (req: Request, res: Response) => {
    const { storeId } = req.params;
  
    try {
      const reviews = await Review.find({ store: storeId }).populate('user', 'name');
      if (!reviews.length) {
        return res.status(404).json({ message: 'No reviews found for this store' });
      }
  
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  