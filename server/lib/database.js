import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/connectpro';

let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    return true;
  }

  // Don't attempt connection if no MongoDB URI is set for remote environments
  if (!process.env.MONGODB_URI && !MONGODB_URI.includes('localhost')) {
    console.log('No MongoDB URI configured, using mock database');
    return false;
  }

  try {
    // Set mongoose options for better development experience
    mongoose.set('strictQuery', false);
    
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false, // Disable buffering
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 3000, // Fail fast - 3 seconds
      socketTimeoutMS: 10000, // Close sockets after 10 seconds of inactivity
      connectTimeoutMS: 3000, // Give up initial connection after 3 seconds
    });
    
    isConnected = true;
    console.log('Connected to MongoDB successfully');
    return true;
  } catch (error) {
    console.log('MongoDB connection failed, using mock database for demo');
    isConnected = false;
    return false;
  }
};

export const disconnectFromDatabase = async () => {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
  }
};

export const isMongoDBConnected = () => mongoose.connection.readyState === 1;
