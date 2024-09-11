import express from 'express';
import authRoutes from "./routes/auth.route"

const routes = express.Router();
const app = express();

// Middleware and routes
app.use(express.json());
app.get('/', (req, res) => res.send('API is running'));

app.use("/auth", authRoutes)

export default app;