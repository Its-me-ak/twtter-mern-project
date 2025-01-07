import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute.js';
import { deleteNotifications, deleteSingleNotification, getNotifications } from '../controllers/notification.controllers.js';


const router = express.Router()

router.route("/").get(protectedRoute, getNotifications)
router.route("/").delete(protectedRoute, deleteNotifications)
router.route("/:id").delete(protectedRoute, deleteSingleNotification)




export default router