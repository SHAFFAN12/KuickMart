import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaInfoCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token'); // Retrieve token

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders/history', {
          headers: {
            Authorization: `${token}`, // Ensure Bearer token format
          },
        });
        setOrders(response.data);
      } catch (err) {
        setError('Failed to load orders');
        console.error('Error fetching orders:', err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    } else {
      setError('No token found');
      setLoading(false);
    }
  }, [token]);

  const showLogisticDetails = (order) => {
    Swal.fire({
      title: 'Logistic Details',
      html: `
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Paid:</strong> ${order.isPaid ? 'Yes' : 'No'}</p>
        <p><strong>Delivered:</strong> ${order.isDelivered ? 'Yes' : 'No'}</p>
        <p><strong>Total Price:</strong> $${order.totalPrice.toFixed(2)}</p>
      `,
      icon: 'info',
    });
  };

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center mt-4 text-red-600">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-extrabold text-center my-6 text-gray-800">Order History</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {orders.length > 0 ? (
          orders.map((order) => {
            let borderColor = 'border-red-500'; // Default to red
            if (order.isPaid && order.isDelivered) {
              borderColor = 'border-green-500';
            } else if (order.isPaid) {
              borderColor = 'border-yellow-500';
            } else if (order.isDelivered) {
              borderColor = 'border-orange-500';
            }

            return (
              <div key={order._id} className={`bg-white p-6 rounded-lg shadow-lg border-4 ${borderColor}`}>
                <h2 className="text-xl font-semibold text-gray-800">Order ID: {order._id}</h2>
                <p className="text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-600">Total: ${order.totalPrice.toFixed(2)}</p>
                <ul className="mt-4 space-y-2">
                  {order.orderItems.map((item) => (
                    <li key={item._id} className="flex items-center py-2 border-b border-gray-200">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded mr-4" />
                      <div className="flex-1">
                        <span className="text-gray-700">{item.name}</span>
                        <span className="block text-gray-600 text-sm">${item.price.toFixed(2)} x {item.qty}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => showLogisticDetails(order)}
                  className="mt-4 flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-200"
                >
                  <FaInfoCircle className="mr-2" /> Logistic Details
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-600">No orders found</p>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
