import jwt from "jsonwebtoken"; // Import jsonwebtoken for JWT operations
import { ApiError } from "../utils/ApiError.js"; // Import the ApiError utility
import { asyncHandler } from "../utils/asyncHandler.js"; // Import the asyncHandler utility
import { User } from "../models/user.model.js"; // Import the User model

// Define the verifyJWT middleware function
export const verifyJWT = asyncHandler(async (req, res, next) => {
    // Step 1: Get the token from cookies or Authorization header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    // Step 2: Check if the token is present
    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }

    // Step 3: Verify the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Step 4: Get user from the token and attach it to the request object
    const user = await User.findById(decodedToken._id);

    if (!user) {
        throw new ApiError(401, "Unauthorized request");
    }

    req.user = user;

    // Step 5: Call the next middleware
    next();
});
