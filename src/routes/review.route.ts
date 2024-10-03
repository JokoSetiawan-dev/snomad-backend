import { Router } from 'express';
import { createReview, getStoreReviews } from '../controllers/review.controller';
import { authenticationMiddleware } from '../middlewares/auth.middleware';

const reviewRoutes = Router();

// Route for creating a review
reviewRoutes.post('/:storeId/reviews', authenticationMiddleware, createReview);

// Route for getting all reviews of a store
reviewRoutes.get('/:storeId/reviews', getStoreReviews);

export default reviewRoutes;
