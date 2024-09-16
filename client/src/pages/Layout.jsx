import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, handleGoogleLoginCallback } from './Public/redux/actions/authAction';
import GoogleLogin from './Public/GoogleLogin';
import { FaShoppingCart, FaSignOutAlt, FaBars, FaHistory, FaTrophy, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import NotificationComponent from './Public/Notification';
import axiosInstance from '../publicaxios';
import Footer from './Footer';
import BottomNavbar from './BottomNavbar';

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [rewardsPoints, setRewardsPoints] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.cart.cartItems || []);
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
      navigate('/customer-dashboard');
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

  const handleSearchClick = () => {
    Swal.fire({
      title: 'Search Products',
      input: 'text',
      inputPlaceholder: 'Enter search term...',
      showCancelButton: true,
      confirmButtonText: 'Search',
      showLoaderOnConfirm: true,
      preConfirm: (searchTerm) => {
        if (searchTerm) {
          navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
        } else {
          Swal.showValidationMessage('Please enter a search term');
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    });
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen  flex flex-col bg-gray-100">
      <div className='bg-blue-200'>
        <NotificationComponent />
      </div>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex flex-wrap items-center   p-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-green-600 transition duration-300">SHOPSPHERE<span className="text-green-600">.</span></Link>
            <div className="relative hidden md:block">
              <button 
                className="bg-blue-400 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300" 
                onClick={() => setMenuOpen(!menuOpen)}
              >
                Categories
              </button>
              <div className={`absolute top-full left-0 w-48 bg-white border border-gray-300 rounded shadow-lg mt-2 ${menuOpen ? 'block' : 'hidden'}`}>
                {categories.map(category => (
                  <Link 
                    key={category._id} 
                    to={`/products?category=${category.name}`}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-200"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="relative flex  items-center space-x-4">
            <button
              className="block md:hidden max-lg:relative left-[10rem] text-green-500 focus:outline-none"
              onClick={toggleMenu}
            >
              <FaBars size={24} />
            </button>
            
            <nav
              ref={menuRef}
              className={`max-lg:absolute top-[3rem] right-[-10rem] w-full max-lg:w-[20rem] lg:w-[15rem]   rounded-lg shadow-lg md:flex md:items-center md:static  bg-white  md:shadow-none md:rounded-none z-40 ${menuOpen ? 'block' : 'hidden'}`}
            >
              {user ? (
                <div className=" lg:ml-[45rem] space-y-2 md:flex md:space-y-0 md:space-x-4 md:items-center">
                  <div className="flex items-center px-4 py-2 lg:hidden border-b border-gray-700 md:border-none md:p-0">
                    <img src={user.image} alt="User" className="  w-10 h-10 rounded-full mr-3" />
                    <span className="text-lg font-semibold">{user.name}</span>
                  </div>
                  <div className="flex items-center px-4 py-2 border-b border-gray-700 md:border-none md:p-0">
                    <FaTrophy className="text-yellow-500 mr-2" />
                    <span className="text-lg font-semibold">Points: {rewardsPoints !== null ? rewardsPoints : 'Loading...'}</span>
                  </div>
                  <Link
                    to="/order-history"
                    className="flex items-center px-4 py-2 hover:bg-gray-700 md:hover:bg-transparent transition duration-300"
                  >
                    <FaHistory className="mr-2" />
                    Order History
                  </Link>
                  <Link
                    to="/cart"
                    className="flex items-center px-4 py-2 hover:bg-gray-700 md:hover:bg-transparent transition duration-300"
                  >
                    <FaShoppingCart className="mr-2" />
                    Cart ({cart.length})
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 w-full text-left text-red-500 hover:bg-gray-700 md:hover:bg-transparent transition duration-300"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className='lg:ml-[15rem]  max-lg:w-[12rem] max-lg:p-4    max-lg:rounded-lg    max-lg:bg-white   md:rounded-none z-40 '>
                <div className=" ">
                  <div className="lg:mt-4  ">
                    <div className="grid grid-cols-5 max-lg:grid-cols-1 gap-5 lg:items-center  lg:w-[30rem] lg:m-5 ">
                      <Link to="/" className="text-lg text-gray-800  hover:text-green-600">Home</Link>
                      <Link to="/about" className="text-lg  text-gray-800 hover:text-green-600">About Us</Link>
                      <Link to="/products" className="text-lg text-gray-800 hover:text-green-600">Products</Link>
                      <Link to="/terms" className="text-lg text-gray-800 hover:text-green-600">Terms & Conditions</Link>
                     <button className='lg:hidden flex justify-between   ' onClick={handleSearchClick}>

                       <p>  Search</p>
                      <FaSearch
                        size={24}
                        className="text-gray-800 cursor-pointer hover:text-green-600 transition duration-300"
                        onClick={handleSearchClick}
                        />
                        </button>


                        <FaSearch
                        size={24}
                        className="max-lg:hidden text-gray-800 cursor-pointer hover:text-green-600 transition duration-300"
                        onClick={handleSearchClick}
                        />
                  <div className='lg:absolute right-[-55rem]'>
                    <GoogleLogin />
                    </div>
                    </div>
                        </div>
                  </div>
                </div>
              )}
            </nav>
            {user && (
              <button
                className="hidden md:flex items-center space-x-4"
                onClick={toggleMenu}
              >
                <img src={user.image} alt="User" className="w-8 h-8 rounded-full" />
                <span className="hidden md:block text-gray-800">{user.name}</span>
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <Outlet />
      </main>

<BottomNavbar/>

      <Footer />
    </div>
  );
};

export default Layout;
