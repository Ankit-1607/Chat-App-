import mongoose from 'mongoose';

const connectDB = (url) => {
  try {
    return mongoose.connect(url);
  } catch (error) {
    console.log("MongoDB connection error: ", error);
  }
};

export default connectDB;