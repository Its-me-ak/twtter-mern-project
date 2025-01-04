import NotificationModel from "../models/notification.model.js";
import UserModel from "../models/user.model.js"

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