import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { followUnfollowUser, getSuggestedUsers, getUserFollowers, getUserFollowings, getUserProfile, updateUserProfile } from "../controllers/user.controllers.js";

const router = express.Router();

router.get("/profile/:username", protectedRoute, getUserProfile);
router.get("/suggested", protectedRoute, getSuggestedUsers);
router.get("/following/:username", protectedRoute, getUserFollowings);
router.get("/followers/:username", protectedRoute, getUserFollowers);
router.post("/follow/:id", protectedRoute, followUnfollowUser);
router.post("/update", protectedRoute, updateUserProfile);

export default router