import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaBell, FaEnvelope } from 'react-icons/fa';
import { GiRingingBell } from "react-icons/gi";

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
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
    <h2 className="text-3xl font-extrabold mb-6 flex items-center text-blue-700">
      <FaBell className="mr-3 text-yellow-500 text-4xl" /> Send Notification
    </h2>
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <div>
        <label className="block text-base font-semibold mb-2 text-gray-700">
          Message:
        </label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
          placeholder="Enter your notification message"
        />
      </div>
      <div>
        <label className="block text-base font-semibold mb-2 text-gray-700">
          Type:
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
        >
          <option value="order">Order</option>
          <option value="promotion">Promotion</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button
  onClick={handleSendNotification}
  className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center space-x-2"
>
  <GiRingingBell className="text-xl" />
  <span>Send Notification</span>
</button>

    </form>
    <div className="mt-8">
      <button
        onClick={handleSendPromotion}
        className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-lg shadow-lg flex items-center justify-center hover:from-green-600 hover:to-green-800 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        <FaEnvelope className="mr-2 text-lg" /> Send Promotion
      </button>
    </div>
  </div>
  
  );
};

export default AdminNotificationDashboard;
