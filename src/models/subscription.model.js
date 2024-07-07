import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    subscriber: {
        type: Schema.Types.ObjectId,//one who is  subscriber or subscribing
        ref: "User"
    }
}, { timeseries: true })

export const Subscription = mongoose.model("Subscription", subscriptionSchema)