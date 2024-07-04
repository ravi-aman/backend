import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
// Configure Cloudinary with our cloud name, API key, and API secret
cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME, // Replace with our Cloudinary cloud name
    api_key: CLOUDINARY_API_KEY,       // Replace with our Cloudinary API key
    api_secret: CLOUDINARY_API_SECERET // Replace with our Cloudinary API secret
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

        // Log the successful upload and the file URL
        console.log("FILE HAS BEEN UPLOADED SUCCESSFULLY ON CLOUDINARY !! ", response.url);
        
        // Return the response object containing details of the uploaded file
        return response;
    } catch (error) {
        // If upload fails, remove the locally saved temporary file
        fs.unlink(localfilePath);
        
        // Return null indicating failure
        return null;
    }
}

// Export the uploadOnCloudinary function for use in other modules
export { uploadOnCloudinary }
