import { Request, Response } from "express";
import { uploadToCloudinary } from "../services/uploadToCloudinary";
import Store from "../models/store";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;

export const createStore = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const token = req.cookies.accessToken;

    const decoded = jwt.verify(token, JWT_SECRET) as {
      _id: string;
    };

    const userId = decoded._id;
    const owner = userId; // Assuming the user authentication is in place

    // Cast req.files to the correct type
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    // Check if logo image is provided
    if (!files?.logo || !files.logo[0]) {
      return res.status(400).json({ message: "Logo image is required" });
    }

    // Upload logo to Cloudinary
    const logoUrl = await uploadToCloudinary(
      files.logo[0].buffer,
      "stores/logos"
    );

    // Upload banner if provided
    const bannerUrl = files?.banner
      ? await uploadToCloudinary(files.banner[0].buffer, "stores/banners")
      : undefined;

    // Create the store in the database with the image URLs
    const newStore = new Store({
      name,
      description,
      logoUrl,
      bannerUrl,
      owner,
    });

    await newStore.save();

    res
      .status(201)
      .json({ message: "Store created successfully", store: newStore });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const editStoreProfile = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const storeId = req.params.storeId;
    const token = req.cookies.accessToken;

    const decoded = jwt.verify(token, JWT_SECRET) as {
      _id: string;
      role: string;
    };

    const userId = decoded._id;
    const owner = userId; // Assuming authentication is implemented, and the owner is stored in req.user

    // Find the store by ID and verify ownership
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    if (store.owner.toString() !== owner.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Cast req.files to the correct type
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    // Update logo if provided
    if (files?.logo && files.logo[0]) {
      const logoUrl = await uploadToCloudinary(
        files.logo[0].buffer,
        "stores/logos"
      );
      store.logoUrl = logoUrl; // Update the logo URL in the store document
    }

    // Update banner if provided
    if (files?.banner && files.banner[0]) {
      const bannerUrl = await uploadToCloudinary(
        files.banner[0].buffer,
        "stores/banners"
      );
      store.bannerUrl = bannerUrl; // Update the banner URL in the store document
    }

    // Update the store's name and description if provided
    if (name) store.name = name;
    if (description) store.description = description;

    // Save the updated store to the database
    await store.save();

    res
      .status(200)
      .json({ message: "Store profile updated successfully", store });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
