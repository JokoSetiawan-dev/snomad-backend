import { Request, Response } from "express";
import SearchTrend from "../models/trends";

export const getSearchTrends = async (req: Request, res: Response) => {
    try {
      // Fetch the top 10 most searched keywords
      const trends = await SearchTrend.find().sort({ count: -1 }).limit(10);
  
      return res.status(200).json({ trends });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  };
  