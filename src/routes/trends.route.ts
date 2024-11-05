import express from 'express';
import { getSearchTrends } from '../controllers/trends.controller';
import { authenticationMiddleware } from '../middlewares/auth.middleware';

const trendsRoutes = express.Router();

trendsRoutes.get('/search', authenticationMiddleware,getSearchTrends);

export default trendsRoutes;