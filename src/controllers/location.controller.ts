import express from "express";
import { Request, Response } from "express";
import User from "../models/user";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;

export const shareLocationOn = async (req: Request, res: Response) => {
  const token = req.cookies.accessToken;

  const decoded = jwt.verify(token, JWT_SECRET) as {
    _id: string;
    role: string;
  };

  const userId = decoded._id;

  try {
    const user = await User.findById(userId);
    if (!user || user.role !== "seller") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Activate location sharing
    user.locationSharing = true;
    await user.save();

    res.status(200).json({ message: "Location sharing activated" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const shareLocationOff = async (req: Request, res: Response) => {
  const token = req.cookies.accessToken;

  const decoded = jwt.verify(token, JWT_SECRET) as {
    _id: string;
    role: string;
  };

  const userId = decoded._id;

  try {
    const user = await User.findById(userId);
    if (!user || user.role !== "seller") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Deactivate location sharing
    user.locationSharing = false;
    user.currentLocation = { lat: null, lng: null };
    await user.save();

    res.status(200).json({ message: "Location sharing activated" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const locationController = { shareLocationOn, shareLocationOff };
export default locationController;
