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

const routes = express.Router();
const app = express();

// Middleware and routes
app.use(express.json());
app.use(cookieParser()); // Parse cookies

app.get('/', (req, res) => res.send('API is running'));

app.use("/auth", apiLimiter,authRoutes)
app.use("/auth/password", apiLimiter,passwordRoutes)
app.use("/location", apiLimiter,locationRoutes)
app.use("/store", apiLimiter,storeRoutes, storeMenuRoutes, reviewRoutes)
app.use("/favourites", apiLimiter,favouriteStoreRoutes)

export default app;