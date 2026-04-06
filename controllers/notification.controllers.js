import notificationModels from "../models/notification.models";

export const getNotifications = async (req, res) => {
    try {
        const notifications = await notificationModels.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ notifications });
    }
    catch (error) {
        console.error("Error in getNotifications:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const unreadNotifications = async (req, res) => {
    try {
        const notifications = await notificationModels.find({ userId: req.user._id, read: false }).sort({ createdAt: -1 });
        res.status(200).json({ notifications });
    }
    catch (error) {
        console.error("Error in unreadNotifications:", error);
        res.status(500).json({ message: "Server error" });
    }   
};

export const markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const notification = await notification
            .findOne({ _id: notificationId, userId: req.user._id });
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        notification.read = true;
        await notification.save();
        res.status(200).json({ message: "Notification marked as read" });
    }
    catch (error) {
        console.error("Error in markAsRead:", error);
        res.status(500).json({ message: "Server error" });
    }
};