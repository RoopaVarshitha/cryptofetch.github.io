// config/db.js
import mongoose from 'mongoose'; // Import mongoose
import dotenv from 'dotenv'; // Import dotenv

dotenv.config(); // Load environment variables from .env file

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit process if connection fails
  }
};

export default connectDB; // Use ES module export
