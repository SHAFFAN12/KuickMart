import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../adminaxios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FaTrashAlt, FaEdit, FaInfoCircle, FaSearch, FaSortAmountDown, FaMoneyBillAlt, FaBox } from 'react-icons/fa';

const MySwal = withReactContent(Swal);

const ProductList = ({ onEditProduct }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10); // Number of products per page
  const [totalProducts, setTotalProducts] = useState(0); // Total number of products

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/products', {
          params: {
            category: selectedCategory === 'All' ? undefined : selectedCategory,
            search: searchTerm,
            sortOrder: sortOrder,
            page: currentPage,
            limit: productsPerPage
          }
        });
        setProducts(response.data || []);
        setTotalProducts(response.data.length || 0);
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories');
        setCategories(response.data || []);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [selectedCategory, searchTerm, sortOrder, currentPage]);

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
    const youtubeEmbedUrl = product.video_url
    ? product.video_url.replace(/https:\/\/www\.youtube\.com\/(watch\?v=|shorts\/)/, 'https://www.youtube.com/embed/')
    : '';
        const videoEmbedUrl = product.video || '';

    MySwal.fire({
      title: <strong>{product.name}</strong>,
      html: (
        <div>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Price:</strong> {product.price}</p>
          <p><strong>Stock</strong> {product.stock}</p>
          <p><strong>Category:</strong> {categories.find(cat => cat._id === product.category._id)?.name}</p>
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
    setCurrentPage(1); // Reset to the first page on search
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1); // Reset to the first page on category change
  };

  const handleSortOrderChange = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handlePageChange = (page) => {
    setCurrentPage(prevPage => Math.max(1, Math.min(page, totalPages)));
  };
  
  // Apply sorting and filtering to all products before pagination
  const sortedAndFilteredProducts = products
  .filter(product => selectedCategory === 'All' || product.category._id === selectedCategory)
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    const totalPages = Math.ceil(totalProducts / productsPerPage);

  const paginatedProducts = sortedAndFilteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <div className="flex items-center mb-4 space-x-2">
        <p className="text-lg font-semibold text-gray-800">
          Total Products: <span className="text-blue-600">{totalProducts}</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={handleSearch}
            className="border p-2 rounded w-full md:w-80"
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
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
          <button
            onClick={handleSortOrderChange}
            className="bg-gray-200 p-2 rounded hover:bg-gray-300 transition"
            >
            <FaSortAmountDown className={`text-lg ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
      <ul className="space-y-4">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
            <li key={product._id} className="bg-white p-6 rounded-lg shadow-lg flex items-start space-x-4 hover:shadow-xl transition-shadow">
              <div className="flex-shrink-0 w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
                <h2 className="text-2xl font-semibold mb-2 flex  items-center "><FaMoneyBillAlt size={35} className='  text-green-400 m-2 '/>{product.price}</h2>
                <p className="text-gray-700 mb-2 line-clamp-3">{product.description}</p>
                <p className="text-gray-600">
                  Category: {categories.find(category => category._id === product.category._id)?.name || 'Unknown'}
                </p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => handleViewDetails(product)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition-colors"
                >
                  <FaInfoCircle className="text-xl" />
                  <span>Details</span>

                </button>
                <div className="  flex items-center space-x-2 text-gray-700">
      <FaBox className="text-xl text-green-500" />
      <span className="m-2">
        Stock: {product.stock}
      </span>
    </div>              </div>
            </li>
          ))) : (
          <p>No products found.</p>
        )}
      </ul>
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
