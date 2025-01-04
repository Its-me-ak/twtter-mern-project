import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { followUnfollowUser, getUserProfile } from "../controllers/user.controllers.js";

const router = express.Router();

router.get("/profile/:username", protectedRoute, getUserProfile);
// router.get("/suggested", protectedRoute, getUserProfile);
router.post("/follow/:id", protectedRoute, followUnfollowUser);
// router.post("/profile/:username", protectedRoute, updateUserProfile);

export default router