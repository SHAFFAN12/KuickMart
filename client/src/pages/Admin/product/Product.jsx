import React, { useState } from 'react';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import { FaPlusCircle } from 'react-icons/fa';

const Product = () => {
  const [editingProductId, setEditingProductId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleAddProduct = () => {
    setEditingProductId(null);
    setIsFormVisible(true);
  };

  const handleEditProduct = (id) => {
    setEditingProductId(id);
    setIsFormVisible(true);
  };

  const handleFormClose = () => {
    setIsFormVisible(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products Management</h1>
        <button
          onClick={handleAddProduct}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-4 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 flex items-center transition duration-300 transform hover:scale-105"
        >
          <FaPlusCircle className="mr-2" /> Add New Product
        </button>
      </div>
      {isFormVisible && (
        <ProductForm
          productId={editingProductId}
          onClose={handleFormClose}
        />
      )}
      <ProductList onEditProduct={handleEditProduct} />
    </div>
  );
};

export default Product;
