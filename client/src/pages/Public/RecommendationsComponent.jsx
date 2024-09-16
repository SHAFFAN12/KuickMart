import React, { useEffect, useState } from 'react';
import axiosInstance from '../../publicaxios'; // Adjust import based on your project structure
import { Carousel } from 'react-responsive-carousel';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { FaCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Recommendations = ({ userId }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axiosInstance.get(`/recommendations`);
        const recommendationData = response.data;

        // Fetch product details for each recommended item
        const productDetailsPromises = recommendationData.map(async (rec) => {
          const productResponse = await axiosInstance.get(`/products/${rec.itemId}`);
          return productResponse.data;
        });

        const productsDetails = await Promise.all(productDetailsPromises);
        setProducts(productsDetails);

      } catch (error) {
        console.error('Error fetching recommendations:', error.message);
        Swal.fire('Error!', 'There was an error fetching recommendations.', 'error');
      }
    };

    if (userId) {
      fetchRecommendations();
    }
  }, [userId]);

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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <h1 className="text-4xl font-extrabold text-center my-6 text-gray-800">Recommended for You</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.itemId}
              className={`border ${
                product.stock > 0 ? 'border-green-500' : 'border-red-500'
              } rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300`}
              onClick={() => handleProductClick(product.itemId)}
            >
              <Carousel showThumbs={false} infiniteLoop={true} autoPlay={true}>
                {product.images && product.images.map((image, index) => (
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
                  {truncateText(product.description || '', 100)}
                </p>
                <div className="flex items-center mb-2">
                  <span className="text-lg font-semibold text-gray-800">${product.price || '0.00'}</span>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < (product.averageRating || 0) ? (
                        <AiFillStar className="text-yellow-500" />
                      ) : (
                        <AiOutlineStar className="text-gray-400" />
                      )}
                    </span>
                  ))}
                  <span className="ml-2 text-gray-600">
                    {(product.averageRating ? product.averageRating.toFixed(1) : '0.0')}
                  </span>
                </div>
                <div className='flex items-center space-x-1'>
                  <span className="mr-2">Colors:</span>
                  {product.colors && product.colors.map((color, index) => {
                    const cleanedColor = color.replace(/[\[\]"]/g, '').trim();
                    if (/^#[0-9A-F]{6}$/i.test(cleanedColor) || /^[a-zA-Z]+$/.test(cleanedColor)) {
                      return (
                        <FaCircle
                          key={index}
                          className="w-4 h-4 mr-1"
                          style={{ color: cleanedColor }}
                          title={cleanedColor}
                        />
                      );
                    } else {
                      return null;
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
          <p className="text-center text-gray-600 col-span-full">No recommendations available.</p>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
