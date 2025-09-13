// src/components/Notification.jsx
import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Notifications = ({ detailed = false, onNotificationUpdate }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'unread', 'read'

  useEffect(() => {
    fetchNotifications();
  }, [activeFilter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await API.get('/notifications');
      
      if (response.data && response.data.success) {
        let filteredNotifications = response.data.data;
        
        // Apply filter
        if (activeFilter === 'unread') {
          filteredNotifications = filteredNotifications.filter(notification => !notification.isRead);
        } else if (activeFilter === 'read') {
          filteredNotifications = filteredNotifications.filter(notification => notification.isRead);
        }
        
        setNotifications(filteredNotifications);
      }
    } catch (err) {
      setError('Failed to load notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await API.put(`/notifications/${notificationId}/read`);
      
      if (response.data && response.data.success) {
        // Update local state
        const updatedNotifications = notifications.map(notification => 
          notification._id === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        );
        
        setNotifications(updatedNotifications);
        
        // Notify parent component if needed
        if (onNotificationUpdate) {
          onNotificationUpdate(updatedNotifications.filter(n => !n.isRead).length);
        }
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
      alert('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await API.put('/notifications/mark-all-read');
      
      if (response.data && response.data.success) {
        // Update all notifications to read
        const updatedNotifications = notifications.map(notification => ({
          ...notification,
          isRead: true
        }));
        
        setNotifications(updatedNotifications);
        
        // Notify parent component if needed
        if (onNotificationUpdate) {
          onNotificationUpdate(0);
        }
        
        alert('All notifications marked as read');
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      alert('Failed to mark all notifications as read');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await API.delete(`/notifications/${notificationId}`);
      
      if (response.data && response.data.success) {
        // Remove from local state
        const updatedNotifications = notifications.filter(
          notification => notification._id !== notificationId
        );
        
        setNotifications(updatedNotifications);
        
        // Notify parent component if needed
        if (onNotificationUpdate) {
          onNotificationUpdate(updatedNotifications.filter(n => !n.isRead).length);
        }
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
      alert('Failed to delete notification');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'urgent':
        return '🔴'; // Red circle for urgent
      case 'blood_request':
        return '💉'; // Syringe for blood requests
      case 'donation_reminder':
        return '⏰'; // Alarm clock for reminders
      case 'system':
        return 'ℹ️'; // Information for system messages
      default:
        return '📌'; // Pushpin for general notifications
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Notifications</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Notifications</h2>
        <div className="text-red-500 bg-red-100 p-4 rounded">
          {error}
          <button 
            onClick={fetchNotifications}
            className="ml-4 px-3 py-1 bg-red-500 text-white rounded text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // For dashboard view (summary)
  if (!detailed) {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    const displayNotifications = notifications.slice(0, 3);

    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>
        
        {displayNotifications.length === 0 ? (
          <p className="text-gray-500">No notifications.</p>
        ) : (
          <div className="space-y-3">
            {displayNotifications.map(notification => (
              <div 
                key={notification._id} 
                className={`p-3 rounded-lg border-l-4 ${
                  notification.isRead 
                    ? 'border-gray-300 bg-gray-50' 
                    : 'border-red-500 bg-red-50'
                }`}
              >
                <div className="flex items-start">
                  <span className="text-lg mr-2">{getNotificationIcon(notification.type)}</span>
                  <div className="flex-1">
                    <h3 className={`font-medium ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="text-xs text-blue-600 hover:text-blue-800 ml-2"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {notifications.length > 3 && (
          <button className="mt-3 text-sm text-blue-600 hover:text-blue-800">
            View all notifications
          </button>
        )}
      </div>
    );
  }

  // For detailed view (notifications page)
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <div className="flex space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['all', 'unread', 'read'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 text-sm rounded-md ${
                  activeFilter === filter
                    ? 'bg-white text-red-600 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={markAllAsRead}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
            disabled={notifications.filter(n => !n.isRead).length === 0}
          >
            Mark all as read
          </button>
        </div>
      </div>
      
      {notifications.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-500 text-lg">No notifications found</p>
          <p className="text-gray-400 mt-1">
            {activeFilter !== 'all' 
              ? `Try changing your filter to see more notifications` 
              : `You're all caught up!`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(notification => (
            <div 
              key={notification._id} 
              className={`p-4 rounded-lg border ${
                notification.isRead 
                  ? 'border-gray-200 bg-white' 
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-start">
                <span className="text-2xl mr-3 mt-1">{getNotificationIcon(notification.type)}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`text-lg font-medium ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                  
                  {notification.ctaLink && notification.ctaText && (
                    <a
                      href={notification.ctaLink}
                      className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                    >
                      {notification.ctaText}
                    </a>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                      title="Mark as read"
                    >
                      ✓ Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification._id)}
                    className="text-sm text-red-600 hover:text-red-800"
                    title="Delete notification"
                  >
                    × Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;