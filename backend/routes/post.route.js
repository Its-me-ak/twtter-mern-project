import express  from "express"
import { protectedRoute } from "../middleware/protectedRoute.js"
import { commentonPost, createPost, deletePost, getAllPosts, getLikedPosts, likeUnlikePost } from "../controllers/post.controllers.js"

const router = express.Router()

router.route("/all-posts").get(protectedRoute, getAllPosts)
router.route("/likes/:id").get(protectedRoute, getLikedPosts)
router.route("/create").post(protectedRoute, createPost)
router.route("/like/:id").post(protectedRoute, likeUnlikePost)
router.route("/comment/:id").post(protectedRoute, commentonPost)
router.route("/:id").delete(protectedRoute, deletePost)


export default router