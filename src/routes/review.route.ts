import { Router } from 'express';
import { createReview, getStoreReviews } from '../controllers/review.controller';
import { authenticationMiddleware, authorizationMiddleware } from '../middlewares/auth.middleware';
import { handleValidationErrors, validateRatingAndComment } from '../middlewares/inputValidator.middleware';

const reviewRoutes = Router();

// Route for creating a review
reviewRoutes.post('/:storeId/reviews', authenticationMiddleware, authorizationMiddleware({ role: ['buyer'] }), validateRatingAndComment, handleValidationErrors,createReview);

// Route for getting all reviews of a store
reviewRoutes.get('/:storeId/reviews', getStoreReviews);

export default reviewRoutes;
