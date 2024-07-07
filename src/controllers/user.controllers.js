import { asyncHandler } from "../utils/asyncHandler.js"; // Import asyncHandler for handling asynchronous functions
import { ApiError } from "../utils/ApiError.js"; // Import ApiError utility for error handling
import { User } from "../models/user.model.js"; // Import User model for database operations
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Import uploadOnCloudinary utility for uploading files to Cloudinary
import { ApiResponse } from "../utils/ApiResponse.js"; // Import ApiResponse utility for standardized API responses
import jwt from "jsonwebtoken"
import { app } from "../app.js";
// Define a function to generate access and refresh tokens for a user
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        // Step 1: Retrieve user details from database based on userId
        const user = await User.findById(userId);

        // Step 2: Generate refresh and access tokens for the user

        const accessToken = user.generateRefreshToken();
        const refreshToken = user.generateAccessToken();
        // Step 3: Update user's refreshToken in the database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        // Step 4: Return the generated tokens
        return { accessToken, refreshToken };
    } catch (error) {
        // Error handling: Throw ApiError if any error occurs
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
    }
}

// Define the registerUser controller function
const registerUser = asyncHandler(async (req, res) => {
    // Steps:
    // 1. Get user details from request body
    // 2. Validate required fields
    // 3. Check if user already exists
    // 4. Check for avatar file and cover image
    // 5. Upload avatar and cover image to Cloudinary
    // 6. Create user object and store in database
    // 7. Remove sensitive fields from user object
    // 8. Check for successful user creation
    // 9. Return success response with created user details

    // Step 1: Get user details from request body
    const { fullName, email, username, password } = req.body;

    // Step 2: Validate required fields
    if ([fullName, email, username, password].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Step 3: Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // Step 4: Check for avatar file and cover image
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // Step 5: Upload avatar and cover image to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverLocalPath ? await uploadOnCloudinary(coverLocalPath) : null;

    if (!avatar) {
        throw new ApiError(400, "Failed to upload avatar file");
    }

    // Step 6: Create user object and store in database
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    // Step 7: Remove sensitive fields from user object
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    // Step 8: Check for successful user creation
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // Step 9: Return success response with created user details
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User created successfully")
    );
});

// Define the loginUser controller function
const loginUser = asyncHandler(async (req, res) => {
    // Steps:
    // 1. Get username and password from request body
    // 2. Validate username and email fields
    // 3. Find the user in the database
    // 4. Validate the password
    // 5. Generate refresh and access tokens for the user
    // 6. Send cookies with access and refresh tokens to client

    // Step 1: Get username and password from request body
    const { email, username, password } = req.body;

    // Step 2: Validate username and email fields
    if (!(username || email)) {
        throw new ApiError(400, "Username or email is required");
    }

    // Step 3: Find the user in the database
    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // Step 4: Validate the password
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password credential");
    }

    // Step 5: Generate refresh and access tokens for the user
    // Inside loginUser controller function
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    console.log(accessToken, "\n\n", refreshToken)
    // Step 6: Retrieve logged-in user details without sensitive fields
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Step 7: Set options for HTTP-only and secure cookies
    const options = {
        httpOnly: true,
        secure: true,
    };

    // Step 8: Send cookies with access and refresh tokens to client
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

// Define the logoutUser controller function

const logoutUser = asyncHandler(async (req, res) => {
    // Steps:
    // 1. Update the user's refreshToken to undefined in the database
    // 2. Clear cookies for accessToken and refreshToken
    // 3. Send success response for user logout
    // Step 4: Handle any errors that occur during logout


    try {
        // Step 1: Update user's refresh token to undefined in database
        await User.findByIdAndUpdate(
            req.user._id,
            { $set: { refreshToken: undefined } },
            { new: true }
        );

        // Step 2: Configure options for clearing cookies
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict'
        };

        // Step 3: Clear cookies for accessToken and refreshToken
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, null, "User logged out successfully"));

    } catch (error) {
        // Step 4: Handle any errors that occur during logout
        throw new ApiError(500, "Error while logging out user");
    }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorised token")
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expried or used ")
        }
    
        const options = {
            httpOnly: true,
            secure: true,
        }
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)
    
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken, refreshToken: newRefreshToken
                    }, "Access token refreshed"
                )
            )
    
   
    } catch (error) {
        throw new ApiError(401,)
    }

 })




// Export the controllers for use in other modules
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
};
