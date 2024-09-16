import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { Carousel } from 'react-responsive-carousel';
import Swal from 'sweetalert2';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useDispatch } from 'react-redux';
import { addToCart } from './redux/actions/cartActions';
import axiosInstance from '../../publicaxios';
import { FaCircle } from 'react-icons/fa';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const dispatch = useDispatch();

  const trackProductInteraction = async (action) => {
    try {
      await axiosInstance.post('/user-interaction', {
        productId,
        action,
      });
    } catch (error) {
      console.error(`Error tracking ${action} interaction:`, error.message);
    }
  };

  const fetchProductDetails = async () => {
    try {
      const productRes = await axiosInstance.get(`/products/${productId}`);
      setProduct(productRes.data);

      const reviewsRes = await axiosInstance.get(`/reviews/${productId}`);
      setReviews(reviewsRes.data);

      await trackProductInteraction('view');
    } catch (error) {
      console.error('Error fetching product details:', error.message);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (product) {
      if (token) {
        dispatch(addToCart(product._id, quantity, selectedColor));
        Swal.fire({
          icon: 'success',
          title: 'Added to Cart',
          text: `${product.name} has been added to your cart.`,
          confirmButtonColor: '#3085d6',
        });

        await trackProductInteraction('add_to_cart');
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Login Required',
          text: 'Please log in to add products to your cart.',
          confirmButtonColor: '#3085d6',
        });
      }
    }
  };

  const handleReviewSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please log in to submit a review.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    try {
      await axiosInstance.post(`/reviews/${productId}`, newReview);
      Swal.fire({
        icon: 'success',
        title: 'Review Submitted',
        text: 'Your review has been submitted successfully.',
        confirmButtonColor: '#3085d6',
      });
      setNewReview({ rating: 0, comment: '' });

      const res = await axiosInstance.get(`/reviews/${productId}`);
      setReviews(res.data);
    } catch (error) {
      console.error('Error submitting review:', error.message);
    }
  };

  if (!product) {
    return <div className="text-center text-lg">Loading...</div>;
  }

    const youtubeEmbedUrl = product.video_url ? product.video_url.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/') : '';

  
  return (
    <div className="container mx-auto p-5 md:p-10">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-5 text-center">Product Details</h1>
      <div className="bg-gray-100 p-5 md:p-10 rounded-2xl shadow-xl">
        {product.images && product.images.length > 0 ? (
          <Carousel
            showArrows={true}
            autoPlay={true}
            infiniteLoop={true}
            showThumbs={false}
            className="mb-4"
          >
            {product.images.map((src, index) => (
              <div key={index}>
                <img
                  src={src}
                  alt={`Product ${index + 1}`}
                  className="w-full h-auto object-cover rounded-md"
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <img
            src={product.image}
            alt="Product"
            className="w-full h-auto object-cover rounded-md mb-4"
          />
        )}

        <p className="text-lg md:text-xl lg:text-2xl font-semibold mb-2">
          Name: {product.name}
        </p>
        <p className="text-lg md:text-xl lg:text-2xl font-semibold mb-2">
          Price: ${product.price}
        </p>
        <p className="text-md md:text-lg lg:text-xl mb-4">
          Description: {product.description}
        </p>

        {product.video ? (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Product Video</h2>
            <video
              src={product.video}
              controls
              className="w-full h-auto rounded-lg shadow-md"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="bg-gray-200 p-4 rounded-lg mb-4">
            <h2 className="text-lg font-semibold mb-2">Product Video</h2>
            <p>No video available for this product.</p>
          </div>
        )}
    {youtubeEmbedUrl ?(
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Product Video</h2>
            <iframe
              width="100%"
              height="315"
              src={`${youtubeEmbedUrl}`}
              title="Product Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-md"
            ></iframe>
          </div>
) : (
  <div className="bg-gray-200 p-4 rounded-lg mb-4">
    <h2 className="text-lg font-semibold mb-2">Product Video</h2>
    <p>No video available for this product.</p>
  </div>
)}
        <div className="flex items-center mt-2 mb-4">
          <Rating rating={product.averageRating || 0} />
          <span className="ml-2 text-md font-semibold">
            ({product.numReviews} reviews)
          </span>
        </div>
            <div className="flex items-center">
      <span className="mr-2">Colors:</span>
      {product.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <p className="text-lg font-semibold mb-2">Choose Color:</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, index) => (
                    
    
                  
                    <FaCircle
                      key={index}
                      color={ color.replace(/[\[\]"]/g, '').trim()}
                      size={24}
                      className={`cursor-pointer ${selectedColor === color ? 'border-2 border-black' : ''}`}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
            )}</div>
        <div className="flex items-center mb-4">
          <label className="mr-2 text-lg font-semibold">Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            max={product.countInStock}
            className="w-20 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          className="w-full md:w-auto bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-5">Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="mb-4 p-4 border border-gray-300 rounded-lg shadow-md">
              <div className="flex items-center mb-2">
                <Rating rating={review.rating} />
                <span className="ml-2 font-semibold text-lg">{review.user.name}</span>
              </div>
              <p className="text-md mb-2">{review.comment}</p>
              <small className="text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-5">Add a Review</h2>
        <div className="mb-4">
          <label className="block mb-2 text-lg font-semibold">Rating:</label>
          <select
            value={newReview.rating}
            onChange={(e) =>
              setNewReview({ ...newReview, rating: Number(e.target.value) })
            }
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="0">Select Rating</option>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star} Star{star > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-lg font-semibold">Comment:</label>
          <textarea
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          onClick={handleReviewSubmit}
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};

const Rating = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => (
    <span key={index} className="text-yellow-400">
      {rating > index ? <AiFillStar /> : <AiOutlineStar />}
    </span>
  ));

  return <div className="flex">{stars}</div>;
};

export default ProductDetails;
