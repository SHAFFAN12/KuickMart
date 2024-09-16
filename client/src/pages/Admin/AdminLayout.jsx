import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { adminLogout } from './redux/actions/authActions'; // Adjust the import path if needed
import { FaTachometerAlt, FaBox, FaUsers, FaTags, FaGift, FaBars, FaSignOutAlt, FaThList } from 'react-icons/fa';
import axiosInstance from '../../adminaxios';
import Swal from 'sweetalert2';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Update with your server address

const getAdmin = async () => {
  try {
    const { data } = await axiosInstance.get('/auth/admin/getadmin');
    return data;
  } catch (error) {
    console.error('Failed to fetch admin details:', error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Failed to fetch admin details!',
    });
  }
};

const AdminSidebar = ({ isOpen, onClose }) => {
  return (
    <aside
      className={`admin-sidebar bg-blue-800 text-white h-full lg:w-64 lg:block fixed lg:relative transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      <button
        className="lg:hidden p-2 text-white bg-blue-700 hover:bg-blue-600 focus:outline-none absolute top-4 right-4"
        onClick={onClose}
      >
        <FaBars className="text-xl" />
      </button>
      <nav className="p-4">
        <ul>
          <li className="py-2">
            <Link to="/admin/dashboard" className="flex items-center hover:bg-blue-700 p-2 rounded transition duration-300">
              <FaTachometerAlt className="mr-3" /> Dashboard
            </Link>
          </li>
          <li className="py-2">
            <Link to="/admin/products" className="flex items-center hover:bg-blue-700 p-2 rounded transition duration-300">
              <FaBox className="mr-3" /> Manage Products
            </Link>
          </li>
          <li className="py-2">
            <Link to="/admin/orders" className="flex items-center hover:bg-blue-700 p-2 rounded transition duration-300">
              <FaBox className="mr-3" /> Manage Orders
            </Link>
          </li>
          <li className="py-2">
            <Link to="/admin/users" className="flex items-center hover:bg-blue-700 p-2 rounded transition duration-300">
              <FaUsers className="mr-3" /> Manage Users
            </Link>
          </li>
          <li className="py-2">
            <Link to="/admin/promotions" className="flex items-center hover:bg-blue-700 p-2 rounded transition duration-300">
              <FaTags className="mr-3" /> Manage Promotions
            </Link>
          </li>
          <li className="py-2">
            <Link to="/admin/rewards" className="flex items-center hover:bg-blue-700 p-2 rounded transition duration-300">
              <FaGift className="mr-3" /> Manage Rewards
            </Link>
          </li>
          <li className="py-2">
            <Link to="/admin/categories" className="flex items-center hover:bg-blue-700 p-2 rounded transition duration-300">
              <FaThList className="mr-3" /> Manage Categories
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

const AdminHeader = ({ onToggleSidebar, onLogout, adminName, adminEmail }) => {
  return (
    <header className="admin-header bg-blue-900 text-white p-4 flex justify-between items-center shadow-md lg:shadow-none">
      <button
        className="lg:hidden p-2 rounded bg-blue-800 hover:bg-blue-700 focus:outline-none"
        onClick={onToggleSidebar}
      >
        <FaBars className="text-xl" />
      </button>
      <div className='text-center '>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        {adminName && <p className="text-sm">{adminName} <br />({adminEmail})</p>}
      </div>
      <button
        className="p-2 rounded bg-red-600 hover:bg-red-500 focus:outline-none"
        onClick={onLogout}
      >
        <FaSignOutAlt className="text-xl" />
      </button>
    </header>
  );
};

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminDetails = async () => {
      const admin = await getAdmin();
      if (admin) {
        setAdminName(admin.name);
        setAdminEmail(admin.email);
      }
    };

    fetchAdminDetails();

    socket.on('receiveNotification', (notification) => {
      Swal.fire({
        title: 'New Notification',
        text: notification.message,
        icon: 'info',
      });
    });

    return () => {
      socket.off('receiveNotification');
    };
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(adminLogout());
        navigate('/admin/auth'); // Redirect to login page after logout
      }
    });
  };

  return (
    <div className="admin-layout h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AdminHeader onToggleSidebar={handleToggleSidebar} onLogout={handleLogout} adminName={adminName} adminEmail={adminEmail} />

        {/* Main Content */}
        <main className="flex-1 p-6 bg-white shadow-md rounded-md m-4 lg:m-0 lg:ml-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
