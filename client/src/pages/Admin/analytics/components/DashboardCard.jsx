// components/DashboardCard.jsx
import React from 'react';

const DashboardCard = ({ title, value, isCurrency }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      <p className={`text-2xl font-bold ${isCurrency ? 'text-green-600' : 'text-gray-900'}`}>
        {isCurrency ? `$${value.toFixed(2)}` : value}
      </p>
    </div>
  );
};

export default DashboardCard;
