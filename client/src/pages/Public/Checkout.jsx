import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../publicaxios';
import { createOrder } from './redux/actions/orderActions';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import CustomerRewards from './Reward';

const MySwal = withReactContent(Swal);

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const [user, setUser] = useState(null);
  const [discount, setDiscount] = useState(0);

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserDetails(token);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchUserDetails = async (token) => {
    try {
      const { data } = await axiosInstance.get('/auth/getuser', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user details', error);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!address || !city || !postalCode || !country || !phoneNumber) {
      return MySwal.fire({
        title: 'Missing Information',
        text: 'Please fill in all required fields.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }

    if (cartItems.length === 0) {
      return MySwal.fire({
        title: 'Empty Cart',
        text: 'Your cart is empty. Add items before placing an order.',
        icon: 'info',
        confirmButtonText: 'OK',
      });
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return MySwal.fire({
        title: 'Authentication Error',
        text: 'You must be logged in to place an order.',
        icon: 'error',
        confirmButtonText: 'OK',
      }).then(() => navigate('/login'));
    }

    const orderData = {
      orderItems: cartItems,
      shippingAddress: { address, city, postalCode, country },
      phoneNumber,
      paymentMethod: 'COD',
      itemsPrice: calculateItemsPrice(),
      taxPrice: calculateTaxPrice(),
      shippingPrice: calculateShippingPrice(),
      totalPrice: calculateTotalPrice(),
    };
    console.log('orderData:', orderData);

    try {
      await dispatch(createOrder(orderData));
      MySwal.fire({
        title: 'Order Confirmed!',
        text: 'Your order has been placed successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => navigate('/order-history'));
    } catch (error) {
      console.error('Order placement error:', error);
      MySwal.fire({
        title: 'Order Failed',
        text: 'There was an issue placing your order. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const calculateItemsPrice = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  };
  const calculateTaxPrice = () => {
    return calculateItemsPrice() * 0.1;
  };

  const calculateShippingPrice = () => {
    return calculateItemsPrice() * 0.1; // Simplified shipping price logic
  };

  const calculateTotalPrice = () => {
    const total = calculateItemsPrice() + calculateTaxPrice() + calculateShippingPrice() - discount;
    return total > 0 ? total : 0;
  };

  const handlePointsRedeemed = (discountAmount) => {
    setDiscount(discountAmount);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 lg:p-12">
      <h1 className="text-3xl font-bold mb-6 flex items-center space-x-2">
        <FaShoppingCart size={32} />
        <span>Checkout</span>
      </h1>

      {/* Customer Rewards Section */}
      <CustomerRewards onPointsRedeemed={handlePointsRedeemed} />

      {/* Checkout Form */}
      <form onSubmit={handlePlaceOrder} className="bg-white shadow-md rounded-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Postal Code</label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Items Price:</span>
              <span>${calculateItemsPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${calculateTaxPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>${calculateShippingPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Discount:</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-xl">
              <span>Total:</span>
              <span>${calculateTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <div className="mt-6 text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
