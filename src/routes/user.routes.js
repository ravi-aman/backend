import { Router } from "express";
import { loginUser, registerUser,logoutUser, refreshAccessToken } from "../controllers/user.controllers.js"; // Import the registerUser controller
import {upload}from"../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

// Create a new router instance
const router = Router();

// Define a POST route for user registration
router.post('/register', upload, registerUser);

router.route("/login").post(loginUser)

//secure routes

router.route("/logout").post(verifyJWT,logoutUser)


router.route("/refresh-token").post(refreshAccessToken)


// Export the router for use in other modules
export default router;
