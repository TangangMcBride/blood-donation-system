import Notification from '../models/Notification.js';

export const createNotification = async (userId, title, message, type = 'Info', relatedEntity = null, relatedEntityType = null) => {
  try {
    const notification = new Notification({
      user: userId,
      title,
      message,
      type,
      relatedEntity,
      relatedEntityType,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error.message);
    throw error;
  }
};

export const getUnreadNotifications = async (userId) => {
  try {
    return await Notification.find({
      user: userId,
      isRead: false,
    }).sort({ createdAt: -1 });
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    throw error;
  }
};