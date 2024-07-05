import { asyncHandler } from "../utils/asyncHandler.js"; // Ensure the correct path and extension
import { ApiError } from "../utils/ApiError.js"; // Import the ApiError utility
import { User } from "../models/user.model.js"; // Import the User model
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Import the Cloudinary upload utility
import { ApiResponse } from "../utils/ApiResponse.js"; // Import the ApiResponse utility

// Define the registerUser controller function
const registerUser = asyncHandler(async (req, res) => {
    //steps
    //1. get user details
    //2. validation
    //3. check if user already exist 
    //4. check for image check for avatar
    //5. upload them to Cloudinary
    //6. create user object - create entry in db
    //7. remove password and refresh token field
    //8. check for user creation
    //9. return res

    // Step 1: Get user details from request body
    const { fullName, email, username, password } = req.body;

    console.log("email : ", email);

    // Step 2: Validate required fields
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Step 3: Check if user already exists
    const existedUser = await User.findOne({ 
        $or: [{ username }, { email }] 
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // Step 4: Check for avatar file
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // Step 5: Upload avatar and cover image to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Failed to upload avatar file");
    }

    // Step 6: Create user object - create entry in DB
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    // Step 7: Remove password and refresh token fields
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    // Step 8: Check for user creation
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // Step 9: Return response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User created successfully")
    );
});

// Export the registerUser controller for use in other modules
export { registerUser };
