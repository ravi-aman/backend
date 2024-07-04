import mongoose, { Schema } from "mongoose";
import byrypt from "bcrypt"
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    }, fullName: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    avtar: {
        type: String,//cloudinary url
        required: true,
    },
    avtar: {
        type: String,//cloudinary url
    },
    watchHistory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    },
    pasword: {
        type: String,
        required: [true, 'Password is required'],
    },
    refreshTocken: {
        type: String
    }

}, { timestamps: true })


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = byrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessTocken = function () {
    jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },
        process.env.ACCESS_TOCKEN_SECERET,
        {
            expiresIn:process.env.ACCESS_TOCKEN_EXPITY
        }
    )
}
userSchema.methods.refreshAccessTocken = function () {
    jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },
        process.env.REFRESH_TOCKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOCKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);