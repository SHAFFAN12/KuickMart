import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, handleGoogleLoginCallback } from './Public/redux/actions/authAction';
import Swal from 'sweetalert2';
import axiosInstance from '../publicaxios';
import Footer from './Footer';
import BottomNavbar from './BottomNavbar';
import logo from '../assets/logo2.png';
import { IoMdSearch } from 'react-icons/io';
import { IoMenu } from 'react-icons/io5';
import { FaShoppingCart, FaSignOutAlt, FaHistory, FaTrophy, FaAngleDown } from 'react-icons/fa';
import GoogleLogin from './Public/GoogleLogin';
import { FaRegUser } from "react-icons/fa6";
import { HiOutlineShoppingBag } from "react-icons/hi2";

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [rewardsPoints, setRewardsPoints] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.cart.cartItems || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  useEffect(() => {
    if (user) {
      const fetchRewards = async () => {
        try {
          const response = await axiosInstance.get('/rewards');
          setRewardsPoints(response.data.points);
        } catch (error) {
          console.error('Error fetching rewards:', error);
        }
      };
      fetchRewards();
    }
  }, [user]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
    if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
      setUserMenuOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userStr = urlParams.get('user');

    if (token) {
      const parsedUser = userStr ? JSON.parse(decodeURIComponent(userStr)) : null;
      dispatch(handleGoogleLoginCallback(parsedUser, token));
      navigate('/customer-dashboard');
    }
  }, [dispatch, navigate]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out from your account.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        Swal.fire('Logged Out!', 'You have been logged out successfully.', 'success');
        navigate('/');
      }
    });
  };


  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo on the left */}
          <img src={logo} alt="Logo" className="h-auto w-[150px]" />

          {/* Search box in the center */}
          <div className="flex-1 max-w-xl mx-auto flex items-center">
            <div className="flex items-center bg-gray-100 p-2 rounded-full shadow-md w-full border border-gray-300 focus-within:border-blue-500 transition duration-300">
              <IoMdSearch className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search for products..."
                className="bg-transparent focus:outline-none flex-1 px-2 text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearch}
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
  {user && (
    <>
      {/* User button */}
      <div className="relative">
        <button
          onClick={toggleUserMenu}
          className="bg-white w-12 h-12 border-2 border-gray-300 rounded-full flex items-center justify-center p-2 text-xl transition-all duration-300 transform hover:bg-blue-500 hover:border-blue-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FaRegUser className="text-gray-700 transition-colors duration-300 hover:text-white" />
        </button>

        {/* User dropdown menu */}
        {userMenuOpen && (
          <div
            ref={userMenuRef}
            className="absolute right-0 top-14 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            <ul className="p-4 space-y-2">
              {/* User Info */}
              <li className="flex items-center space-x-3 p-2 bg-gray-50 rounded-md shadow-sm">
                <img
                  src={user.image}
                  alt="User"
                  className="w-12 h-12 rounded-full shadow-md"
                />
                <div>
                  <p className="text-base font-bold text-gray-800">{user.name}</p>
                  <span className="text-sm text-gray-500">Member</span>
                </div>
              </li>

              <hr className="border-t border-gray-300" />

              {/* Rewards Points */}
              <li className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                <div className="flex items-center space-x-2">
                  <FaTrophy className="text-yellow-500" />
                  <span className="text-sm font-semibold text-gray-700">Points</span>
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {rewardsPoints !== null ? rewardsPoints : '0'}
                </span>
              </li>

              {/* Order History */}
              <li>
                <Link
                  to="/order-history"
                  className="flex items-center p-2 rounded-md hover:bg-gray-50"
                >
                  <FaHistory className="mr-2 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Order History
                  </span>
                </Link>
              </li>

              {/* Logout Option */}
              <li
                className="flex items-center p-2 text-red-600 rounded-md hover:bg-red-50 cursor-pointer"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="mr-2" />
                <span className="text-sm font-medium">Logout</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Shopping bag button */}
      <div className="relative">
        <Link to="/cart">
          <button className="bg-white w-12 h-12 border-2 border-gray-300 rounded-full p-2 text-xl transition-all duration-300 transform hover:bg-blue-500 hover:border-blue-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center">
            <HiOutlineShoppingBag className="text-gray-700 transition-colors duration-300 hover:text-white" />
          </button>
        </Link>

        {/* Cart length badge */}
        {cart.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {cart.length}
          </span>
        )}
      </div>
    </>
  )}
</div>



          {/* Google login button on the right (visible if not logged in) */}
          {!user && (
            <div className="flex items-center space-x-4">
              <GoogleLogin />
            </div>
          )}
        </div>


        <nav ref={menuRef} className="flex justify-between items-center px-4 mt-2">
          {/* Categories button */}
          <div className="relative">
            <button
              className="bg-[#2bbef9] text-white font-bold rounded-md px-3 py-1.5 flex items-center"
              onClick={toggleMenu}
            >
              <IoMenu className="mr-2" size={24} />
              All Categories
              <FaAngleDown className="ml-2" size={20} />
            </button>

            {menuOpen && (
              <ul className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-10 transition-all duration-300 ease-out  scale-90 group-hover:opacity-100 group-hover:scale-100">
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className="px-6 py-3 text-lg font-medium text-gray-700 hover:bg-blue-500 hover:text-white rounded-lg cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-100"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(`/categories/${category.id}`);
                    }}
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            )}

          </div>

          {/* Links aligned to the right */}
          <div className="flex items-center space-x-6">
            {/* {user ? (
              <>
                <div className="flex items-center">
                  <FaTrophy className="text-yellow-500 mr-2" />
                  <span className="text-lg font-semibold text-gray-800">
                    Points: {rewardsPoints !== null ? rewardsPoints : '0'}
                  </span>
                </div>

                <Link
                  to="/order-history"
                  className="text-[14px] font-semibold text-gray-700 uppercase px-[15px] py-[8px] transition hover:bg-gray-100 rounded-md flex items-center"
                >
                  <FaHistory className="mr-2" />
                  Order History
                </Link>

                <Link
                  to="/cart"
                  className="text-[14px] font-semibold text-gray-700 uppercase px-[15px] py-[8px] transition hover:bg-gray-100 rounded-md flex items-center"
                >
                  <FaShoppingCart className="mr-2" />
                  Cart ({cart.length})
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-red-500 hover:bg-gray-100 transition rounded-md"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </>
            ) : ( */}
            <div className="flex space-x-6">
              <Link
                to="/"
                className="text-[14px] font-semibold text-[rgba(0,0,0,0.7)] uppercase px-[15px] py-[8px] transition hover:bg-[#F6FAFD]"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-[14px] font-semibold text-[rgba(0,0,0,0.7)] uppercase px-[15px] py-[8px] transition hover:bg-[#F6FAFD]"
              >
                About Us
              </Link>
              <Link
                to="/products"
                className="text-[14px] font-semibold text-[rgba(0,0,0,0.7)] uppercase px-[15px] py-[8px] transition hover:bg-[#F6FAFD]"
              >
                Products
              </Link>
              <Link
                to="/terms"
                className="text-[14px] font-semibold text-[rgba(0,0,0,0.7)] uppercase px-[15px] py-[8px] transition hover:bg-[#F6FAFD]"
              >
                Terms & Conditions
              </Link>
            </div>
            {/* )} */}
          </div>
        </nav>
        <hr className="mt-2 mb-1" />
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <BottomNavbar />
      <Footer />
    </div>
  );
};

export default Layout;