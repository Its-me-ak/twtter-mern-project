import express  from "express"
import { protectedRoute } from "../middleware/protectedRoute.js"
import { bookmarkUnbookmarkPost, commentonPost, createPost, deletePost, getAllPosts, getBookmarkedPosts, getFollowingPosts, getLikedPosts, getUserPosts, likeUnlikePost } from "../controllers/post.controllers.js"

const router = express.Router()

router.route("/all-posts").get(protectedRoute, getAllPosts)
router.route("/likes/:id").get(protectedRoute, getLikedPosts)
router.route("/following").get(protectedRoute, getFollowingPosts)
router.route("/bookmarks/:id").get(protectedRoute, getBookmarkedPosts)
router.route("/user-post/:username").get(protectedRoute, getUserPosts)
router.route("/create").post(protectedRoute, createPost)
router.route("/like/:id").post(protectedRoute, likeUnlikePost)
router.route("/comment/:id").post(protectedRoute, commentonPost)
router.route("/bookmark/:id").post(protectedRoute, bookmarkUnbookmarkPost)
router.route("/:id").delete(protectedRoute, deletePost)


export default router