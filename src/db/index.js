import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        // Connect to MongoDB using the URI from environment variables and the database name
        const connectionInsure = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        
        // Log a success message with the host of the connected MongoDB server
        console.log(`\n MongoDB connected !! DB HOST : ${connectionInsure.connection.host}`);
    } catch (error) {
        // Log an error message if the connection fails
        console.log("MONGODB connection FAILED ", error);
        
        // Exit the process with a failure code
        process.exit(1);
    }
}

// Export the connectDB function for use in other modules
export default connectDB;
