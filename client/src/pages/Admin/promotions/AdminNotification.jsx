import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaExclamationCircle, FaTrash } from 'react-icons/fa';
import useSocket from './useSocket'; // Adjust the path as needed

const AdminNotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/notifications');
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotification = (notification) => {
    setNotifications((prevNotifications) => {
      // Prevent adding duplicate notifications
      const existingIds = new Set(prevNotifications.map((notif) => notif._id));
      if (!existingIds.has(notification._id)) {
        return [notification, ...prevNotifications];
      }
      return prevNotifications;
    });
  };

  // Set up socket connection and event listener
  useSocket('http://localhost:5000', 'receiveNotification', handleNotification);

  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${id}`);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif._id !== id)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Admin Notifications</h2>
      <ul className="space-y-4">
        {notifications.map((notif) => (
          <li
            key={notif._id}
            className={`p-4 border rounded-lg flex items-center justify-between ${
              notif.isRead ? 'bg-gray-100 border-gray-300' : 'bg-blue-50 border-blue-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              {notif.isRead ? (
                <FaCheckCircle className="text-green-500" />
              ) : (
                <FaExclamationCircle className="text-blue-500" />
              )}
              <span className="font-medium">{notif.type.toUpperCase()}:</span>
              <span>{notif.message}</span>
            </div>
            <button
              onClick={() => handleDeleteNotification(notif._id)}
              className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 flex items-center"
            >
              <FaTrash className="mr-2" /> Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminNotificationComponent;
