import 'dotenv/config';
import 'express-async-errors';

import { app, server } from './lib/socket.js';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';

// import middlewares
import notFoundMiddleware from './middlewares/not-found.middleware.js';
import errorHandlerMiddleware from './middlewares/error-handler.middleware.js';

// import routes
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

// setup DB
import connectDB from './db/connect.db.js';

// middlewares
app.use(express.json()) // for parsing req object
app.use(cookieParser()) // for parsing cookies
app.use(cors( // to allow cookie and authorization header to be send with the request
  {
    origin: 'http://localhost:5173',
    credentials: true
  }
))

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/messages', messageRoutes);

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const SERVER_PORT = process.env.SERVER_PORT || 3000;
const __dirname = path.resolve();

if(process.env.NODE_ENV==='production') {
  app.use(express.static(path.join(__dirname,'../frontend/dist')));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'))
  })
}

const start = async () => {
  try {
    // connecting to DB
    await connectDB(process.env.MONGO_URI);
    server.listen(SERVER_PORT, () => {
      console.log(`Server is listening on port ${SERVER_PORT}`);
    })
  } catch (error) {
    console.log(error);
  }
}

start();