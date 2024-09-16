import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../adminaxios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FaTrashAlt, FaEdit, FaInfoCircle, FaSearch, FaSortAmountDown } from 'react-icons/fa';

const MySwal = withReactContent(Swal);

const ProductList = ({ onEditProduct }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/products/${id}`);
      setProducts(products.filter(product => product._id !== id));
      Swal.fire('Deleted!', 'Product has been deleted.', 'success');
    } catch (error) {
      Swal.fire('Error', 'Failed to delete product', 'error');
    }
  };

  const handleViewDetails = (product) => {
    const youtubeEmbedUrl = product.video_url ? product.video_url.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/') : '';
    const videoEmbedUrl = product.video || '';

    MySwal.fire({
      title: <strong>{product.name}</strong>,
      html: (
        <div>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Colors:</strong> {product.colors.join(', ')}</p>
          {youtubeEmbedUrl && (
            <div className="mb-4">
              <strong>Video (YouTube):</strong>
              <iframe
                width="100%"
                height="315"
                src={youtubeEmbedUrl}
                title={`${product.name} YouTube`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="mt-2"
              />
            </div>
          )}
          {videoEmbedUrl && (
            <div className="mb-4">
              <strong>Video (Direct Link):</strong>
              <video
                width="100%"
                height="315"
                controls
                className="mt-2"
              >
                <source src={videoEmbedUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          <div>
            <strong>Images:</strong>
            <div className="flex space-x-2 mt-2">
              {product.images.map((img, idx) => (
                <img key={idx} src={img} alt="Product" className="h-20 w-20 object-cover rounded-md" />
              ))}
            </div>
          </div>
        </div>
      ),
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: 'Close',
      footer: (
        <div className="flex space-x-4">
          <button
            onClick={() => {
              onEditProduct(product._id);
              MySwal.close();
            }}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            <FaEdit className="mr-2" /> Edit
          </button>
          <button
            onClick={() => {
              MySwal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
              }).then((result) => {
                if (result.isConfirmed) {
                  handleDelete(product._id);
                }
              });
            }}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
          >
            <FaTrashAlt className="mr-2" /> Delete
          </button>
        </div>
      )
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSortOrderChange = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const filteredProducts = products
    .filter(product => selectedCategory === 'All' || product.category === selectedCategory)
    .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="border p-2 rounded w-full"
          />
          <FaSearch className="text-gray-500" />
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border p-2 rounded"
          >
            <option value="All">All Categories</option>
            {categories.map(category => (
              <option key={category._id} value={category.name}>{category.name}</option>
            ))}
          </select>
          <button
            onClick={handleSortOrderChange}
            className="bg-gray-200 p-2 rounded hover:bg-gray-300 transition"
          >
            <FaSortAmountDown className={`text-lg ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            {sortOrder === 'asc' ? 'Sort by Newest' : 'Sort by Oldest'}
          </button>
        </div>
      </div>
      <ul className="space-y-4">
        {filteredProducts.map(product => (
          <li key={product._id} className="bg-gray-100 p-4 rounded-md shadow-sm flex items-center space-x-4">
            <img src={product.images[0]} alt="Product" className="h-16 w-16 object-cover rounded-md" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600">${product.price}</p>
              <p className="text-gray-500 text-sm">Created: {new Date(product.createdAt).toLocaleDateString()}</p>
            </div>
            <button
              onClick={() => handleViewDetails(product)}
              className="text-green-500 hover:text-green-600"
            >
              <FaInfoCircle className="text-lg" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
