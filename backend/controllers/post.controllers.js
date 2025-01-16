import e, { request } from "express";
import PostModel from "../models/post.model.js";
import UserModel from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import NotificationModel from "../models/notification.model.js";

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { image } = req.body
        const userId = req.user._id.toString();
        const user = await UserModel.findById(userId)
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (!text && !image) {
            return res.status(400).json({ error: 'Post must have text or image' });
        }
        if (image) {
            const uploadedImageUrl = await cloudinary.uploader.upload(image)
            if (!uploadedImageUrl) {
                return res.status(500).json({ error: 'Error while uploading image' });
            }
            console.log(uploadedImageUrl);
            image = uploadedImageUrl.secure_url;
        }
        const newPost = new PostModel({
            user: userId,
            text,
            image
        })
        await newPost.save();
        res.status(200).json({
            message: "Post created successfully",
            newPost
        });
    } catch (error) {
        console.error("Error in createPost controller", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const deletePost = async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized to delete this post' });
        }
        if (post.image) {
            const imageId = post.image.split("/").pop().split(".")[0]
            console.log(imageId);
            await cloudinary.uploader.destroy(imageId)
        }
        await PostModel.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Post deleted successfully' });

    } catch (error) {
        console.error("Error in deletePost controller", error);
        res.status(500).json({ error: 'Internal Server Error', error });
    }
}

export const commentonPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id
        const userId = req.user._id
        if (!text) {
            return res.status(400).json({ error: 'Comment field is required' });
        }
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const comment = {
            user: userId,
            text
        }
        post.comments.push(comment)
        await post.save()
        res.status(200).json({
            message: 'Comment added successfully',
            post
        })
    } catch (error) {
        console.error("Error in commentonPost controller", error);
        res.status(500).json({ error: 'Internal Server Error', error });
    }
}

export const likeUnlikePost = async (req, res) => {
    try {
        const userId = req.user._id
        const postId = req.params.id
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const userLikeedPostAleady = post.likes.includes(userId)
        if (userLikeedPostAleady) {
            // unlike the post
            await PostModel.updateOne(
                {
                    _id: postId
                },
                {
                    $pull: {
                        likes: userId
                    }
                }
            )
            await UserModel.updateOne({
                _id: userId
            }, {
                $pull: {
                    likedPosts: postId
                }
            })
            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString())
            res.status(200).json(updatedLikes)
        } else {
            // like the post
            post.likes.push(userId)
            await UserModel.updateOne({
                _id: userId
            }, {
                $push: {
                    likedPosts: postId
                }
            })
            await post.save()
            const notifications = new NotificationModel({
                from: userId,
                to: post.user,
                type: "like",
            })
            await notifications.save()
            const updatedLikes = post.likes
            res.status(200).json(updatedLikes)
        }
    } catch (error) {
        console.error("Error in likeUnlikePost controller", error);
        res.status(500).json({ error: 'Internal Server Error', error });
    }
}

export const getLikedPosts = async (req, res) => {
    const userId = req.params.id
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const likedPosts = await PostModel.find({ _id: { $in: user.likedPosts } })
            .populate({
                path: 'user',
                select: '-password'
            })
            .populate({
                path: 'comments.user',
                select: '-password'
            })
        if (likedPosts.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(likedPosts)
    } catch (error) {
        console.error("Error in getLikedPosts controller", error);
        res.status(500).json({ error: 'Internal Server Error', error });
    }
}

// bookmmarked unbookmarked posts
export const bookmarkUnbookmarkPost = async (req, res) => {
    try {
        const userId = req.user._id
        const postId = req.params.id
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const userBookmarkPostAleady = post.bookmarkedBy.includes(userId)
        if (userBookmarkPostAleady) {
            // unbookmarked the post
            await PostModel.updateOne(
                {
                    _id: postId
                },
                {
                    $pull: {
                        bookmarkedBy: userId
                    }
                }
            )
            await UserModel.updateOne({
                _id: userId
            }, {
                $pull: {
                    bookmarkedPosts: postId
                }
            })
            const updatedBookmarks = post.bookmarkedBy.filter((id) => id.toString() !== userId.toString())
            res.status(200).json(updatedBookmarks)
        } else {
            // bookmark the post
            post.bookmarkedBy.push(userId)
            await UserModel.updateOne({
                _id: userId
            }, {
                $push: {
                    bookmarkedPosts: postId
                }
            })
            await post.save()
            const updatedBookmarks = post.bookmarkedBy
            res.status(200).json(updatedBookmarks)
        }
    } catch (error) {
        console.error("Error in bookmarkUnbookmarkPost controller", error);
        res.status(500).json({ error: 'Internal Server Error', error });
    }
};

// get all bookmark posts
export const getBookmarkedPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const bookmarkedPosts = await PostModel.find({ _id: { $in: user.bookmarkedPosts } })
            .populate({
                path: 'user',
                select: '-password'
            })
        if (bookmarkedPosts.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(bookmarkedPosts)

    } catch (error) {
        console.error("Error in getBookmarkedPosts controller", error);
        res.status(500).json({ error: 'Internal Server Error', error });
    }
}

// repost the posts
export const repostPost = async (req, res) => {
    try {
        const postId = req.params.id
        const userId = req.user._id
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        // if user rposted a post already
        const hasReposted = post.repostedBy.includes(userId)

        if (hasReposted) {
            post.repostedBy = post.repostedBy.filter((id) => id.toString() !== userId)
            post.repostCount -= 1
            // remove from user's reposted post
            await UserModel.updateOne({
                _id: userId
            }, {
                $pull: {
                    repostedPosts: postId
                }
            })
        } else {
            post.repostedBy.push(userId)
            post.repostCount += 1
            // add to user's reposted post
            await UserModel.updateOne({
                _id: userId
            }, {
                $push: {
                    repostedPosts: postId
                }
            })
        }
        await post.save()
        res.status(200).json({
            message: hasReposted ? 'Repost removed' : 'Reposted successfully',
            post
        })
    } catch (error) {
        console.error("Error in repostPost controller", error);
        res.status(500).json({ error: 'Internal Server Error', error });
    }
}


export const getAllPosts = async (req, res) => {
    try {
        const posts = await PostModel.find()
            .sort({ createdAt: -1 })
            .populate({
                path: 'user',
                select: '-password -email'
            })
            .populate({
                path: 'comments.user',
                select: '-password -email'
            })
        if (posts.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(posts)
    } catch (error) {
        console.error("Error in getAllPosts controller", error);
        res.status(500).json({ error: 'Internal Server Error', error });
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const followingUsers = user.following
        const followingUsersPosts = await PostModel.find({ user: { $in: followingUsers } })
            .sort({ createdAt: -1 })
            .populate({
                path: 'user',
                select: '-password -email'
            })
            .populate({
                path: 'comments.user',
                select: '-password -email'
            })
        res.status(200).json(followingUsersPosts)
    } catch (error) {
        console.error("Error in getFollowingPosts controller", error);
        res.status(500).json({ error: 'Internal Server Error', error });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params
        const user = await UserModel.findOne({ username })
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userPosts = await PostModel.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate({
                path: 'user',
                select: '-password -email'
            })
            .populate({
                path: 'comments.user',
                select: '-password -email'
            })

        res.status(200).json(userPosts)
    } catch (error) {
        console.error("Error in getUserPosts controller", error);
        res.status(500).json({ error: 'Internal Server Error', error });
    }
} 