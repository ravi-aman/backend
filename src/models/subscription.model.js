// Importing mongoose and Schema from mongoose library
import mongoose, { Schema } from "mongoose";

// Defining the subscription schema using mongoose.Schema
const subscriptionSchema = new mongoose.Schema({
    // subscriber field to store the ID of the user who is subscribing
    subscriber: {
        type: Schema.Types.ObjectId, // Type of subscriber field is ObjectId
        ref: "User" // Reference to the User model
    }
}, { timeseries: true }) // Enabling timeseries option to store time-related data efficiently

// Exporting the Subscription model based on the defined subscription schema
export const Subscription = mongoose.model("Subscription", subscriptionSchema)
