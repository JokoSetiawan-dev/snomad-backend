import express from 'express';
import { createNotifications, getNotificationById, deleteNotification } from '../controllers/notification.controller';
import { authenticationMiddleware, authorizationMiddleware } from '../middlewares/auth.middleware';

const notificationRoutes = express.Router();

// Route to create notifications (single or multiple users)
notificationRoutes.post('/create',authenticationMiddleware, authorizationMiddleware({ role: ['seller' , 'admin'] }),createNotifications);

// Route to get notifications by user ID
notificationRoutes.get('/:userId',authenticationMiddleware, getNotificationById);

// Route to delete a notification by its ID
notificationRoutes.delete('/:notifId',authenticationMiddleware, deleteNotification);

export default notificationRoutes;
