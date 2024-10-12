import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../adminaxios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FaTrashAlt, FaEdit, FaInfoCircle, FaSearch, FaSortAmountDown, FaMoneyBillAlt, FaBox, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const MySwal = withReactContent(Swal);

const ProductList = ({ onEditProduct }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc');
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/products', {
          params: {
            category: selectedCategory === 'All' ? undefined : selectedCategory,
            search: searchTerm,
            sortOrder: sortOrder,
            page: currentPage,
            limit: productsPerPage,
          },
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
    MySwal.fire({
      html: (
        <div className="p-8 bg-gray-50 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="w-full h-auto rounded-lg overflow-hidden">
              <ImageCarousel images={product.images} />
            </div>
      
            <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
              <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
      
              <div className='pt-4 space-y-3'>
                <p className="text-gray-800 text-xl flex items-start">
                  <strong className="text-lg">Price:</strong>
                  <span className='ml-2 text-red-500 text-xl'>Rs {product.price.toFixed(2)}</span>
                </p>
      
                <div className="text-gray-700">
                  <p className='text-xl flex items-start'>
                    <strong className="text-lg">Category:</strong>
                    <span className='ml-2'>{categories.find(cat => cat._id === product.category._id)?.name}</span>
                  </p>
                </div>
      
                <div className="flex space-x-4 items-center">
                  <p className="text-xl">
                    <strong className="text-lg">Stock:</strong>
                    <span className='ml-2'>{product.stock}</span>
                  </p>
                </div>
      
                {/* Display Colors Visually */}
                <div className='flex items-start'>
                  <strong className='mr-2 text-lg'>Colors:</strong>
                  {product.colors.join(', ')}
                </div>
              </div>
            </div>
          </div>
      
          {/* Product Description */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-xl font-bold">Product Details</h1>
            <p className="text-gray-600 mt-2 text-left">
              {product.description}
            </p>
          </div>
        </div>
      ),
      
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: 'Close',
      customClass: {
        popup: 'bg-white w-full rounded-xl shadow-xl max-w-4xl mx-auto transition-transform transform-gpu',
        title: 'font-semibold text-center mb-6',
        html: 'text-gray-800',
        cancelButton: 'bg-gray-300 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-400 transition-all duration-300',
        footer: 'flex justify-around mt-6',
      },
      footer: (
        <div className="flex space-x-4">
          {/* Edit Button */}
          <button
            onClick={() => {
              onEditProduct(product._id);
              MySwal.close();
            }}
            className="flex items-center bg-blue-700 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-800 transition duration-300"
          >
            <FaEdit className="mr-2" /> Edit
          </button>
  
          {/* Delete Button */}
          <button
            onClick={() => {
              MySwal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
              }).then((result) => {
                if (result.isConfirmed) {
                  handleDelete(product._id);
                }
              });
            }}
            className="flex items-center bg-red-700 text-white py-2 px-6 rounded-lg shadow-md hover:bg-red-800 transition duration-300"
          >
            <FaTrashAlt className="mr-2" /> Delete
          </button>
        </div>
      ),
    });
  };

  const ImageCarousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
      <div className="relative group">
        <img src={images[currentIndex]} alt="Product" className="w-full h-50 object-cover rounded-md mb-2" />

        <button
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:opacity-100"
          onClick={prevImage}
        >
          <FaChevronLeft />
        </button>

        <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:opacity-100"
          onClick={nextImage}
        >
          <FaChevronRight />
        </button>
      </div>
    );
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleSortOrderChange = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const handlePageChange = (page) => {
    setCurrentPage((prevPage) => Math.max(1, Math.min(page, totalPages)));
  };

  const sortedAndFilteredProducts = products
    .filter(product => selectedCategory === 'All' || product.category._id === selectedCategory)
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (sortOrder === 'asc' ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt)));

  const paginatedProducts = sortedAndFilteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg transition-shadow duration-1000">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Product List</h1>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center w-full md:w-auto space-x-2">
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={handleSearch}
            className="border p-3 rounded-lg w-full md:w-80 focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="text-gray-500" />
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Categories</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
          <button
            onClick={handleSortOrderChange}
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-2 rounded-lg hover:from-blue-600 hover:to-blue-800 transition duration-300 transform hover:scale-105"
          >
            <FaSortAmountDown className={`text-lg ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      <ul className="space-y-4">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
            <li key={product._id} className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-start space-x-4 transition-transform transform hover:scale-105 hover:shadow-lg">
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-32 w-32 object-cover rounded-lg shadow-sm"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-lg font-bold text-blue-600">₨ {product.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              </div>
              <button
                onClick={() => handleViewDetails(product)}
                className="px-4 py-2  bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition duration-300 transform hover:scale-105 mt-4 md:mt-0"
              >
                <FaInfoCircle />
              </button>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No products found.</li>
        )}
      </ul>

      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-l-lg transition-all ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          Prev
        </button>
        <span className="px-4 py-2 border-t border-b">{currentPage} / {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-r-lg transition-all ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
