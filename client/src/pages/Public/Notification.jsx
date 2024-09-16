import React, { useState, useEffect } from 'react';
import { FaBell, FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';
import useSocket from './useSocket';
import axios from 'axios';

const iconMap = {
  order: <FaInfoCircle className="text-blue-500" />,
  promotion: <FaBell className="text-yellow-500" />,
  admin: <FaCheckCircle className="text-green-500" />,
};

const CustomerNotificationComponent = () => {
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
      // Avoid duplicate notifications
      const existingIds = new Set(prevNotifications.map((notif) => notif._id));
      if (!existingIds.has(notification._id)) {
        return [notification, ...prevNotifications];
      }
      return prevNotifications;
    });
  };

  useSocket('http://localhost:5000', 'receiveNotification', handleNotification);

  const getFilteredNotifications = () => {
    const now = new Date();
    return notifications.filter((notif) => {
      const notifDate = new Date(notif.createdAt);
      const timeDifference = now - notifDate;
      return timeDifference <= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    });
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="m-1 bg-white rounded-lg shadow-md">
     
      <ul className="space-y-4">
        {filteredNotifications.map((notif) => (
          <li
            key={notif._id}
            className={`p-4 border-l-4 rounded-lg flex items-center space-x-4 ${
              notif.isRead
                ? 'bg-gray-100 border-gray-300'
                : 'bg-yellow-50 border-yellow-300'
            }`}
          >
            <span className="text-xl">{iconMap[notif.type]}</span>
            <div className="flex-1">
              <strong>{notif.type.toUpperCase()}:</strong> {notif.message}
            </div>
            {notif.isRead ? (
              <FaCheckCircle className="text-green-500 ml-auto" />
            ) : (
              <FaTimesCircle className="text-red-500 ml-auto" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerNotificationComponent;
