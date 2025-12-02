import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createConnection } from 'typeorm';
import authRoutes from './routes/auth';
import listingRoutes from './routes/listings';
import userRoutes from './routes/users';
import paymentRoutes from './routes/payments';
import messagesRoutes from './routes/messages';
import adminRoutes from './routes/admin';
import { errorHandler } from './middleware/errorHandler';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(errorHandler);

const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  // Future: join rooms, emit notifications
});

export { io };

const PORT = process.env.PORT || 5000;

// Database connection and server start
createConnection()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
    process.exit(1);
  });

export default app; 