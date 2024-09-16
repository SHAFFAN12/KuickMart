// components/TopCustomersList.jsx
import React from 'react';

const TopCustomersList = ({ customers }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Top Customers</h3>
      <ul className="space-y-2">
        {customers.map((customer, index) => (
          <li key={index} className="flex justify-between">
            <span>{customer.name}</span>
            <span className="font-bold text-green-600">${customer.totalSpent.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopCustomersList;
