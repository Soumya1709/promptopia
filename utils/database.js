import mongoose from "mongoose";

let isConnected = false; // track the connection status

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);
    if (isConnected) {
        console.log("Already connected to the database");
        return;
    }
    
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not set in environment');
        }

        // Mongoose 7+ no longer accepts useNewUrlParser or useUnifiedTopology
        // Add serverSelectionTimeoutMS and connectTimeoutMS to prevent buffering timeouts
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        isConnected = true;
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Error connecting to the database:", error.message);
        // Reset connection flag on error so next attempt tries fresh
        isConnected = false;
        throw error;
    }
}