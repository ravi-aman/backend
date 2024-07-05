import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to upload a file to Cloudinary
const uploadOnCloudinary = async (localfilePath) => {
    try {
        // Check if the local file path is provided
        if (!localfilePath) return null;

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localfilePath, {
            resource_type: "auto" // Automatically detect the resource type (image, video, etc.)
        });

        // Remove the locally saved temporary file
        fs.unlink(localfilePath, (err) => {
            if (err) {
                console.error("Failed to delete local file:", err);
            }
        });

        // Return the response object containing details of the uploaded file
        return response;
    } catch (error) {
        // If upload fails, remove the locally saved temporary file
        fs.unlink(localfilePath, (err) => {
            if (err) {
                console.error("Failed to delete local file:", err);
            }
        });

        // Return null indicating failure
        return null;
    }
}

// Export the uploadOnCloudinary function for use in other modules
export { uploadOnCloudinary };
