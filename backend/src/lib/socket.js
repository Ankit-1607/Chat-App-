import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

export const app = express();
export const server = http.createServer(app);

export const io = new Server(server, 
  {
    cors: {
      origin: ['http://localhost:5173'],
    }
  }
);

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
}


// to store online users
const userSocketMap = {}; // {userId: socketId}

io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  const userId = socket.handshake.query.userId;
  if(userId) userSocketMap[userId] = socket.id;

  io.emit('getOnlineUsers', Object.keys(userSocketMap)); // to send events to all the connected clients

  socket.on ('disconnect', () => {
    console.log('A user disconnected', socket.id);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap))
  })
})
