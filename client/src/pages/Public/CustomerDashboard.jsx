import React from 'react';
import Product from './Product';
import { FaShoppingCart, FaSignOutAlt, FaHistory, FaTrophy, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import RecommendationComponent from './RecommendationsComponent';

const CustomerDashboard = () => {
  const token = localStorage.getItem('token'); // Fix for token retrieval

  return (
    <div className="relative min-h-screen bg-gray-100 flex flex-col">
      

      {/* Recommendation Component */}
      <div className="p-6 bg-white shadow-md rounded-lg mx-4 my-4">
        <RecommendationComponent userId={'66d338e05bbd8e628006a6a7'} />
      </div>

      {/* Product Section */}
      <div className="flex-grow p-4">
        <Product />
      </div>
    </div>
  );
};

export default CustomerDashboard;
