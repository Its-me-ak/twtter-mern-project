import MessageModel from "../models/message.model.js"
import UserModel from "../models/user.model.js"
import { v2 as cloudinary } from "cloudinary";


export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await UserModel.find({ _id: { $ne: loggedInUserId } }).select("-password")
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.error("Error while fetching users for sidebar", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getMessages = async (req, res) => {
    try {
        const {id:userToChatId} = req.params
        const myId = req.user._id
        const messages = await MessageModel.find({ 
            $or: [
                { senderId: myId, receiverId: userToChatId }, 
                { senderId: userToChatId, receiverId: myId }
            ] 
        })
        res.status(200).json(messages)
    } catch (error) {
        console.error("Error while fetching messages", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {text} = req.body
        let {image} = req.body
        const {id: receiverId} = req.params
        const senderId = req.user._id

        if (!text && !image) {
            return res.status(400).json({ error: 'You cannot send empty message' });
        }
        if (image) {
            const uploadedImageUrl = await cloudinary.uploader.upload(image)
            if (!uploadedImageUrl) {
                return res.status(500).json({ error: 'Error while uploading image' });
            }
            console.log(uploadedImageUrl);
            image = uploadedImageUrl.secure_url;
        }
        
        const newMessage = new MessageModel({
            senderId,
            receiverId,
            text,
            image
        })
        await newMessage.save()
        // TODO: realtime messages functionality goes here with the help of soket.io
        res.status(201).json(newMessage)
    } catch (error) {
        console.error("Error while sending message", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}