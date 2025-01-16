import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs"


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password must be at least 8 characters long"],
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    profileImg: {
        type: String,
        default: ''
    },
    coverImg: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    link: {
        type: String,
        default: ''
    },
    likedPosts: [
        {
            type: Schema.Types.ObjectId,
            ref: "Post",
            default: []
        }
    ],
    bookmarkedPosts : [
        {
            type: Schema.Types.ObjectId,
            ref: "Post",
            default: []
        }
    ],
    repostedPosts : [
        {
            type: Schema.Types.ObjectId,
            ref: "Post",
            default: []
        }
    ]
}, {
    timestamps: true
})

// userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) return next()
//     this.password = await bcrypt.hash(this.password, 10)
//     next()
// })

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}


const UserModel = mongoose.model("User", userSchema)
export default UserModel
// Akhsay saini sql vs nosql