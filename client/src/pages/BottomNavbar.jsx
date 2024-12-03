import React from 'react';
import { FaSearch, FaHistory, FaShoppingCart, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './Public/redux/actions/authAction'; // Adjust the path as needed
import { LuLayoutGrid } from "react-icons/lu";
import { IoHomeOutline } from "react-icons/io5";
import { CiShoppingCart } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
// import CatSidebar from './CatSidebar';

const BottomNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

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
  if (!user) {
    return null; // Don't render the BottomNavbar if the user is not logged in
  }
  return (
    <div className="fixed bottom-0 w-full bg-white shadow-md md:hidden">
      <div className="container mx-auto">
        <div className="flex justify-around py-3 text-gray-600">
          <button
            className="flex flex-col items-center text-sm text-[#2bbef9] transition duration-300"
            onClick={() => navigate('/customer-dashboard')}
          >
            <IoHomeOutline size={24} />
            <span>Home</span>
          </button>
          <button
            className="flex flex-col items-center text-sm text-[#2bbef9] transition duration-300"
            // onClick={() => navigate(`${<CatSidebar/>}`)}
          >
            <LuLayoutGrid size={24} />
            <span>Category</span>
          </button>
          <button
            className="flex flex-col items-center text-sm text-[#2bbef9] transition duration-300"
            onClick={() => navigate('/cart')}
          >
            <CiShoppingCart size={24} />
            <span>Cart</span>
          </button>
          <button
            className="flex flex-col items-center text-sm text-[#2bbef9] transition duration-300"
            onClick={handleLogout}
          >
            <IoIosLogOut size={24} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default BottomNavbar;