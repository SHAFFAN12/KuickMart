// components/AverageDeliveryTime.jsx
import React from 'react';

const AverageDeliveryTime = ({ time }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Average Delivery Time</h3>
      <p className="text-xl text-gray-600">
        {(time / (1000 * 60 * 60)).toFixed(2)} hours
      </p>
    </div>
  );
};

export default AverageDeliveryTime;
