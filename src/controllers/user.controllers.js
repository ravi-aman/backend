import { asyncHandler } from "../utils/asyncHandler.js"; // Ensure the correct path and extension

// Define the registerUser controller function
const registerUser = asyncHandler(async (req, res) => {
    // Send a response with a 200 status and a message
    res.status(200).json({
        message: "ok"
    });
});

// Export the registerUser controller for use in other modules
export { registerUser };
