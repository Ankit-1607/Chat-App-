require('dotenv').config();
require('express-async-errors')

const { app, server } = require('./lib/socket')

const cors = require('cors');

const express = require('express');

const cookieParser = require('cookie-parser')

// import middlewares
const notFoundMiddleware = require('./middlewares/not-found.middleware')
const errorHandlerMiddleware = require('./middlewares/error-handler.middleware')

// import routes
const authRoutes = require('./routes/auth.route');
const messageRoutes = require('./routes/message.route');

// setup DB
const connectDB = require('./db/connect.db')


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