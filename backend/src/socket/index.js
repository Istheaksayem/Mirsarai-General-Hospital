import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';

let _io = null;

export const setIO = (io) => { _io = io; };
export const getIO = () => _io;

/**
 * Set up Socket.IO server with JWT authentication.
 * Staff users join `user:<userId>` and `role:<role>` rooms.
 * Patients join `patient:<patientId>` rooms.
 */
export function setupSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001', env.clientUrl].filter(Boolean),
      credentials: true,
    },
  });

  // Authenticate socket connections via JWT in handshake auth or query
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const decoded = jwt.verify(token, env.jwt.secret);
      socket.user = decoded;
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.user;

    if (user.type === 'patient') {
      // Patient portal users
      socket.join(`patient:${user.id}`);
    } else {
      // Staff/admin users
      socket.join(`user:${user.id}`);
      if (user.role) {
        socket.join(`role:${user.role}`);
      }
    }

    socket.on('disconnect', () => {
      // Rooms auto-leave on disconnect
    });
  });

  setIO(io);
  return io;
}
