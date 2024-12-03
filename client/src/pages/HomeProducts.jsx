//  import React, { useEffect, useState } from 'react';
//  import { useNavigate } from 'react-router-dom';
//  import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
//  import { FaCircle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
//  import axiosInstance from '../publicaxios';

// const HomeProduct = () => {
//   const [products, setProducts] = useState([]);
//   const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const res = await axiosInstance.get('/products');
  //       const limitedProducts = res.data.sort(() => 0.5 - Math.random()).slice(0, 8);
  //       const productsWithRatings = await Promise.all(
  //         limitedProducts.map(async (product) => {
  //           try {
  //             const reviewRes = await axiosInstance.get(`/reviews/${product._id}`);
  //             const reviews = reviewRes.data;
  //             const averageRating = reviews.length > 0
  //               ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  //               : 0;
  //             return { ...product, averageRating };
  //           } catch (error) {
  //             console.error('Error fetching reviews:', error.message);
  //             return { ...product, averageRating: 0 };
  //           }
  //         })
  //       );
  //       setProducts(productsWithRatings);
  //     } catch (error) {
  //       console.error('Error fetching products:', error.message);
  //     }
  //   };

//     fetchProducts();
//   }, []);

//   const handleProductClick = (id) => {
//     navigate(`/product-details/${id}`);
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-3xl font-bold text-gray-800 my-8 text-center">
//         Today's Gadgets & Accessories
//       </h1>
//       <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4">
//         {products.length > 0 ? (
//           products.map((product) => (
            
            
//             <div
//               key={product._id}
//               className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl hover:border-indigo-400 transition-transform transform hover:scale-105"
//             >
//               <div className="relative group">
//                 <img
//                   src={product.images[0]}
//                   alt={product.name}
//                   className="w-full h-56 object-cover"
//                 />
//                 <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
//                   <span className="text-white font-bold text-lg">{product.name}</span>
//                 </div>
//               </div>
//               <div className="p-4">
//                 <h3 className="text-lg font-semibold text-gray-800 truncate">
//                   {product.name}
//                 </h3>
//                 <p className="text-sm text-gray-600 truncate">{product.description}</p>
//                 <div className="flex items-center mt-3">
//                   <div className="flex items-center text-yellow-500">
//                     {[...Array(5)].map((_, i) =>
//                       i < Math.floor(product.averageRating) ? (
//                         <AiFillStar key={i} />
//                       ) : (
//                         <AiOutlineStar key={i} />
//                       )
//                     )}
//                   </div>
//                   <span className="ml-2 text-gray-700 text-sm">
//                     {product.averageRating.toFixed(1)}
//                   </span>
//                 </div>
//                 <div className="mt-4 flex justify-between items-center">
//                   <span className="text-xl font-bold text-indigo-600">
//                     ${product.price.toFixed(2)}
//                   </span>
//                   <div className="flex items-center">
//                     <span className="mr-2 text-sm text-gray-600">Colors:</span>
//                     {product.colors.map((color, index) => {
//                       const cleanedColor = color.replace(/[\[\]"]/g, '').trim();
//                       if (/^#[0-9A-F]{6}$/i.test(cleanedColor) || /^[a-zA-Z]+$/.test(cleanedColor)) {
//                         return (
//                           <FaCircle
//                             key={index}
//                             className="w-5 h-5 mr-1"
//                             style={{ color: cleanedColor }}
//                           />
//                         );
//                       } else {
//                         return null;
//                       }
//                     })}
//                   </div>
//                 </div>
//                 <div className="flex items-center mt-3">
//                   {product.stock > 0 ? (
//                     <span className="text-green-500 flex items-center">
//                       <FaCheckCircle className="mr-1" /> In Stock
//                     </span>
//                   ) : (
//                     <span className="text-red-500 flex items-center">
//                       <FaTimesCircle className="mr-1" /> Out of Stock
//                     </span>
//                   )}
//                 </div>
//                 <button
//                   className="w-full mt-4 py-2 text-white font-semibold rounded bg-blue-500 hover:from-purple-500 hover:to-indigo-500 transition"
//                   onClick={() => handleProductClick(product._id)}
//                 >
//                   View Details
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="col-span-full text-center text-gray-500">
//             No products found
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HomeProduct;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../publicaxios";
import { FaCircle, FaCheckCircle, FaTimesCircle, FaStar } from "react-icons/fa";
import { BsArrowsFullscreen } from "react-icons/bs";

const HomeProduct = () => {
  const [products, setProducts] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false); // To prevent button clicks during transition

  const navigate = useNavigate();


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get('/products');
        const limitedProducts = res.data.sort(() => 0.5 - Math.random()).slice(0, 8);
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

  const handleProductClick = (id) => {
    navigate(`/product-details/${id}`);
  };

  const handleNext = () => {
    setStartIndex((prevIndex) => Math.min(prevIndex + 1, products.length - 4));
  };

  const handlePrev = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  useEffect(() => {
    if (isAnimating) {
      setTimeout(() => {
        setIsAnimating(false);
      }, 200);
    }
  }, [isAnimating]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 text-left">
          Today's Gadgets & Accessories
        </h1>
        <div>
          <button
            className="bg-gray-200 p-2 rounded-full mr-2 hover:bg-gray-300"
            onClick={handlePrev}
            disabled={startIndex === 0}
          >
            Prev
          </button>
          <button
            className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
            onClick={handleNext}
            disabled={startIndex >= products.length - 1}
          >
            Next
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 cursor-pointer transition-transform  ease-in-out">
        {products.length > 0 ? (
          products.slice(startIndex, startIndex + 4).map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-md p-4">
              <div className="relative group bg-[#F8FAFC] cursor-pointer rounded-xl">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="rounded-xl w-full h-56 object-cover"
                />
                {/* Quick View Button */}
                <button
                  className="absolute bottom-2 left-1/2 w-[150px] transform -translate-x-1/2 font-semibold text-sm bg-white text-black p-1 px-4 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:translate-y-[-8px] inline-flex items-center justify-center"
                  onClick={() => handleProductClick(product._id)}
                >
                  <BsArrowsFullscreen className="inline mr-2 text-sm" /> Quick View
                </button>
              </div>

              <div className="mt-4">
                <h2 className="text-lg font-semibold truncate">{product.name}</h2>

                {/* Colors Section */}
                <div className="flex gap-2 mt-2 min-h-[24px]">
                  {product.colors.map((color, index) => {
                    const cleanedColor = color.replace(/[\[\]"]/g, "").trim();
                    if (/^#[0-9A-F]{6}$/i.test(cleanedColor) || /^[a-zA-Z]+$/.test(cleanedColor)) {
                      return (
                        <div
                          key={index}
                          className="w-6 h-6 flex items-center justify-center p-1 rounded-full"
                          style={{ border: `2px solid ${cleanedColor}` }} // Set border color to match the color
                        >
                          <FaCircle className="w-4 h-4" style={{ color: cleanedColor }} />
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>

                {/* Stock Status */}
                <div className="mt-2">
                  {product.stock > 0 ? (
                    <span className="text-green-600 flex items-center font-bold">
                      <FaCheckCircle className="mr-1" /> In Stock
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center">
                      <FaTimesCircle className="mr-1" /> Out of Stock
                    </span>
                  )}
                </div>

                {/* Price and Ratings */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-base font-bold border border-green-600 text-green-600 px-2 rounded">
                    Rs {product.price}
                  </span>
                  <span className="flex items-center gap-1 text-[18px] text-yellow-500 mr-2">
                    <FaStar /> {product.averageRating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center w-full">No products available</p>
        )}
      </div>
    </div>
  );
};

export default HomeProduct;
