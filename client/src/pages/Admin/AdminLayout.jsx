import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { adminLogout } from './redux/actions/authActions';
import { FaUsers, FaTags, FaGift, FaBars, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { RiDashboardFill } from "react-icons/ri";
import { AiFillProduct } from "react-icons/ai";
import { HiShoppingBag } from "react-icons/hi";
import { FaGifts } from "react-icons/fa";

import axiosInstance from '../../adminaxios';
import Swal from 'sweetalert2';
import io from 'socket.io-client';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const { data } = await axiosInstance.get('/auth/admin/getadmin');
        setAdminName(data.name);
        setAdminEmail(data.email);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to fetch admin details!',
        });
      }
    };

    fetchAdminDetails();

    const socket = io('http://localhost:5000'); // Socket initialized here
    socket.on('receiveNotification', (notification) => {
      Swal.fire({
        title: 'New Notification',
        text: notification.message,
        icon: 'info',
      });
    });

    return () => {
      socket.disconnect(); // Clean up the socket connection
    };
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleLogout = () => {
    Swal.fire({
      title: '<span style="color:#0858f7; font-size:24px; font-weight:bold;">Are you sure?</span>',
      html: '<p style="color:#5e5d72; font-size:16px;">You will be logged out!</p>',
      icon: 'warning',
      iconColor: '#ffcc00',
      background: '#fff',
      showCancelButton: true,
      confirmButtonColor: '#0858f7',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fas fa-sign-out-alt"></i> Yes, logout!',
      cancelButtonText: '<i class="fas fa-times-circle"></i> Cancel',
      buttonsStyling: true,
      customClass: {
        popup: 'animate__animated animate__fadeInDown',
        confirmButton: 'swal2-confirm-custom',
        cancelButton: 'swal2-cancel-custom'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(adminLogout());
        navigate('/admin/auth'); // Redirect to login page after logout
      }
    });
};

  const isActiveTab = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="admin-layout h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onLogout={handleLogout} onClose={() => setIsSidebarOpen(false)} activeTab={activeTab} isActiveTab={isActiveTab} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AdminHeader onToggleSidebar={handleToggleSidebar} adminName={adminName} adminEmail={adminEmail} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-white shadow-md rounded-md m-4 lg:m-0 lg:ml-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};



const AdminSidebar = ({ isOpen, onClose, onLogout }) => {
  const location = useLocation();

  // Function to determine the active class based on the path
  const isActiveTab = (path) => location.pathname === path;

  return (
    <aside
      className={`fixed inset-y-0 left-0 bg-white text-[#5e5d72] h-full w-full lg:w-64 lg:static lg:block lg:relative transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      style={{ zIndex: 1000 }} // Ensure it stays above other elements
    >
      <button
        className="lg:hidden p-2 text-black hover:text-blue-700 absolute top-0 right-0"
        onClick={onClose}
      >
        <FaTimes />
      </button>
      <nav className="p-4">
        <ul>
          {/* Dashboard */}
          <li className="py-2">
            <Link to="/admin/dashboard" onClick={onClose}>
              <button
                className={`w-full text-left text-xl justify-start rounded-lg py-3 px-4 flex items-center capitalize font-bold text-[15px] font-open-sans 
                ${isActiveTab('/admin/dashboard') ? 'bg-[#f1f1f1] text-[#0858f7]' : 'text-[#5e5d72]'} hover:bg-[#f1f1f1]`}
              >
                <span className="flex items-center justify-center w-[25px] h-[25px] mr-2">
                  <RiDashboardFill className={`${isActiveTab('/admin/dashboard') ? 'text-[#0858f7]' : 'text-[#5e5d72]'} text-[22px]`} />
                </span>
                Dashboard
              </button>
            </Link>
          </li>

          {/* Users */}
          <li className="py-2">
            <Link to="/admin/users" onClick={onClose}>
              <button
                className={`w-full text-left text-xl justify-start rounded-lg py-3 px-4 flex items-center capitalize font-bold text-[15px] font-open-sans 
                ${isActiveTab('/admin/users') ? 'bg-[#f1f1f1] text-[#0858f7]' : 'text-[#5e5d72]'} hover:bg-[#f1f1f1]`}
              >
                <span className="flex items-center justify-center w-[25px] h-[25px] mr-2">
                  <FaUsers className={`${isActiveTab('/admin/users') ? 'text-[#0858f7]' : 'text-[#5e5d72]'} text-[22px]`} />
                </span>
                Users
              </button>
            </Link>
          </li>

          {/* Products */}
          <li className="py-2">
            <Link to="/admin/products" onClick={onClose}>
              <button
                className={`w-full text-left text-xl justify-start rounded-lg py-3 px-4 flex items-center capitalize font-bold text-[15px] font-open-sans 
                ${isActiveTab('/admin/products') ? 'bg-[#f1f1f1] text-[#0858f7]' : 'text-[#5e5d72]'} hover:bg-[#f1f1f1]`}
              >
                <span className="flex items-center justify-center w-[25px] h-[25px] mr-2">
                  <AiFillProduct className={`${isActiveTab('/admin/products') ? 'text-[#0858f7]' : 'text-[#5e5d72]'} text-[22px]`} />
                </span>
                Products
              </button>
            </Link>
          </li>

          {/* Categories */}
          <li className="py-2">
            <Link to="/admin/categories" onClick={onClose}>
              <button
                className={`w-full text-left text-xl justify-start rounded-lg py-3 px-4 flex items-center capitalize font-bold text-[15px] font-open-sans 
                ${isActiveTab('/admin/categories') ? 'bg-[#f1f1f1] text-[#0858f7]' : 'text-[#5e5d72]'} hover:bg-[#f1f1f1]`}
              >
                <span className="flex items-center justify-center w-[25px] h-[25px] mr-2">
                  <FaTags className={`${isActiveTab('/admin/categories') ? 'text-[#0858f7]' : 'text-[#5e5d72]'} text-[22px]`} />
                </span>
                Categories
              </button>
            </Link>
          </li>

          {/* Orders */}
          <li className="py-2">
            <Link to="/admin/orders" onClick={onClose}>
              <button
                className={`w-full text-left text-xl justify-start rounded-lg py-3 px-4 flex items-center capitalize font-bold text-[15px] font-open-sans 
                ${isActiveTab('/admin/orders') ? 'bg-[#f1f1f1] text-[#0858f7]' : 'text-[#5e5d72]'} hover:bg-[#f1f1f1]`}
              >
                <span className="flex items-center justify-center w-[25px] h-[25px] mr-2">
                  <HiShoppingBag className={`${isActiveTab('/admin/orders') ? 'text-[#0858f7]' : 'text-[#5e5d72]'} text-[22px]`} />
                </span>
                Orders
              </button>
            </Link>
          </li>

          {/* Promotions */}
          <li className="py-2">
            <Link to="/admin/promotions" onClick={onClose}>
              <button
                className={`w-full text-left text-xl justify-start rounded-lg py-3 px-4 flex items-center capitalize font-bold text-[15px] font-open-sans 
                ${isActiveTab('/admin/promotions') ? 'bg-[#f1f1f1] text-[#0858f7]' : 'text-[#5e5d72]'} hover:bg-[#f1f1f1]`}
              >
                <span className="flex items-center justify-center w-[25px] h-[25px] mr-2">
                  <FaGift className={`${isActiveTab('/admin/promotions') ? 'text-[#0858f7]' : 'text-[#5e5d72]'} text-[22px]`} />
                </span>
                Promotions
              </button>
            </Link>
          </li>

          {/* Rewards */}
          <li className="py-2">
            <Link to="/admin/rewards" onClick={onClose}>
              <button
                className={`w-full text-left text-xl justify-start rounded-lg py-3 px-4 flex items-center capitalize font-bold text-[15px] font-open-sans 
                ${isActiveTab('/admin/rewards') ? 'bg-[#f1f1f1] text-[#0858f7]' : 'text-[#5e5d72]'} hover:bg-[#f1f1f1]`}
              >
                <span className="flex items-center justify-center w-[25px] h-[25px] mr-2">
                  <FaGifts className={`${isActiveTab('/admin/rewards') ? 'text-[#0858f7]' : 'text-[#5e5d72]'} text-[22px]`} />
                </span>
                Rewards
              </button>
            </Link>
          </li>

          {/* Logout */}
          <li className="py-2">
            <button
              className="w-full text-red-500 text-left text-xl justify-start rounded-lg py-3 px-4 flex items-center capitalize font-bold text-[15px] font-open-sans hover:bg-[#f1f1f1]"
              onClick={onLogout}
            >
              <span className="flex items-center justify-center w-[25px] h-[25px] mr-2">
                <FaSignOutAlt className='text-[22px]' />
              </span>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};


const AdminHeader = ({ onToggleSidebar, adminName, adminEmail }) => {
  return (
    <header className="admin-header overflow-hidden bg-blue-600 text-white py-4 px-6 flex items-center justify-between shadow-md rounded-b-lg">
      <div className="flex items-center">
        <button className="text-white lg:hidden mr-4 hover:text-blue-200 transition duration-300" onClick={onToggleSidebar}>
          <FaBars className="lg:text-2xl text-xl" />
        </button>
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>
      <div className="flex items-center ">
        <div className="mr-4  text-sm text-center ">
          <div className="font-medium">{adminName}</div>
          <div className="text-gray-200 ">{adminEmail}</div>
        </div>
      </div>
    </header>
  );
};


export default AdminLayout;
