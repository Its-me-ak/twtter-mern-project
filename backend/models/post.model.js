import mongoose, {Schema} from "mongoose"

const postSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text:{
        type: String,
    },
    image:{
        type: String,
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    comments: [
        {
            text:{
                type: String,
                required: true
            },
            user:{
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        }
    ],
    bookmarkedBy: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: [],
        }
    ]
}, {
    timestamps: true,
})

const PostModel = mongoose.model("Post", postSchema)
export default PostModel