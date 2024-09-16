import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiFillStar, AiOutlineStar, AiOutlineDelete } from 'react-icons/ai';
import axiosInstance from '../../publicaxios';
import Swal from 'sweetalert2';
import { Carousel } from 'react-responsive-carousel';
import { FaCircle } from 'react-icons/fa';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get('/products');
        const productsWithRatings = await Promise.all(
          res.data.map(async (product) => {
            try {
              const reviewRes = await axiosInstance.get(`/reviews/${product._id}`);
              const reviews = reviewRes.data;
              const averageRating = reviews.length > 0
                ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                : 0;
              return { ...product, averageRating };
            } catch (error) {
              console.error('Error fetching reviews:', error.message);
              return { ...product, averageRating: 0 };
            }
          })
        );
        setProducts(productsWithRatings);
        setFilteredProducts(productsWithRatings);
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get('/categories');
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching categories:', error.message);
      }
    };

    const fetchSearchHistory = async () => {
      try {
        const res = await axiosInstance.get('/search-history');
        setSearchHistory(res.data);
      } catch (error) {
        console.error('Error fetching search history:', error.message);
      }
    };

    fetchProducts();
    fetchCategories();
    fetchSearchHistory();
  }, []);

  const handleSearch = async () => {
    try {
      if (searchTerm.trim()) {
        await axiosInstance.post('/search-history', { searchTerm });

        const keywords = searchTerm.toLowerCase().split(' ');
        const results = products.filter(product => {
          const searchLower = searchTerm.toLowerCase();
          const descriptionMatch = keywords.every(keyword =>
            product.description.toLowerCase().includes(keyword)
          );

          return (
            product.name.toLowerCase().includes(searchLower) ||
            descriptionMatch ||
            product.price.toString().includes(searchTerm)
          );
        });

        setFilteredProducts(results);
      } else {
        setFilteredProducts(products);
      }
    } catch (error) {
      console.error('Error during search:', error.message);
    }
  };

  useEffect(() => {
    try {
      let results = [...products];

      if (selectedCategory) {
        results = results.filter(product =>
          product.category?.name.toLowerCase() === selectedCategory.toLowerCase()
        );
      }

      if (sortOption === 'price-asc') {
        results.sort((a, b) => a.price - b.price);
      } else if (sortOption === 'price-desc') {
        results.sort((a, b) => b.price - a.price);
      } else if (sortOption === 'rating-asc') {
        results.sort((a, b) => a.averageRating - b.averageRating);
      } else if (sortOption === 'rating-desc') {
        results.sort((a, b) => b.averageRating - a.averageRating);
      }

      setFilteredProducts(results);
    } catch (error) {
      console.error('Error processing products:', error.message);
    }
  }, [products, selectedCategory, sortOption]);

  const handleClearSearchHistory = async () => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to clear all search history?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, clear it!',
      });

      if (result.isConfirmed) {
        await axiosInstance.delete('/search-history');
        setSearchHistory([]);
        Swal.fire('Cleared!', 'Your search history has been cleared.', 'success');
      }
    } catch (error) {
      console.error('Error clearing search history:', error.message);
      Swal.fire('Error!', 'There was an error clearing your search history.', 'error');
    }
  };

  const handleDeleteSearchHistory = async (id) => {
    try {
      await axiosInstance.delete(`/search-history/${id}`);
      setSearchHistory(searchHistory.filter(history => history._id !== id));
      Swal.fire('Deleted!', 'Search history has been deleted.', 'success');
    } catch (error) {
      console.error('Error deleting search history:', error.message);
      Swal.fire('Error!', 'There was an error deleting your search history.', 'error');
    }
  };

  const handleProductClick = (id) => {
    navigate(`/product-details/${id}`);
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <>
      <h1 className="text-4xl font-extrabold text-center my-6 text-gray-800">Our Products</h1>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowHistory(true)}
              onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            />
            {showHistory && searchHistory.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10">
                <ul>
                  {searchHistory.map(item => (
                    <li
                      key={item._id}
                      className="flex justify-between items-center p-3 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSearchTerm(item.searchTerm);
                        handleSearch();
                      }}
                    >
                      <span>{item.searchTerm}</span>
                      <AiOutlineDelete
                        className="text-red-500 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSearchHistory(item._id);
                        }}
                      />
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full p-3 bg-red-500 text-white rounded-b-lg mt-2"
                  onClick={handleClearSearchHistory}
                >
                  Clear Searches
                </button>
              </div>
            )}
          </div>
          <button
            className="w-full sm:w-1/4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={handleSearch}
          >
            Search
          </button>
          <select
            className="w-full sm:w-1/4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category._id} value={category.name}>{category.name}</option>
            ))}
          </select>
          <select
            className="w-full sm:w-1/4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-asc">Rating: Low to High</option>
            <option value="rating-desc">Rating: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div
                key={product._id}
                className={`border ${
                  product.stock > 0 ? 'border-green-500' : 'border-red-500'
                } rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300`}
                onClick={() => handleProductClick(product._id)}
              >
                <Carousel showThumbs={false} infiniteLoop={true} autoPlay={true}>
                  {product.images.map((image, index) => (
                    <div key={index}>
                      <img
                        src={image}
                        alt={product.name}
                        className="object-cover w-full h-48"
                      />
                    </div>
                  ))}
                </Carousel>
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2 text-gray-800">{product.name}</h2>
                  <p className="text-gray-600 mb-2">
                    {truncateText(product.description, 100)}
                  </p>
                  <div className="flex items-center mb-2">
                    <span className="text-lg font-semibold text-gray-800">${product.price}</span>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < product.averageRating ? (
                          <AiFillStar className="text-yellow-500" />
                        ) : (
                          <AiOutlineStar className="text-gray-400" />
                        )}
                      </span>
                    ))}
                    <span className="ml-2 text-gray-600">({product.averageRating.toFixed(1)})</span>
                  </div>
<div className='flex items-center space-x-1'>
                  <span className="mr-2">Colors:</span>
  {product.colors.map((color, index) => {
    // Clean up the color value
    const cleanedColor = color.replace(/[\[\]"]/g, '').trim();

    // Ensure color is a valid hex or named color
    if (/^#[0-9A-F]{6}$/i.test(cleanedColor) || /^[a-zA-Z]+$/.test(cleanedColor)) {
      return (
        <FaCircle
          key={index}
          className="w-4 h-4 mr-1"
          style={{ color: cleanedColor }}
          title={cleanedColor} // Optional: Show color code on hover
        />
      );
    } else {
      return null; // Skip invalid color values
    }
  })}
</div>

                  <div className="flex items-center mt-2">
                    {product.stock > 0 ? (
                      <span className="flex items-center text-green-500">
                        <FaCircle className="mr-1 text-xs" />
                        In Stock
                      </span>
                    ) : (
                      <span className="flex items-center text-red-500">
                        <FaCircle className="mr-1 text-xs" />
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">No products found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;
