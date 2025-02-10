import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";    //for hashing password
import jwt from "jsonwebtoken";    //for generating token

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim : true,
            index: true // Index for faster search
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim : true
        },
        fullName: {
            type: String,
            required: true,
            trim : true,
            index: true
        },
        avatar: {
            type: String,   //cloudinary url
            required: true
        },
        coverImage: {
            type: String,   //cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        refreshToken: {
            type: String
        }
    }, 
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
}) //middleware to hash password before saving


//method is used to check password is correct or not
userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,  //mongoose automatically create _id for every document, this id is in bson format
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);