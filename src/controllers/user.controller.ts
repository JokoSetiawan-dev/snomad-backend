import { Request, Response } from "express";
import User from "../models/user";
import { uploadToCloudinary } from "../services/uploadToCloudinary";

export const editUserProfile = async (req: Request, res: Response) => {
  try {
    const { name, telephone } = req.body;
    const userId = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.telephone = telephone;

    await user.save();
    return res.status(200).json({ message: "User saved", user });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const changeProfilePicture = async (req: Request, res: Response) => {
  try {
    const userId = req.params;
    const file = req.file;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!file) {
      return res.status(404).json({ message: "file required" });
    }

    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer, "menu-images");
      user.profilePicture = imageUrl;
    }

    await user.save()
  } catch (error) {
    return res.status(500).json({message:"server error", error})
  }
};
