import { asyncHandler } from "../utils/asyncHandler.js"; // Ensure the correct path and extension
import { ApiError } from "../utils/ApiError.js"; // Import the ApiError utility
import { User } from "../models/user.model.js"; // Import the User model
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Import the Cloudinary upload utility
import { ApiResponse } from "../utils/ApiResponse.js"; // Import the ApiResponse utility



const generateAccessAndRefreshTockens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.refreshRefreshToken()
        const refreshToken = user.generateAccessToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and assess token")
    }
}
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

    // console.log("User details received: ", { fullName, email, username, password });

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

    // Step 4: Check for avatar file
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverLocalPath = req.files?.coverImage?.[0]?.path;

    // console.log("Avatar local path: ", avatarLocalPath);
    // console.log("Cover image local path: ", coverLocalPath);

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // Step 5: Upload avatar and cover image to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverLocalPath ? await uploadOnCloudinary(coverLocalPath) : null;

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


const loginUser = asyncHandler(async (req, res) => {

    // steps
    //1. get username and password 
    //2. validate the details
    //3. find the user
    //4. password check
    //5. give them refresh tocken and access tocken
    //6. send cookie

    const { email, username, password } = req.body

    if (!username || !email) {
        throw new ApiError(400, "username or email i requied")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "user does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "invalid password credential");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTockens(user._id)

    const loggesdInUser = await User.findById(user._id).select("-password -refreshToken")


    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user:loggesdInUser,accessToken,refreshToken
                },
                "User logged in successfully"
            )
        )


})



const logoutUser =asyncHandler(async(req,res)=>{
    // steps
    //1. 

    

})

// Export the registerUser controller for use in other modules
export {
    registerUser,
    loginUser
};
