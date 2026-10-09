import mongoose from 'mongoose';

export const connectDB = (url) => {
  // Explicitly configure strictQuery behavior
  mongoose.set('strictQuery', true);

  // Optional: Connection state monitoring
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connection established successfully.');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB connection lost.');
  });

  // Connect with short selection timeout
  return mongoose.connect(url, {
    serverSelectionTimeoutMS: 5000, // Fail fast instead of hanging 100s
    socketTimeoutMS: 10000,
  });
};
