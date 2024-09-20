import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/auth.route"
import passwordRoutes from './routes/password.route';
import { apiLimiter } from './middlewares/rateLimiter.middleware';

const routes = express.Router();
const app = express();

// Middleware and routes
app.use(express.json());
app.use(cookieParser()); // Parse cookies

app.get('/', (req, res) => res.send('API is running'));

app.use("/auth", apiLimiter,authRoutes)
app.use("/auth/password", apiLimiter,passwordRoutes)

export default app;