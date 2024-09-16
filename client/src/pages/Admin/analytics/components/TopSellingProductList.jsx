// components/TopSellingProductsList.jsx
import React from 'react';

const TopSellingProductsList = ({ products }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Top Selling Products</h3>
      <ul className="space-y-2">
        {products.map((product, index) => (
          <li key={index} className="flex justify-between">
            <span>{product.name}</span>
            <span className="font-bold text-blue-600">{product.totalQty} sold</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopSellingProductsList;
