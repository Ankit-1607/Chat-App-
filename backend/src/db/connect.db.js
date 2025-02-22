const mongoose = require('mongoose');

const connectDB = (url) => {
  try {
    return mongoose.connect(url);
  } catch (error) {
    console.log("MongoDB connection error: ", error);
  }
};

module.exports = connectDB;