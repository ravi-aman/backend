import multer from "multer";

// Configure multer storage settings
const storage = multer.diskStorage({
    // Specify the destination directory for uploaded files
    destination: function (req, file, cb) {
        cb(null, './public/temp'); // Set the destination to './public/temp'
    },
    // Define the filename for the uploaded file
    filename: function (req, file, cb) {
        // Generate a unique suffix using the current timestamp and a random number
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

        // Set the filename to the original name appended with the unique suffix
        cb(null, file.originalname + '-' + uniqueSuffix);
    }
});


// Create the multer upload middleware with the configured storage settings
const upload = multer({ storage }).fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]);
// Export the upload middleware for use in other modules
export { upload };
