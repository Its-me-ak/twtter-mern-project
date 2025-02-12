import mongoose, {Schema} from "mongoose"

const notificationSchema = new Schema({
    from:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    to:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type:{
        type: String,
        required: true,
        enum: ['follow', 'like', 'comment']
    },
    read:{
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
})

const NotificationModel = mongoose.model("Notification", notificationSchema)
export default NotificationModel