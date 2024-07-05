import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js"; // Import the registerUser controller

// Create a new router instance
const router = Router();

// Define a POST route for user registration
router.route("/register").post(registerUser);

// Export the router for use in other modules
export default router;
