import dotenv from "dotenv"; // Import dotenv for environment variable management
import connectDB from "./db/index.js"; // Import the connectDB function
import { app } from "./app.js"; // Import the app instance from your app file

// Load environment variables from .env file
dotenv.config({
    path: './.env'
});

// Connect to MongoDB
connectDB()
    .then(() => {
        // Handle app errors
        app.on("error", (error) => {
            console.log('ERRR: ', error);
            throw error;
        });

        // Start the server
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port: ${process.env.PORT || 8000}`);
        });
    })
    .catch((err) => {
        // Handle MongoDB connection errors
        console.log("MONGO DB CONNECTION FAILED !!!!!!!!!!", err);
    });

/*
import express from "express"
const app = express()

;(async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        
        // Handle app errors
        app.on("error", (error) => {
            console.log('ERRR: ', error);
            throw error;
        });
        
        // Start the server
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        });
    } catch (error) {
        // Handle any errors
        console.error(error);
    }
})();
*/

