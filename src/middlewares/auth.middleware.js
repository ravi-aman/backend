import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import dovenv from "dotenv"

// Middleware to verify JWT token
export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Step 1: Retrieve token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        // Step 2: Check if token exists
        if (!token) {
            throw new ApiError(401, "Unauthorized request: No token provided");
        }

        // Step 3: Verify the token
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        } catch (error) {
            // Step 4: Handle token verification errors
            if (error instanceof jwt.JsonWebTokenError) {
                throw new ApiError(401, "Invalid access token: Token verification failed");
            } else if (error instanceof jwt.TokenExpiredError) {
                throw new ApiError(401, "Access token expired");
            } else {
                throw new ApiError(500, "Internal server error");
            }
        }

        // Step 5: Retrieve user from database using token payload
        const user = await User.findById(decodedToken._id);

        // Step 6: Check if user exists
        if (!user) {
            throw new ApiError(401, "Unauthorized request: User not found");
        }

        // Step 7: Attach user object to request for further middleware/controllers
        req.user = user;

        // Step 8: Proceed to next middleware/controller
        next();
    } catch (error) {
        // Step 9: Handle any errors that occur during token verification
        throw new ApiError(401, error.message || "Unauthorized request");
    }
});
