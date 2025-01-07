import NotificationModel from "../models/notification.model.js"

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id
        const notifications = await NotificationModel.find({ to: userId })
            .populate({
                path: 'from',
                select: 'username profileImg'
            })
        await NotificationModel.updateMany({ to: userId }, { read: true })
        res.status(200).json(notifications)
    } catch (error) {
        console.error("Error while getting notifications", error.message)
        res.status(500).json({ message: 'Internal Server Error', error })
    }
}

export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id
        await NotificationModel.deleteMany({ to: userId })
        res.status(200).json({ message: 'Notifications deleted successfully' })
    } catch (error) {
        console.error("Error while deleting notifications", error.message)
        res.status(500).json({ message: 'Internal Server Error', error })
    }
}

// Delete Single Notification

export const deleteSingleNotification = async (req, res) => {
    try {
        const userId = req.user._id
        const notificationId = req.params.id
        const notification = await NotificationModel.findById(notificationId)
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' })
        }
        if (notification.to.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this notification' })
        }
        await NotificationModel.findByIdAndDelete(notificationId)
        res.status(200).json({ message: 'Notification deleted successfully' })
    } catch (error) {
        console.error("Error while deleting single notification", error.message)
        res.status(500).json({ message: 'Internal Server Error', error })
    }
}