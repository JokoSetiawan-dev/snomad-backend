import { Request, Response } from "express";
import User from "../models/user";
import Notification from "../models/notification";
import FavouriteStore from "../models/favouriteStore";

export const createNotifications = async (req: Request, res: Response) => {
    try {
        const { userIds, tagline, messages, creatorId } = req.body;

        // Validate the input fields
        if (!userIds || (!Array.isArray(userIds) && typeof userIds !== 'string')) {
            return res.status(400).json({ message: "Please provide a user ID or an array of user IDs" });
        }
        if (!tagline || !messages) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // Convert single userId into an array for consistency
        const userIdArray = Array.isArray(userIds) ? userIds : [userIds];

        // Validate users existence
        const users = await User.find({ _id: { $in: userIdArray } });
        if (users.length !== userIdArray.length) {
            return res.status(404).json({ message: "Some users not found" });
        }

        // Create notifications for each user in the list
        const notifications = userIdArray.map((userId) => ({
            user: userId,
            tagline: tagline,
            messages: messages,
            creator: creatorId,
        }));

        // Save all notifications to the database at once
        await Notification.insertMany(notifications);

        res.status(200).json({ message: "Notification(s) created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


export const getNotificationById = async (req: Request, res: Response) => {
    try {
        const {userId} = req.params

        const getNotif = await Notification.findById({user: userId})

        if (!getNotif) {
            return res.status(404).json({messages: "data not found"})
        }

        res.status(200).json(getNotif)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

export const deleteNotification = async (req:Request, res:Response) => {
    try {
        const {notifId} = req.params

        
        const deleteNotif = await FavouriteStore.findByIdAndDelete(notifId)

        if (!deleteNotif) {
            return res.status(403).json({message: "Notif not found"})
        }

        res.status(200).json({messages: "notif deleted succesfully"})
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}