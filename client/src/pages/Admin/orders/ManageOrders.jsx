import React, { useEffect, useState } from 'react';
import {
  FaInfoCircle, FaCheck, FaTimes, FaPrint, FaDollarSign, FaSearch, FaSort, FaFilter, FaSpinner
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { getOrders, deleteOrder, updateOrder } from './api'; // Adjust the import path as needed
import ReactPaginate from 'react-paginate';

const MySwal = withReactContent(Swal);

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const ordersPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
   
    
  }, []);

  const filteredOrders = orders
  .filter(order => {
  const userName = order.user?.name || ''; // Default to empty string if user or name is undefined
  const orderId = order._id || ''; // Default to empty string if _id is undefined
  const searchTermLower = searchTerm.toLowerCase();

  return (
    userName.toLowerCase().includes(searchTermLower) ||
    orderId.toLowerCase().includes(searchTermLower)
  );
})
    .sort((a, b) => {
      if (sortBy === 'price') return b.totalPrice - a.totalPrice;
      if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  const pageCount = Math.ceil(filteredOrders.length / ordersPerPage);
  const displayedOrders = filteredOrders.slice(
    currentPage * ordersPerPage,
    (currentPage + 1) * ordersPerPage
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const handleFilterChange = (newFilter) => {
    setFilterStatus(newFilter);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSelectOrder = (order) => {
    MySwal.fire({
      title: 'Order Details',
      html: (
        <div>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>User:</strong> {order.user?.name || 'Unknown'}</p>
          <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          <p><strong>Phone No:</strong> {order.phoneNumber}</p>
          <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>
          <p><strong>Status:</strong> {order.isDelivered ? 'Delivered' : 'Pending'}</p>
          <h4 className="text-lg font-semibold mt-4">Order Items</h4>
          <ul>
            {order.orderItems.map(item => (
              <li key={item._id}>{item.name} - {item.qty} x ${item.price.toFixed(2)}</li>
            ))}
          </ul>
        </div>
      ),
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: 'Close',
      customClass: {
        popup: 'bg-white shadow-lg rounded-lg p-4',
        title: 'text-2xl font-semibold',
        content: 'text-base',
        confirmButton: 'bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mx-2',
        cancelButton: 'bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 mx-2',
        footer: 'flex flex-wrap justify-around gap-2 mt-4'
      },
      footer: (
        <div className="flex flex-wrap justify-around gap-2">
          <button
            onClick={() => handleUpdateStatus(order._id, !order.isDelivered)}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center"
          >
            <FaCheck className="mr-2" /> {order.isDelivered ? 'Mark as Pending' : 'Mark as Delivered'}
          </button>
          <button
            onClick={() => handleUpdatePaidStatus(order._id, !order.isPaid)}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center"
          >
            <FaDollarSign className="mr-2" /> {order.isPaid ? 'Mark as Unpaid' : 'Mark as Paid'}
          </button>
          <button
            onClick={() => handleDeleteOrder(order._id)}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 flex items-center"
          >
            <FaTimes className="mr-2" /> Delete
          </button>
          <button
            onClick={() => handlePrintShippingLabel(order)}
            className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 flex items-center"
          >
            <FaPrint className="mr-2" /> Print Label
          </button>
        </div>
      )
    });
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const updatedOrder = await updateOrder(id, { isDelivered: newStatus });
      setOrders(orders.map(order => order._id === id ? updatedOrder : order));
      MySwal.fire('Success', 'Order status updated', 'success');
    } catch (error) {
      setError('Failed to update order status');
    }
  };

  const handleUpdatePaidStatus = async (id, newStatus) => {
    try {
      const updatedOrder = await updateOrder(id, { isPaid: newStatus });
      setOrders(orders.map(order => order._id === id ? updatedOrder : order));
      MySwal.fire('Success', 'Order payment status updated', 'success');
    } catch (error) {
      setError('Failed to update payment status');
    }
  };

  const handleDeleteOrder = (id) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600',
        cancelButton: 'bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with deletion
        deleteOrderById(id);
      }
    });
  };
  
  const deleteOrderById = async (id) => {
    try {
      await deleteOrder(id);
      setOrders(orders.filter(order => order._id !== id));
      MySwal.fire('Deleted!', 'Order has been deleted.', 'success');
    } catch (error) {
      setError('Failed to delete order');
    }
  };
  

  const handlePrintShippingLabel = (order) => {
    const labelData = `
      Shipping Label:
      -------------------
      Order ID: ${order._id}
      Name: ${order.user?.name || 'Unknown'}
      Address: ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}
      Total Price: $${order.totalPrice.toFixed(2)}
    `;
    console.log(labelData);
    MySwal.fire('Print Label', 'Check console for label data', 'info');
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <FaSpinner className="animate-spin text-4xl text-blue-500" />
    </div>
  );

  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">Manage Orders</h2>
      <div className="flex justify-between mb-4">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="py-2 px-4 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="py-2 px-4 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="date">Sort by Date</option>
            <option value="price">Sort by Price</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="py-2 px-4 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="all">Filter: All</option>
            <option value="delivered">Filter: Delivered</option>
            <option value="pending">Filter: Pending</option>
          </select>
        </div>
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center">
          <FaFilter className="mr-2" /> Filter
        </button>
      </div>
      <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Image</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {displayedOrders.map((order) => (
        <tr key={order._id}>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {/* Map through orderItems to display each image */}
            <div className="flex flex-col  space-y-2">
              {order.orderItems.map((item, index) => (
                <img key={index} src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm" />
              ))}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.user?.name || 'Unknown'}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.phoneNumber}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${order.totalPrice.toFixed(2)}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            {order.isDelivered ? (
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">Delivered</span>
            ) : (
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">Pending</span>
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <button
              onClick={() => handleSelectOrder(order)}
              className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
            >
              <FaInfoCircle className="text-base" /> <span className="font-medium">Details</span>
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={"pagination flex justify-center items-center space-x-4 mt-4"}
        previousLinkClassName={"bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"}
        nextLinkClassName={"bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"}
        disabledClassName={"bg-gray-300 text-gray-500 py-2 px-4 rounded"}
        activeClassName={"bg-blue-700 text-white py-2 px-4 rounded"}
      />
    </div>
  );
};

export default ManageOrders;
