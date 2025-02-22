require('dotenv').config();
require('express-async-errors')

const express = require('express');
const app = express();

const cookieParser = require('cookie-parser')

// import middlewares
const notFoundMiddleware = require('./middlewares/not-found.middleware')
const errorHandlerMiddleware = require('./middlewares/error-handler.middleware')

// import routes
const authRoutes = require('./routes/auth.route');

// setup DB
const connectDB = require('./db/connect.db')


// middlewares
app.use(express.json()) // for parsing req object
app.use(cookieParser()) // for parsing cookies

app.use('/api/v1/auth', authRoutes);

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const SERVER_PORT = process.env.SERVER_PORT || 3000;

const start = async () => {
  try {
    // connecting to DB
    await connectDB(process.env.MONGO_URI);
    app.listen(SERVER_PORT, () => {
      console.log(`Server is listening on port ${SERVER_PORT}`);
    })
  } catch (error) {
    console.log(error);
  }
}

start();