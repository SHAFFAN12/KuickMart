// components/TopCustomersList.jsx
import React from 'react';
import { HiUserCircle } from 'react-icons/hi'; // Importing an icon from react-icons

const TopCustomersList = ({ customers }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
      <h3 className="text-2xl font-extrabold text-gray-800 mb-4">Top Customers</h3>
      <ul className="space-y-3">
        {customers.map((customer, index) => (
          <li key={index} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center">
              <HiUserCircle className="text-gray-600 mr-2" />
              <span className="text-lg font-medium">{customer.name}</span>
            </div>
            <span className="font-bold text-green-600 text-lg">${customer.totalSpent.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopCustomersList;
