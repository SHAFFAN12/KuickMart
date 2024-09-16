// components/AverageDeliveryTime.jsx
import React from 'react';

const AverageDeliveryTime = ({ time }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Average Delivery Time</h3>
      <p>{(time / (1000 * 60 * 60)).toFixed(2)} hours</p>
    </div>
  );
};

export default AverageDeliveryTime;
