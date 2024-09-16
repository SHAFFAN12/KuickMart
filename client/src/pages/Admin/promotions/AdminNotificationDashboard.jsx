import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaBell, FaEnvelope } from 'react-icons/fa';

const AdminNotificationDashboard = () => {
  const [message, setMessage] = useState('');
  const [type, setType] = useState('order');

  const handleSendNotification = async () => {
    try {
      await axios.post('http://localhost:5000/api/notifications', {
        message,
        type,
      });

      Swal.fire({
        icon: 'success',
        title: 'Notification Sent',
        text: 'Your notification has been sent successfully!',
      });

      setMessage('');
    } catch (error) {
      console.error('Error sending notification:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error sending the notification.',
      });
    }
  };

  const handleSendPromotion = () => {
    Swal.fire({
      title: 'Send Promotion',
      input: 'text',
      inputPlaceholder: 'Enter your promotion message',
      showCancelButton: true,
      confirmButtonText: 'Send',
      showLoaderOnConfirm: true,
      preConfirm: async (promotionMessage) => {
        try {
          await axios.post('http://localhost:5000/api/notifications', {
            message: promotionMessage,
            type: 'promotion',
          });

          Swal.fire({
            icon: 'success',
            title: 'Promotion Sent',
            text: 'Your promotion has been sent successfully!',
          });
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error sending the promotion.',
          });
        }
      },
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <FaBell className="mr-2 text-yellow-500" /> Send Notification
      </h2>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Message:</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Type:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="order">Order</option>
            <option value="promotion">Promotion</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          onClick={handleSendNotification}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Send Notification
        </button>
      </form>
      <div className="mt-6">
        <button
          onClick={handleSendPromotion}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 flex items-center justify-center"
        >
          <FaEnvelope className="mr-2" /> Send Promotion
        </button>
      </div>
    </div>
  );
};

export default AdminNotificationDashboard;
