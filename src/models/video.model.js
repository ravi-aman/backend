import mongoose, { Schema } from "mongoose";
import mongoosAggregatePaginate from "mongoose-aggregate-paginate-v2"



const videoSchema = new mongoose.Schema({
    videofile: {
        type: String,//coludnairy url
        required: true
    },
    thubnail: {
        type: String,//coludnairy url
        required: true
    },
    title: {
        type: String,
        required: true
    },
    discription: {
        type: String,
        required: true
    },
    videofile:{
        type:Number,//coludnairy url
        default:0,
    },
    isPublished:{
        type:Boolean,
        default:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
}, { timestamps: true })


videoSchema.plugin(mongoosAggregatePaginate)


export const Video = mongoose.model("Video", videoSchema);