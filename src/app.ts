import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/auth.route"
import passwordRoutes from './routes/password.route';
import { apiLimiter } from './middlewares/rateLimiter.middleware';
import locationRoutes from './routes/location.route';
import storeRoutes from './routes/store.route';
import storeMenuRoutes from './routes/storeMenu.route';
import reviewRoutes from './routes/review.route';
import favouriteStoreRoutes from './routes/favouriteStore.route';
import notificationRoutes from './routes/notification.route';
import trendsRoutes from './routes/trends.route';
import dotenv from 'dotenv';
import googleAuthController from './controllers/googleAuth.controller';
import passport from 'passport';
import session, { SessionOptions } from 'express-session';
import googleAuthRoutes from './routes/googleAuth.route';

dotenv.config();


const routes = express.Router();
const app = express();

// Middleware and routes
app.use(express.json());
app.use(cookieParser()); // Parse cookies

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  } as session.SessionOptions));
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Initialize Google Strategy
  googleAuthController.initializeGoogleStrategy();

app.get('/', (req, res) => res.send('API is running'));

app.use("/auth",authRoutes, googleAuthRoutes)
app.use("/auth/password", apiLimiter,passwordRoutes)
app.use("/location", apiLimiter,locationRoutes)
app.use("/store", apiLimiter,storeRoutes, storeMenuRoutes, reviewRoutes)
app.use("/favourites", apiLimiter,favouriteStoreRoutes)
app.use("/favourites", apiLimiter,favouriteStoreRoutes)
app.use("/notifications", apiLimiter,notificationRoutes)
app.use("/notifications", apiLimiter,notificationRoutes)
app.use("/trends", apiLimiter,trendsRoutes)

export default app;