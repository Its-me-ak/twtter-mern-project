import express  from "express"
import { protectedRoute } from "../middleware/protectedRoute.js"
import { createPost, deletePost } from "../controllers/post.controllers.js"

const router = express.Router()

router.route("/create").post(protectedRoute, createPost)
// router.route("/like/:id").post(protectedRoute, likeUnlikePost)
// router.route("/comment/:id").post(protectedRoute, commentOnPost)
router.route("/:id").delete(protectedRoute, deletePost)


export default router