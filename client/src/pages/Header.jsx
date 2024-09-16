import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, handleGoogleLoginCallback } from './Public/redux/actions/authAction';
import GoogleLogin from './Public/GoogleLogin';
import { FaShoppingCart, FaSignOutAlt, FaBars, FaHistory, FaTrophy } from 'react-icons/fa';
import Swal from 'sweetalert2';
import NotificationComponent from './Public/Notification';
import axiosInstance from '../publicaxios'; // Import the configured Axios instance
import Footer from './Footer';

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [rewardsPoints, setRewardsPoints] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.cart.cartItems || []); // Ensure cartItems is always an array
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userStr = urlParams.get('user');

    if (token) {
      const parsedUser = userStr ? JSON.parse(decodeURIComponent(userStr)) : null;
      dispatch(handleGoogleLoginCallback(parsedUser, token));
      navigate('/'); // Redirect to home or desired page
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (user) {
      const fetchRewards = async () => {
        try {
          const response = await axiosInstance.get(`/rewards`);
          setRewardsPoints(response.data.points);
        } catch (error) {
          console.error('Error fetching rewards:', error);
        }
      };

      fetchRewards();
    }
  }, [user]);

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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <NotificationComponent />
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-lg">
        <Link to="/" className="text-2xl font-bold">Apna Store</Link>
        <div className="relative flex items-center space-x-4">
          <button
            className="block md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
          >
            <FaBars size={24} />
          </button>
          <nav
            ref={menuRef}
            className={`absolute top-16 right-0 w-64 py-5 bg-gray-800 text-white rounded-lg shadow-md md:flex md:items-center md:static md:bg-transparent md:shadow-none md:rounded-none z-40 ${menuOpen ? 'block' : 'hidden'}`}
          >
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center px-4 py-2 border-b border-gray-700">
                  <img src={user.image} alt="User" className="w-10 h-10 rounded-full mr-3" />
                  <span className="text-lg font-semibold">{user.name}</span>
                </div>
                <div className="flex items-center px-4 py-2 border-b border-gray-700">
                  <FaTrophy className="text-yellow-500 mr-2" />
                  <span className="text-lg font-semibold">Points: {rewardsPoints !== null ? rewardsPoints : 'Loading...'}</span>
                </div>
                <Link
                  to="/order-history"
                  className="flex items-center px-4 py-2 hover:bg-gray-700 transition duration-300"
                >
                  <FaHistory className="mr-2" />
                  Order History
                </Link>
                <Link
                  to="/cart"
                  className="flex items-center px-4 py-2 hover:bg-gray-700 transition duration-300"
                >
                  <FaShoppingCart className="mr-2" />
                  Cart ({cart.length})
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 w-full text-left hover:bg-gray-700 transition duration-300"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="m-2 mx-3">
                <GoogleLogin />
              </div>
            )}
          </nav>
          {user && (
            <button
              className="hidden md:flex items-center space-x-4"
              onClick={toggleMenu}
            >
              <img src={user.image} alt="User" className="w-8 h-8 rounded-full" />
              <span className="hidden md:block">{user.name}</span>
            </button>
          )}
        </div>
      </header>
      <main className="flex-grow p-4">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
};

export default Layout;
