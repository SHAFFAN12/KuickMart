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
  const location = useLocation(); // Current URL

  // Determine activeTab based on URL
  const activeTab = () => {
    if (location.pathname === '/admin/dashboard') return 0;
    if (location.pathname === '/admin/users') return 1;
    if (location.pathname === '/admin/products') return 2;
    if (location.pathname === '/admin/categories') return 3;
    if (location.pathname === '/admin/orders') return 4;
    if (location.pathname === '/admin/promotions') return 5;
    if (location.pathname === '/admin/rewards') return 6;
    return -1; // Default for non-matching routes
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 bg-white text-[#5e5d72] h-full w-full lg:w-64 lg:static lg:block lg:relative transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      style={{ zIndex: 1000 }}
    >
      <button
        className="lg:hidden p-2 text-black hover:text-blue-700 absolute top-0 right-0"
        onClick={onClose}
      >
        <FaTimes />
      </button>
      <nav className="p-4">
        <ul>
          <li className="py-2">
            <Link to="/admin/dashboard" onClick={onClose}>
              <button
                className={`w-full text-left text-xl justify-start rounded-lg py-3 px-4 flex items-center capitalize font-bold text-[15px] font-open-sans 
                ${activeTab() === 0 ? 'bg-[#f1f1f1] text-[#0858f7]' : 'text-[#5e5d72]'} hover:bg-[#f1f1f1]`}
              >
                <span className="flex items-center justify-center w-[25px] h-[25px] mr-2">
                  <RiDashboardFill className={`${activeTab() === 0 ? 'text-[#0858f7]' : 'text-[#5e5d72]'} text-[22px]`} />
                </span>
                Dashboard
              </button>
            </Link>
          </li>

          {/* Similar code for Users, Products, Categories, etc. */}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;

const AdminHeader = ({ onToggleSidebar, adminName, adminEmail }) => {
  return (
    <header className="admin-header bg-blue-600 text-white py-4 px-6 flex items-center justify-between shadow-md rounded-b-lg">
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
