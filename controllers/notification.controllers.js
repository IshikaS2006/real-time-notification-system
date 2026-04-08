import notificationModel from "../models/notification.models.js";

export const getNotifications = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const skip = Math.max(0, parseInt(req.query.skip) || 0);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
        
        const notifications = await notificationModel
            .find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        const total = await notificationModel.countDocuments({ user: req.user._id });
        res.status(200).json({ notifications, pagination: { skip, limit, total } });
    }
    catch (error) {
        console.error("Error in getNotifications:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const unreadNotifications = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const skip = Math.max(0, parseInt(req.query.skip) || 0);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
        
        const notifications = await notificationModel
            .find({ user: req.user._id, read: false })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        const total = await notificationModel.countDocuments({ user: req.user._id, read: false });
        res.status(200).json({ notifications, pagination: { skip, limit, total } });
    }
    catch (error) {
        console.error("Error in unreadNotifications:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const markAsRead = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const notificationId = req.params.id;
        if (!notificationId) {
            return res.status(400).json({ message: "Notification ID is required" });
        }
        const notification = await notificationModel
            .findOne({ _id: notificationId, user: req.user._id });
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        notification.read = true;
        await notification.save();
        res.status(200).json({ message: "Notification marked as read", notification });
    }
    catch (error) {
        console.error("Error in markAsRead:", error);
        res.status(500).json({ message: "Server error" });
    }
};