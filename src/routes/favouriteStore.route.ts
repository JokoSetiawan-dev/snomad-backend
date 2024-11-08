import { Router } from 'express';
import { addFavoriteStore, removeFavoriteStore, getFavouriteStoreById } from '../controllers/favouriteStore.controller';
import { authenticationMiddleware, authorizationMiddleware } from '../middlewares/auth.middleware';

const favouriteStoreRoutes = Router();

// Add store to favorites
favouriteStoreRoutes.post('/add', authenticationMiddleware, authorizationMiddleware({ role: ['buyer'] }), addFavoriteStore);

// Remove store from favorites
favouriteStoreRoutes.post('/remove', authenticationMiddleware, authorizationMiddleware({ role: ['buyer'] }), removeFavoriteStore);
favouriteStoreRoutes.get('/:userId', authenticationMiddleware, getFavouriteStoreById);

export default favouriteStoreRoutes;
