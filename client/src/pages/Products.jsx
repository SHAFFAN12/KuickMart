import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiFillStar, AiOutlineStar, AiOutlineSearch } from 'react-icons/ai';
import { FaCircle } from 'react-icons/fa';
import axiosInstance from '../publicaxios';
import Swal from 'sweetalert2';
import queryString from 'query-string';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch products and their reviews
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
              return { ...product, reviews, averageRating };
            } catch (error) {
              console.error('Error fetching reviews:', error.message);
              return { ...product, reviews: [], averageRating: 0 };
            }
          })
        );
        setProducts(productsWithRatings);
        setFilteredProducts(productsWithRatings);
      } catch (error) {
        Swal.fire('Error', 'Error fetching products', 'error');
        console.error('Error fetching products:', error.message);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get('/categories');
        setCategories(res.data);
      } catch (error) {
        Swal.fire('Error', 'Error fetching categories', 'error');
        console.error('Error fetching categories:', error.message);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  // Handle search and filtering based on query parameters
  useEffect(() => {
    const { search = '', category = '', sort = '' } = queryString.parse(location.search);

    setSearchTerm(search);
    setSelectedCategory(category);
    setSortOption(sort);
  }, [location.search]);

  useEffect(() => {
    const handleSearch = () => {
      const keywords = searchTerm.toLowerCase().split(' ');
      const results = products.filter((product) => {
        const searchLower = searchTerm.toLowerCase();
        const descriptionMatch = keywords.every((keyword) =>
          product.description.toLowerCase().includes(keyword)
        );

        const categoryMatch = selectedCategory
          ? product.category?.name.toLowerCase() === selectedCategory.toLowerCase()
          : true;

        return (
          (product.name.toLowerCase().includes(searchLower) ||
            descriptionMatch ||
            product.price.toString().includes(searchTerm)) &&
          categoryMatch
        );
      });

      // Sort results based on the selected sort option
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
    };

    handleSearch();
  }, [searchTerm, selectedCategory, sortOption, products]);

  // Handle category selection and update query parameters
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSearchTerm(''); // Reset search term when a category is selected
    navigate(`?search=${searchTerm}&category=${category}&sort=${sortOption}`);
  };

  // Handle search input and update query parameters
  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    navigate(`?search=${searchValue}&category=${selectedCategory}&sort=${sortOption}`);
  };

  // Handle sort option change and update query parameters
  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    setSortOption(sortValue);
    navigate(`?search=${searchTerm}&category=${selectedCategory}&sort=${sortValue}`);
  };

  // Navigate to the product details page
  const handleProductClick = (id) => {
    navigate(`/product-details/${id}`);
  };

  return (
    <>
      <h1 className="text-4xl font-extrabold text-center my-6 text-gray-800">Our Products</h1>
      <div className="container mx-auto px-5 flex flex-col md:flex-row">
        {/* Sidebar for Categories */}
        <aside className="md:w-1/4 mb-6 md:mb-0">
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Categories</h2>
            <ul className="space-y-2">
              <li
                className={`cursor-pointer p-2 rounded-lg ${
                  selectedCategory === ''
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => handleCategoryClick('')}
              >
                All Categories
              </li>
              {categories.map((category) => (
                <li
                  key={category._id}
                  className={`cursor-pointer p-2 rounded-lg ${
                    selectedCategory === category.name
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  {category.name}
                </li>
              ))}
            </ul>
          </div>
        </aside>
        {/* Main Content */}
        <main className="md:w-3/4">
          <div className="flex flex-wrap justify-between mb-6">
            {/* Search Input */}
            <div className="relative w-full sm:w-3/4 mb-4 sm:mb-0 flex items-center">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <div className="bg-blue-500 p-3 rounded-r-lg text-white">
                <AiOutlineSearch />
              </div>
            </div>
            {/* Sort Option */}
            <select
              className="w-full sm:w-1/4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="">Sort by</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-asc">Rating: Low to High</option>
              <option value="rating-desc">Rating: High to Low</option>
            </select>
          </div>
          {/* Product Grid */}
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer"
                onClick={() => handleProductClick(product._id)}
              >
                <Carousel showThumbs={false} autoPlay infiniteLoop>
                  {product.images.length > 0 ? (
                    product.images.map((image, index) => (
                      <div key={index}>
                        <img src={image} alt={product.name} className="w-full h-64 object-cover" />
                      </div>
                    ))
                  ) : (
                    <div>No Images Available</div>
                  )}
                </Carousel>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                  <p className="text-gray-600 truncate ">{product.description}</p>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center text-yellow-500">
                      {[...Array(5)].map((_, i) =>
                        i < Math.floor(product.averageRating) ? (
                          <AiFillStar key={i} />
                        ) : (
                          <AiOutlineStar key={i} />
                        )
                      )}
                    </div>
                    <span className="ml-2 text-gray-600">({product.reviews.length})</span>
                  </div>
                  <div className="mt-4 text-gray-800 font-semibold text-lg">
                    ${product.price.toFixed(2)}
                  </div>
                  <div className="flex items-center">
                    {/* <span className="mr-2"></span> */}
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
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default Products;
