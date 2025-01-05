import NotificationModel from "../models/notification.model.js";
import UserModel from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = async (req, res) => {
    const { username } = req.params
    try {
        const user = await UserModel.findOne({ username }).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error getting user profile", error);
        res.status(500).json({ error: "Error fetching user profile" });
    }
}

export const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params
        const userToModify = await UserModel.findById(id)
        const currentUser = await UserModel.findById(req.user._id)

        if (id === req.user._id.toString()) {
            return res.status(403)
                .json({
                    error: "You cannot follow or unfollow yourself"
                })
        }
        if (!userToModify || !currentUser) {
            return res.status(404)
                .json({
                    error: "User not found"
                })
        }
        const isFollwingUser = currentUser.following.includes(id)
        if (isFollwingUser) {
            // unfollow user
            await UserModel.findByIdAndUpdate(id,
                { $pull: { followers: req.user._id } },
            )
            await UserModel.findByIdAndUpdate(req.user._id,
                { $pull: { following: id } },
            )
            res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            // follow user
            await UserModel.findByIdAndUpdate(id,
                { $push: { followers: req.user._id } },
            )
            await UserModel.findByIdAndUpdate(req.user._id,
                { $push: { following: id } },
            )
            // send notification to the user
            const newNotifications = new NotificationModel({
                type: "follow",
                from: req.user._id,
                to: userToModify.id
            })
            await newNotifications.save()
            // TODO: return the id of the user as a response
            res.status(200).json({ message: "User followed successfully" });
        }

    } catch (error) {
        console.error("Error in followUnfollowUser", error);
        res.status(500).json({ error: error.message });
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id
        const userFollowedByMe = await UserModel.findById(userId).select("following")
        if (!userFollowedByMe) {
            return res.status(404).json({ error: "User not found" })
        }

        const users = await UserModel.aggregate([
            {
                $match: {
                    _id: { $ne: userId }
                }
            },
            {
                $sample: { size: 10 }
            }
        ])

        const filteredUsers = users.filter(user => !userFollowedByMe.following.includes(user._id))
        const suggestedUsers = filteredUsers.slice(0, 5);
        suggestedUsers.forEach(user => user.password = null)
        res.status(200).json(suggestedUsers);

    } catch (error) {
        console.error("Error in getSuggestedUsers", error);
        res.status(500).json({ error: error.message });
    }
}

export const updateUserProfile = async (req, res) => {
    const { fullName, email, username, currentPassword, newPassword, bio, link } = req.body
    let { profileImg, coverImg } = req.body
    const userId = req.user._id

    try {
        let user = await UserModel.findById(userId)
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ error: "Please provide both current password and new password" });
        }
        if (newPassword && currentPassword) {
            const isPasswordMatch = await bcrypt.compare(currentPassword, user.password)
            if (!isPasswordMatch) {
                return res.status(401).json({ error: "Current password is incorrect" });
            }
            if (newPassword.length < 8) {
                return res.status(400).json({ error: "Password must be at least 8 characters long" });
            }
            // const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(newPassword, 10)
            // console.log(salt);
            
        }
        if (profileImg) {
            // delete existing profile image if have any
            if(user.profileImg){
                await cloudinary.uploader.destroy(user.profileImg.split('/').pop().split('.')[0])
            }
            const uploadUserProfileImage = await cloudinary.uploader.upload(profileImg)
            profileImg = uploadUserProfileImage.secure_url
            console.log(uploadUserProfileImage);
        }
        if (coverImg) {
            // delete existing cover image if have any
            if(user.coverImg){
                await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split('.')[0])
            }
            const uploadUserCoverImage = await cloudinary.uploader.upload(coverImg)
            coverImg = uploadUserCoverImage.secure_url
        }
    
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;
        user = await user.save({
            validateBeforeSave: false
        })

        user.password = null; // remove password from the response data before sending back to the client
        res.status(200).json({
            message: "Profile updated successfully",
            user
        });

    } catch (error) {
        console.error("Error in updateUserProfile", error);
        res.status(500).json({ error: error.message });
    }
}