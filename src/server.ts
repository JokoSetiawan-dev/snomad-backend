import { Server } from 'socket.io';
import app from './app';
import http from 'http';
import connectDB from './config/db';
import socketServer from './services/websocketServer';
import helmet from 'helmet'
import cors from 'cors';
import { corsOptions } from './middlewares/cors.middleware';

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server);

app.use(helmet());
app.use(cors(corsOptions));

// Initialize the WebSocket server
socketServer(io);
// Connect to database
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
