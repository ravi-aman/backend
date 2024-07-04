import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Define the Video schema
const videoSchema = new mongoose.Schema({
    videofile: {
        type: String, // Cloudinary URL
        required: true
    },
    thumbnail: {
        type: String, // Cloudinary URL
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" // Reference to the User model
    }
}, { timestamps: true }); // Automatically add createdAt and updatedAt timestamps

// Apply the aggregate paginate plugin to the Video schema
videoSchema.plugin(mongooseAggregatePaginate);

// Export the Video model
export const Video = mongoose.model("Video", videoSchema);
