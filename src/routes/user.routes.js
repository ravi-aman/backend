import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js"; // Import the registerUser controller
import {upload}from"../middlewares/multer.middleware.js"

// Create a new router instance
const router = Router();

// Define a POST route for user registration
router.post('/register', upload, registerUser);


// Export the router for use in other modules
export default router;
