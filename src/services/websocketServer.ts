import { Server } from 'socket.io';
import User from '../models/user';

const socketServer = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('updateLocation', async ({ userId, lat, lng }) => {
      try {
        const user = await User.findById(userId);
        if (!user || user.role !== 'seller') {
          return socket.emit('error', 'Unauthorized access');
        }

        // Only update and broadcast if location sharing is active
        if (user.locationSharing) {
          user.currentLocation = { lat, lng };
          await user.save();

          // Broadcast updated location to buyers
          socket.broadcast.emit('sellerLocationUpdate', { userId, lat, lng });
        } else {
          socket.emit('error', 'Location sharing is disabled');
        }
      } catch (error) {
        console.error('Error updating location:', error);
        socket.emit('error', 'Server error');
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

export default socketServer;
