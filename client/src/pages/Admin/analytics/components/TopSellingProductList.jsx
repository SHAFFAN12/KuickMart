// components/TopSellingProductsList.jsx
import React from 'react';
import { HiShoppingCart } from 'react-icons/hi'; // Importing an icon from react-icons

const TopSellingProductsList = ({ products }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
      <h3 className="text-2xl font-extrabold text-gray-800 mb-4">Top Selling Products</h3>
      <ul className="space-y-3">
        {products.map((product, index) => (
          <li key={index} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center">
              <HiShoppingCart className="text-gray-600 mr-2" />
              <span className="text-lg font-medium">{product.name}</span>
            </div>
            <span className="font-bold text-blue-600 text-lg">{product.totalQty} sold</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopSellingProductsList;
