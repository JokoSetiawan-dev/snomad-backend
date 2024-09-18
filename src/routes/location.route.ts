import express from 'express';
import locationController from '../controllers/location.controller';

const locationRoutes = express.Router();

locationRoutes.post("/activate", locationController.shareLocationOn)
locationRoutes.post("/deactivate", locationController.shareLocationOff)

export default locationRoutes