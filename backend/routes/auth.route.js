import express from "express";
import { getUser, login, logout, signup } from "../controllers/auth.controllers.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const router = express.Router();

router.get("/get-user", protectedRoute , getUser);
router.post("/signup", signup);
router.post("/login", login)
router.post("/logout", logout);

export default router

// pass - akib_123