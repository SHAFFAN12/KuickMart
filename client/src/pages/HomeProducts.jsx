import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { FaCircle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Icons for status
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Carousel styles
import axiosInstance from '../publicaxios';

const HomeProduct = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch a limited number of products randomly
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get('/products');
        const limitedProducts = res.data.sort(() => 0.5 - Math.random()).slice(0, 8); // Randomize and limit to 8 products
        const productsWithRatings = await Promise.all(
          limitedProducts.map(async (product) => {
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
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };

    fetchProducts();
  }, []);

  // Navigate to the product details page
  const handleProductClick = (id) => {
    navigate(`/product-details/${id}`);
  };

  return (
    <>
      <h1 className="text-2xl font-medium text-start my-6 text-gray-800">Today Gadgets & Accessories</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {/* Product Grid */}
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="border border-gray-300 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
              onClick={() => handleProductClick(product._id)}
            >
              <Carousel showThumbs={false} autoPlay infiniteLoop>
                {product.images.map((image, index) => (
                  <div key={index}>
                    <img src={image} alt={product.name} className="w-full h-64 object-cover" />
                  </div>
                ))}
              </Carousel>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                <p className="text-gray-600 truncate">{product.description}</p>
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
                  <span className="ml-2 text-gray-700">{product.averageRating.toFixed(1)}</span>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">${product.price.toFixed(2)}</span>
                  <div className="flex items-center">
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
                </div>
                  <div className="flex items-center my-2">
                    {product.stock > 0 ? (
                      <span className="flex items-center text-green-500">
                        <FaCheckCircle className="mr-1" /> In Stock
                      </span>
                    ) : (
                      <span className="flex items-center text-red-500">
                        <FaTimesCircle className="mr-1" /> Out of Stock
                      </span>
                    )}
                  </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No products found</p>
        )}
      </div>
    </>
  );
};

export default HomeProduct;
